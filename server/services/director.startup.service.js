import User from "../models/User.js";
import StartupProfile from "../models/StartupProfile.js";
import Notification from "../models/Notification.js";
import { getPagination } from "../utils/pagination.js";

export const getDirectorStartupSummaries = async (directorId, queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not assigned to a directorate");
  }

  const filter = {
    "incubation.center": director.directorate._id,
    status: { $in: ["approved", "incubating", "graduated"] },
  };

  const total = await StartupProfile.countDocuments(filter);

  const startups = await StartupProfile.find(filter)
    .populate("user", "fullName email phone")
    .populate("incubation.mentor", "fullName email position")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  return {
    success: true,
    data: startups.map((s) => ({
      startup: s.user,
      mentor: s.incubation?.mentor || null,
      mentorAssignedAt: s.incubation?.mentorAssignedAt,
      companyName: s.companyName,
      registrationNumber: s.registrationNumber,
      sector: s.sector,
      description: s.description,
      website: s.website,
      founders: s.founders,
      employeeCount: s.employeeCount,
      status: s.status,
      documents: s.documents,
      incubation: s.incubation,
      milestones: s.incubation?.milestones || [],
      stage: s.incubation?.stage,
      fundingStage: s.incubation?.fundingStage,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStartupProgress = async (directorId, startupId) => {
  const director = await User.findById(directorId).populate("directorate");

  const profile = await StartupProfile.findOne({
    user: startupId,
    "incubation.center": director.directorate._id,
  })
    .populate("user", "fullName email")
    .populate("incubation.mentor", "fullName email position");

  if (!profile) throw new Error("Startup not found in your directorate");

  const milestones = profile.incubation?.milestones || [];

  const stats = {
    totalMilestones: milestones.length,
    completedMilestones: milestones.filter((m) => m.status === "completed")
      .length,
    inProgressMilestones: milestones.filter((m) => m.status === "in_progress")
      .length,
    currentStage: profile.incubation?.stage || "idea",
    fundingStage: profile.incubation?.fundingStage || "bootstrapped",
    employeeCount: profile.employeeCount,
    founderCount: profile.founders?.length || 0,
  };

  return {
    success: true,
    startup: profile.user,
    mentor: profile.incubation?.mentor,
    mentorAssignedAt: profile.incubation?.mentorAssignedAt,
    stats,
    milestones,
    companyDetails: {
      name: profile.companyName,
      registrationNumber: profile.registrationNumber,
      sector: profile.sector,
      description: profile.description,
      website: profile.website,
    },
  };
};

export const assignMentor = async (directorId, startupId, mentorId) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const startupUser = await User.findById(startupId);
  if (!startupUser || !startupUser.startupProfile) {
    throw new Error("Startup not found");
  }

  const profile = await StartupProfile.findOne({
    user: startupId,
    "incubation.center": director.directorate._id,
  });

  if (!profile) {
    throw new Error("Startup not found in your directorate");
  }

  const mentor = await User.findById(mentorId);
  if (!mentor) {
    throw new Error("Mentor not found");
  }

  if (
    !["mentor", "technical_staff", "advisor", "trainer"].includes(
      mentor.position,
    )
  ) {
    throw new Error(
      "Invalid mentor. Must be mentor, technical_staff, advisor, or trainer",
    );
  }

  if (!profile.incubation) {
    profile.incubation = {};
  }

  profile.incubation.mentor = mentorId;
  profile.incubation.mentorAssignedAt = new Date();
  profile.incubation.mentorAssignedBy = directorId;

  await profile.save();

  await Notification.create({
    user: startupId,
    title: "Mentor Assigned 🎯",
    message: `${mentor.fullName} has been assigned as your mentor. They will guide you through your startup journey.`,
    type: "success",
  });

  await Notification.create({
    user: mentorId,
    title: "New Startup Assigned",
    message: `You have been assigned as mentor for ${startupUser.fullName}'s startup "${profile.companyName}".`,
    type: "assignment",
    relatedTo: { model: "StartupProfile", id: profile._id },
    actionUrl: `/mentor/startups/${startupId}`,
  });

  return {
    success: true,
    message: `Mentor ${mentor.fullName} assigned to ${startupUser.fullName}'s startup`,
    profile,
  };
};

export const removeMentor = async (directorId, startupId) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const profile = await StartupProfile.findOne({
    user: startupId,
    "incubation.center": director.directorate._id,
  });

  if (!profile) {
    throw new Error("Startup not found in your directorate");
  }

  const previousMentor = profile.incubation?.mentor;

  profile.incubation.mentor = null;
  profile.incubation.mentorAssignedAt = null;
  profile.incubation.mentorAssignedBy = null;
  await profile.save();

  if (previousMentor) {
    await Notification.create({
      user: previousMentor,
      title: "Mentor Assignment Removed",
      message: `You are no longer the mentor for this startup`,
      type: "warning",
    });
  }

  await Notification.create({
    user: startupId,
    title: "Mentor Removed",
    message: `Your mentor has been reassigned. A new mentor will be assigned soon.`,
    type: "info",
  });

  return {
    success: true,
    message: "Mentor removed successfully",
  };
};

export const updateStartupStatus = async (directorId, startupId, status) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const allowedStatuses = ["incubating", "graduated", "exited"];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
  }

  const profile = await StartupProfile.findOne({
    user: startupId,
    "incubation.center": director.directorate._id,
  }).populate("user", "fullName email");

  if (!profile) {
    throw new Error("Startup not found in your directorate");
  }

  profile.status = status;
  if (status === "graduated") {
    profile.incubation.endDate = new Date();
  }
  await profile.save();

  await Notification.create({
    user: startupId,
    title: `Startup Status Updated to ${status}`,
    message: `Your startup status has been updated to ${status}`,
    type: status === "graduated" ? "success" : "info",
  });

  return {
    success: true,
    message: `Startup status updated to ${status}`,
    profile,
  };
};
