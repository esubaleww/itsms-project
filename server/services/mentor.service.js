import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getPagination } from "../utils/pagination.js";

export const getMyMentees = async (mentorId, type, queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  const mentor = await User.findById(mentorId);
  if (!mentor) throw new Error("Mentor not found");

  let ProfileModel;
  if (type === "innovator") {
    ProfileModel = InnovatorProfile;
  } else if (type === "startup") {
    ProfileModel = StartupProfile;
  } else {
    throw new Error("Invalid type. Must be 'innovator' or 'startup'");
  }

  const filter = {
    "incubation.mentor": mentorId,
    status: { $in: ["approved", "incubating", "graduated"] },
  };

  const total = await ProfileModel.countDocuments(filter);

  const mentees = await ProfileModel.find(filter)
    .populate("user", "fullName email phone")
    .populate("incubation.center", "name type")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const formattedMentees = mentees.map((m) => ({
    mentee: m.user,
    ideaTitle: m.ideaTitle,
    companyName: m.companyName,
    status: m.status,
    milestones: m.incubation?.milestones || [],
    stage: m.incubation?.stage,
    startDate: m.incubation?.startDate,
  }));

  return {
    success: true,
    data: formattedMentees,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMenteeProgress = async (mentorId, menteeId, type) => {
  let ProfileModel;
  if (type === "innovator") {
    ProfileModel = InnovatorProfile;
  } else if (type === "startup") {
    ProfileModel = StartupProfile;
  } else {
    throw new Error("Invalid type. Must be 'innovator' or 'startup'");
  }

  const profile = await ProfileModel.findOne({
    user: menteeId,
    "incubation.mentor": mentorId,
  }).populate("user", "fullName email");

  if (!profile) throw new Error("Mentee not found or not assigned to you");

  const milestones = profile.incubation?.milestones || [];
  const completed = milestones.filter((m) => m.status === "completed").length;
  const inProgress = milestones.filter(
    (m) => m.status === "in_progress",
  ).length;

  return {
    success: true,
    mentee: profile.user,
    stats: {
      totalMilestones: milestones.length,
      completed,
      inProgress,
      pending: milestones.length - completed - inProgress,
      completionRate:
        milestones.length > 0
          ? Math.round((completed / milestones.length) * 100)
          : 0,
      currentStage: profile.incubation?.stage,
      fundingStage: profile.incubation?.fundingStage,
      startDate: profile.incubation?.startDate,
    },
    milestones,
    ideaDetails:
      type === "innovator"
        ? {
            title: profile.ideaTitle,
            description: profile.ideaDescription,
            problemSolved: profile.problemSolved,
            targetMarket: profile.targetMarket,
          }
        : {
            companyName: profile.companyName,
            registrationNumber: profile.registrationNumber,
            sector: profile.sector,
            description: profile.description,
          },
  };
};

export const reviewMilestone = async (
  mentorId,
  menteeId,
  milestoneId,
  type,
  feedback,
) => {
  let ProfileModel;
  if (type === "innovator") {
    ProfileModel = InnovatorProfile;
  } else if (type === "startup") {
    ProfileModel = StartupProfile;
  } else {
    throw new Error("Invalid type");
  }

  const profile = await ProfileModel.findOne({
    user: menteeId,
    "incubation.mentor": mentorId,
  }).populate("user", "fullName");

  if (!profile) throw new Error("Mentee not found or not assigned to you");

  const milestone = profile.incubation?.milestones?.find(
    (m) => m._id.toString() === milestoneId,
  );
  if (!milestone) throw new Error("Milestone not found");

  milestone.feedback = feedback;
  milestone.feedbackGivenAt = new Date();
  milestone.feedbackBy = mentorId;

  await profile.save();

  await Notification.create({
    user: menteeId,
    title: "Milestone Feedback Received",
    message: `Your mentor has provided feedback on milestone "${milestone.title}"`,
    type: "info",
  });

  return {
    success: true,
    message: `Feedback added successfully`,
    milestone,
  };
};

export const addMilestone = async (mentorId, menteeId, type, milestoneData) => {
  let ProfileModel;
  if (type === "innovator") {
    ProfileModel = InnovatorProfile;
  } else if (type === "startup") {
    ProfileModel = StartupProfile;
  } else {
    throw new Error("Invalid type");
  }

  const profile = await ProfileModel.findOne({
    user: menteeId,
    "incubation.mentor": mentorId,
  });

  if (!profile) throw new Error("Mentee not found or not assigned to you");

  if (!profile.incubation) profile.incubation = {};
  if (!profile.incubation.milestones) profile.incubation.milestones = [];

  const newMilestone = {
    title: milestoneData.title,
    description: milestoneData.description,
    dueDate: milestoneData.dueDate || null,
    status: "pending",
  };

  if (milestoneData.files && milestoneData.files.length > 0) {
    newMilestone.resources = milestoneData.files;
  }

  profile.incubation.milestones.push(newMilestone);

  await profile.save();

  await Notification.create({
    user: menteeId,
    title: "New Milestone Added",
    message: `Your mentor has added a new milestone: "${milestoneData.title}"`,
    type: "info",
  });

  return {
    success: true,
    message: "Milestone added successfully",
    milestones: profile.incubation.milestones,
  };
};
export const getMentorStats = async (mentorId) => {
  const [innovators, startups] = await Promise.all([
    InnovatorProfile.countDocuments({ "incubation.mentor": mentorId }),
    StartupProfile.countDocuments({ "incubation.mentor": mentorId }),
  ]);

  const totalMentees = innovators + startups;

  return {
    totalMentees,
    innovators,
    startups,
  };
};

export const getMentorDashboard = async (mentorId) => {
  const [stats, recentInnovators, recentStartups] = await Promise.all([
    getMentorStats(mentorId),
    getMyMentees(mentorId, "innovator", { page: 1, limit: 5, skip: 0 }),
    getMyMentees(mentorId, "startup", { page: 1, limit: 5, skip: 0 }),
  ]);

  return {
    success: true,
    stats,
    recentInnovators: recentInnovators.data,
    recentStartups: recentStartups.data,
  };
};
export const submitMentorSummary = async (
  mentorId,
  menteeId,
  type,
  summaryData,
) => {
  let ProfileModel;
  if (type === "innovator") {
    ProfileModel = InnovatorProfile;
  } else if (type === "startup") {
    ProfileModel = StartupProfile;
  } else {
    throw new Error("Invalid type");
  }

  const profile = await ProfileModel.findOne({
    user: menteeId,
    "incubation.mentor": mentorId,
  }).populate("user", "fullName email");

  if (!profile) throw new Error("Mentee not found or not assigned to you");

  profile.mentorSummary = {
    overallProgress: summaryData.overallProgress,
    strengths: summaryData.strengths,
    areasForImprovement: summaryData.areasForImprovement,
    recommendation: summaryData.recommendation,
    comments: summaryData.comments,
    submittedAt: new Date(),
    submittedBy: mentorId,
    status: "pending_director_review",
  };

  await profile.save();

  const director = await User.findOne({
    directorate: profile.incubation?.center,
    position: "director",
  });

  if (director) {
    await Notification.create({
      user: director._id,
      title: "Mentor Summary Submitted",
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} ${profile.user.fullName} has been evaluated by their mentor`,
      type: "report",
      metadata: {
        menteeId,
        menteeName: profile.user.fullName,
        type,
      },
    });
  }

  return {
    success: true,
    message: "Mentor summary submitted to director",
    summary: profile.mentorSummary,
  };
};

export const updateMenteeStatus = async (mentorId, menteeId, type, status) => {
  let ProfileModel;
  if (type === "innovator") {
    ProfileModel = InnovatorProfile;
  } else if (type === "startup") {
    ProfileModel = StartupProfile;
  } else {
    throw new Error("Invalid type");
  }

  const profile = await ProfileModel.findOne({
    user: menteeId,
    "incubation.mentor": mentorId,
  });

  if (!profile) throw new Error("Mentee not found or not assigned to you");

  const oldStatus = profile.status;
  profile.status = status;

  if (status === "incubating" && !profile.incubation?.startDate) {
    profile.incubation.startDate = new Date();
  }

  if (status === "graduated" && !profile.incubation?.endDate) {
    profile.incubation.endDate = new Date();
  }

  await profile.save();

  await Notification.create({
    user: menteeId,
    title: "Program Status Updated",
    message: `Your program status has been updated from ${oldStatus} to ${status}`,
    type: "info",
  });

  return {
    success: true,
    message: `Status updated from ${oldStatus} to ${status}`,
    status: profile.status,
  };
};
