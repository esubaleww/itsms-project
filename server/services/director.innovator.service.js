import User from "../models/User.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import Notification from "../models/Notification.js";
import { getPagination } from "../utils/pagination.js";

export const assignMentor = async (directorId, innovatorId, mentorId) => {
  const director = await User.findById(directorId);

  if (!director || director.position !== "director") {
    throw new Error("Only director can assign mentors");
  }

  const innovatorUser = await User.findById(innovatorId);
  if (!innovatorUser || !innovatorUser.innovatorProfile) {
    throw new Error("Invalid innovator");
  }

  const profile = await InnovatorProfile.findById(
    innovatorUser.innovatorProfile,
  );
  if (!profile) throw new Error("Innovator profile not found");

  const mentor = await User.findById(mentorId);
  if (
    !mentor ||
    !["technical_staff", "trainer", "mentor", "advisor"].includes(
      mentor.position,
    )
  ) {
    throw new Error(
      "Invalid mentor. Must be technical_staff, trainer, mentor, or advisor",
    );
  }

  if (
    profile.incubation?.center?.toString() !== director.directorate?.toString()
  ) {
    throw new Error("Innovator not in your directorate");
  }

  profile.incubation = {
    ...profile.incubation,
    mentor: mentorId,
    mentorAssignedAt: new Date(),
    mentorAssignedBy: directorId,
  };

  await profile.save();

  await Notification.create({
    user: innovatorId,
    title: "Mentor Assigned",
    message: `${mentor.fullName} is now your mentor`,
    type: "success",
  });

  await Notification.create({
    user: mentorId,
    title: "New Innovator Assigned",
    message: `You are now mentor for ${innovatorUser.fullName}`,
    type: "assignment",
  });

  return { success: true, profile };
};

export const getDirectorInnovatorSummaries = async (
  directorId,
  queryParams,
) => {
  const { page, limit, skip } = getPagination(queryParams);

  const director = await User.findById(directorId);
  if (!director || !director.directorate) {
    throw new Error("Director not assigned to a directorate");
  }

  const filter = {
    "incubation.center": director.directorate,
    status: { $in: ["approved", "incubating", "graduated"] },
  };

  const total = await InnovatorProfile.countDocuments(filter);

  const innovators = await InnovatorProfile.find(filter)
    .populate("user", "fullName email phone")
    .populate("incubation.mentor", "fullName email position")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  return {
    success: true,
    data: innovators.map((i) => ({
      innovator: i.user,
      mentor: i.incubation?.mentor || null,
      mentorAssignedAt: i.incubation?.mentorAssignedAt,
      ideaTitle: i.ideaTitle,
      ideaDescription: i.ideaDescription,
      problemSolved: i.problemSolved,
      targetMarket: i.targetMarket,
      institution: i.institution,
      education: i.education,
      status: i.status,
      documents: i.documents,
      milestones: i.incubation?.milestones || [],
      incubationStage: i.incubation?.stage,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getInnovatorProgress = async (directorId, innovatorId) => {
  const director = await User.findById(directorId);

  const profile = await InnovatorProfile.findOne({
    user: innovatorId,
    "incubation.center.directorate": director.directorate,
  })
    .populate("user", "fullName email")
    .populate("incubation.mentor", "fullName");

  if (!profile) throw new Error("Innovator not found in your directorate");

  const milestones = profile.incubation?.milestones || [];

  const stats = {
    totalMilestones: milestones.length,
    completedMilestones: milestones.filter((m) => m.status === "completed")
      .length,
    inProgressMilestones: milestones.filter((m) => m.status === "in_progress")
      .length,
    currentStage: profile.incubation?.stage || "idea",
    fundingStage: profile.incubation?.fundingStage || "bootstrapped",
    latestMilestone: milestones[milestones.length - 1],
  };

  return {
    success: true,
    innovator: profile.user,
    mentor: profile.incubation?.mentor,
    stats,
    milestones,
    ideaDetails: {
      title: profile.ideaTitle,
      description: profile.ideaDescription,
      problemSolved: profile.problemSolved,
      targetMarket: profile.targetMarket,
    },
  };
};
export const updateInnovatorStatus = async (
  directorId,
  innovatorId,
  status,
) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const allowedStatuses = ["incubating", "graduated", "rejected"];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
  }

  const profile = await InnovatorProfile.findOne({
    user: innovatorId,
    "incubation.center": director.directorate._id,
  }).populate("user", "fullName email");

  if (!profile) {
    throw new Error("Innovator not found in your directorate");
  }

  profile.status = status;
  if (status === "graduated") {
    profile.incubation.endDate = new Date();
  }
  await profile.save();

  await Notification.create({
    user: innovatorId,
    title: `Innovation Status Updated to ${status}`,
    message: `Your innovation status has been updated to ${status}`,
    type: status === "graduated" ? "success" : "info",
  });

  return {
    success: true,
    message: `Innovator status updated to ${status}`,
    profile,
  };
};
