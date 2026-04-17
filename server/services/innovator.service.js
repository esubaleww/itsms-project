import InnovatorProfile from "../models/InnovatorProfile.js";

export const getMyMilestones = async (userId) => {
  const profile = await InnovatorProfile.findOne({ user: userId });
  if (!profile) throw new Error("Innovator profile not found");

  const milestones = profile.incubation?.milestones || [];
  const stats = {
    total: milestones.length,
    completed: milestones.filter((m) => m.status === "completed").length,
    inProgress: milestones.filter((m) => m.status === "in_progress").length,
    pending: milestones.filter((m) => m.status === "pending").length,
    completionRate:
      milestones.length > 0
        ? Math.round(
            (milestones.filter((m) => m.status === "completed").length /
              milestones.length) *
              100,
          )
        : 0,
  };

  return {
    success: true,
    milestones,
    stats,
    currentStage: profile.incubation?.stage || "idea",
    fundingStage: profile.incubation?.fundingStage || "bootstrapped",
  };
};

export const updateMilestoneStatus = async (userId, milestoneId, status) => {
  const profile = await InnovatorProfile.findOne({ user: userId });
  if (!profile) throw new Error("Innovator profile not found");

  const milestone = profile.incubation?.milestones?.find(
    (m) => m._id.toString() === milestoneId,
  );
  if (!milestone) throw new Error("Milestone not found");

  milestone.status = status;
  if (status === "completed") {
    milestone.completedAt = new Date();
  }

  await profile.save();

  return {
    success: true,
    message: `Milestone status updated to ${status}`,
    milestone,
  };
};

export const getMyInnovatorProfile = async (userId) => {
  const profile = await InnovatorProfile.findOne({ user: userId })
    .populate("incubation.mentor", "fullName email position")
    .populate("incubation.center", "name type");

  if (!profile) throw new Error("Innovator profile not found");

  return {
    success: true,
    profile: {
      ...profile.toObject(),
      user: profile.user,
    },
  };
};

export const getMyProgress = async (userId) => {
  const profile = await InnovatorProfile.findOne({ user: userId });
  if (!profile) throw new Error("Innovator profile not found");

  const milestones = profile.incubation?.milestones || [];
  const completed = milestones.filter((m) => m.status === "completed").length;

  return {
    success: true,
    stats: {
      totalMilestones: milestones.length,
      completedMilestones: completed,
      completionRate:
        milestones.length > 0
          ? Math.round((completed / milestones.length) * 100)
          : 0,
      currentStage: profile.incubation?.stage || "idea",
      fundingStage: profile.incubation?.fundingStage || "bootstrapped",
      startDate: profile.incubation?.startDate,
    },
    milestones,
    ideaDetails: {
      title: profile.ideaTitle,
      description: profile.ideaDescription,
      problemSolved: profile.problemSolved,
      targetMarket: profile.targetMarket,
    },
  };
};

export const getMyMentor = async (userId) => {
  const profile = await InnovatorProfile.findOne({ user: userId }).populate(
    "incubation.mentor",
    "fullName email position phone",
  );

  if (!profile) throw new Error("Innovator profile not found");
  if (!profile.incubation?.mentor) {
    return {
      success: true,
      mentor: null,
      message: "No mentor assigned yet",
      assignedAt: null,
    };
  }
  return {
    success: true,
    mentor: profile.incubation.mentor,
    assignedAt: profile.incubation.mentorAssignedAt,
  };
};

export const getMyDocuments = async (userId) => {
  const profile = await InnovatorProfile.findOne({ user: userId });
  if (!profile) throw new Error("Innovator profile not found");

  return {
    success: true,
    documents: profile.documents,
  };
};

export const getInnovatorDashboard = async (userId) => {
  const [profile, progress] = await Promise.all([
    getMyInnovatorProfile(userId),
    getMyProgress(userId),
  ]);

  return {
    success: true,
    profile: profile.profile,
    progress: progress.stats,
    milestones: progress.milestones.slice(-5),
    mentor: await getMyMentor(userId).catch(() => null),
  };
};
