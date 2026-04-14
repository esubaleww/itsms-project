import StartupProfile from "../models/StartupProfile.js";

export const getMyMilestones = async (userId) => {
  const profile = await StartupProfile.findOne({ user: userId });
  if (!profile) throw new Error("Startup profile not found");

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
  const profile = await StartupProfile.findOne({ user: userId });
  if (!profile) throw new Error("Startup profile not found");

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

export const getMyStartupProfile = async (userId) => {
  const profile = await StartupProfile.findOne({ user: userId })
    .populate("incubation.mentor", "fullName email position")
    .populate("incubation.center", "name type");

  if (!profile) throw new Error("Startup profile not found");

  return {
    success: true,
    profile: {
      ...profile.toObject(),
      user: profile.user,
    },
  };
};

export const getMyProgress = async (userId) => {
  const profile = await StartupProfile.findOne({ user: userId });
  if (!profile) throw new Error("Startup profile not found");

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
      employeeCount: profile.employeeCount,
      founderCount: profile.founders?.length || 0,
    },
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

export const getMyMentor = async (userId) => {
  const profile = await StartupProfile.findOne({ user: userId }).populate(
    "incubation.mentor",
    "fullName email position phone",
  );

  if (!profile) throw new Error("Startup profile not found");
  if (!profile.incubation?.mentor) throw new Error("No mentor assigned");

  return {
    success: true,
    mentor: profile.incubation.mentor,
    assignedAt: profile.incubation.mentorAssignedAt,
  };
};

export const updateFounders = async (userId, founders) => {
  const profile = await StartupProfile.findOne({ user: userId });
  if (!profile) throw new Error("Startup profile not found");

  profile.founders = founders;
  await profile.save();

  return {
    success: true,
    message: "Founders updated successfully",
    founders: profile.founders,
  };
};

export const addFounder = async (userId, founderData) => {
  const profile = await StartupProfile.findOne({ user: userId });
  if (!profile) throw new Error("Startup profile not found");

  profile.founders.push(founderData);
  await profile.save();

  return {
    success: true,
    message: "Founder added successfully",
    founders: profile.founders,
  };
};

export const removeFounder = async (userId, founderId) => {
  const profile = await StartupProfile.findOne({ user: userId });
  if (!profile) throw new Error("Startup profile not found");

  profile.founders = profile.founders.filter(
    (f) => f._id.toString() !== founderId,
  );
  await profile.save();

  return {
    success: true,
    message: "Founder removed successfully",
    founders: profile.founders,
  };
};

export const getMyDocuments = async (userId) => {
  const profile = await StartupProfile.findOne({ user: userId });
  if (!profile) throw new Error("Startup profile not found");

  return {
    success: true,
    documents: profile.documents,
  };
};

export const getStartupDashboard = async (userId) => {
  const [profile, progress] = await Promise.all([
    getMyStartupProfile(userId),
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
