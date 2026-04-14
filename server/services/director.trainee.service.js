import User from "../models/User.js";
import TrainingProfile from "../models/TrainingProfile.js";
import Notification from "../models/Notification.js";
import { getPagination } from "../utils/pagination.js";

export const getDirectorTraineeSummaries = async (directorId, queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not assigned to a directorate");
  }

  // Find trainees in this directorate
  const filter = {
    "placement.directorate": director.directorate._id,
    status: { $in: ["active", "approved", "completed"] },
  };

  const total = await TrainingProfile.countDocuments(filter);

  const trainees = await TrainingProfile.find(filter)
    .populate("user", "fullName email phone")
    .populate("placement.trainer", "fullName email position")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  return {
    success: true,
    data: trainees.map((t) => ({
      trainee: t.user,
      trainer: t.placement?.trainer || null,
      trainerAssignedAt: t.placement?.trainerAssignedAt,
      institution: t.institution,
      profession: t.profession,
      skills: t.skills || [],
      status: t.status,
      documents: t.documents,
      placement: t.placement,
      sessions: t.sessions || [],
      progress: t.progress,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTraineeProgress = async (directorId, traineeId) => {
  const director = await User.findById(directorId).populate("directorate");

  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.directorate": director.directorate._id,
  })
    .populate("user", "fullName email")
    .populate("placement.trainer", "fullName email position");

  if (!profile) throw new Error("Trainee not found in your directorate");

  const sessions = profile.sessions || [];
  const totalSessions = sessions.length;
  const attendedSessions = sessions.filter((s) => s.attended).length;
  const completionRate =
    totalSessions > 0
      ? Math.round((attendedSessions / totalSessions) * 100)
      : 0;

  const stats = {
    totalSessions,
    attendedSessions,
    completionRate,
    startDate: profile.placement?.startDate,
    trainerAssigned: !!profile.placement?.trainer,
  };

  return {
    success: true,
    trainee: profile.user,
    trainer: profile.placement?.trainer,
    stats,
    sessions,
    skills: profile.skills,
    institution: profile.institution,
    profession: profile.profession,
  };
};

export const assignTrainer = async (directorId, traineeId, trainerId) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  // Verify trainee exists and is in this directorate
  const traineeUser = await User.findById(traineeId);
  if (!traineeUser || !traineeUser.trainingProfile) {
    throw new Error("Trainee not found");
  }

  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.directorate": director.directorate._id,
  });

  if (!profile) {
    throw new Error("Trainee not found in your directorate");
  }

  // Verify trainer exists and is valid
  const trainer = await User.findById(trainerId);
  if (!trainer) {
    throw new Error("Trainer not found");
  }

  if (!["trainer", "technical_staff", "advisor"].includes(trainer.position)) {
    throw new Error(
      "Invalid trainer. Must be trainer, technical_staff, or advisor",
    );
  }

  // Assign trainer
  if (!profile.placement) {
    profile.placement = {};
  }

  profile.placement.trainer = trainerId;
  profile.placement.trainerAssignedAt = new Date();
  profile.placement.trainerAssignedBy = directorId;

  await profile.save();

  // Notify trainee
  await Notification.create({
    user: traineeId,
    title: "Trainer Assigned",
    message: `${trainer.fullName} has been assigned as your trainer. You can start your training program.`,
    type: "success",
  });

  // Notify trainer
  await Notification.create({
    user: trainerId,
    title: "New Trainee Assigned",
    message: `You have been assigned as trainer for ${traineeUser.fullName}.`,
    type: "assignment",
    relatedTo: { model: "TrainingProfile", id: profile._id },
    actionUrl: `/trainer/trainees/${traineeId}`,
  });

  return {
    success: true,
    message: `Trainer ${trainer.fullName} assigned to ${traineeUser.fullName}`,
    profile,
  };
};

export const getTraineeSessions = async (directorId, traineeId) => {
  const director = await User.findById(directorId).populate("directorate");

  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.directorate": director.directorate._id,
  });

  if (!profile) throw new Error("Trainee not found in your directorate");

  return {
    success: true,
    sessions: profile.sessions || [],
    progress: profile.progress,
  };
};

export const removeTrainer = async (directorId, traineeId) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.directorate": director.directorate._id,
  });

  if (!profile) {
    throw new Error("Trainee not found in your directorate");
  }

  const previousTrainer = profile.placement?.trainer;

  profile.placement.trainer = null;
  profile.placement.trainerAssignedAt = null;
  profile.placement.trainerAssignedBy = null;
  await profile.save();

  if (previousTrainer) {
    await Notification.create({
      user: previousTrainer,
      title: "Trainer Assignment Removed",
      message: `You are no longer the trainer for this trainee`,
      type: "warning",
    });
  }

  await Notification.create({
    user: traineeId,
    title: "Trainer Removed",
    message: `Your trainer has been reassigned. A new trainer will be assigned soon.`,
    type: "info",
  });

  return {
    success: true,
    message: "Trainer removed successfully",
  };
};

export const updateTraineeStatus = async (directorId, traineeId, status) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const allowedStatuses = ["active", "completed", "dropped"];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
  }

  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.directorate": director.directorate._id,
  }).populate("user", "fullName email");

  if (!profile) {
    throw new Error("Trainee not found in your directorate");
  }

  profile.status = status;
  if (status === "completed") {
    profile.placement.endDate = new Date();
  }
  await profile.save();

  await Notification.create({
    user: traineeId,
    title: `Training Status Updated to ${status}`,
    message: `Your training status has been updated to ${status}`,
    type: status === "completed" ? "success" : "info",
  });

  return {
    success: true,
    message: `Trainee status updated to ${status}`,
    profile,
  };
};
