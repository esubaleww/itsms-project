import TrainingProfile from "../models/TrainingProfile.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getPagination } from "../utils/pagination.js";

export const getMyTrainees = async (trainerId, queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  const trainer = await User.findById(trainerId);
  if (!trainer) throw new Error("Trainer not found");

  const filter = {
    "placement.trainer": trainerId,
    status: { $in: ["active", "approved", "completed"] },
  };

  const total = await TrainingProfile.countDocuments(filter);

  const trainees = await TrainingProfile.find(filter)
    .populate("user", "fullName email phone")
    .populate("placement.directorate", "name type")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  return {
    success: true,
    data: trainees.map((t) => ({
      trainee: t.user,
      institution: t.institution,
      profession: t.profession,
      skills: t.skills,
      status: t.status,
      sessions: t.sessions,
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

export const getTraineeProgress = async (trainerId, traineeId) => {
  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.trainer": trainerId,
  }).populate("user", "fullName email");

  if (!profile) throw new Error("Trainee not found or not assigned to you");

  const sessions = profile.sessions || [];
  const totalSessions = sessions.length;
  const attendedSessions = sessions.filter((s) => s.attended).length;

  return {
    success: true,
    trainee: profile.user,
    stats: {
      totalSessions,
      attendedSessions,
      completionRate:
        totalSessions > 0
          ? Math.round((attendedSessions / totalSessions) * 100)
          : 0,
      startDate: profile.placement?.startDate,
    },
    sessions,
    skills: profile.skills,
    institution: profile.institution,
    profession: profile.profession,
  };
};

export const createSession = async (trainerId, traineeId, sessionData) => {
  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.trainer": trainerId,
  }).populate("user", "fullName");

  if (!profile) throw new Error("Trainee not found or not assigned to you");

  const session = {
    title: sessionData.title,
    date: new Date(sessionData.date),
    duration: sessionData.duration,
    location: sessionData.location,
    attended: false,
    qrCode: sessionData.qrCode,
  };

  profile.sessions.push(session);
  await profile.save();

  await Notification.create({
    user: traineeId,
    title: "New Training Session",
    message: `A new training session "${sessionData.title}" has been scheduled for ${new Date(sessionData.date).toLocaleDateString()}`,
    type: "info",
  });

  return {
    success: true,
    message: "Session created successfully",
    session: profile.sessions[profile.sessions.length - 1],
  };
};

export const recordAttendance = async (trainerId, sessionId, traineeId) => {
  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.trainer": trainerId,
  });

  if (!profile) throw new Error("Trainee not found or not assigned to you");

  const session = profile.sessions.id(sessionId);
  if (!session) throw new Error("Session not found");

  if (session.attended) throw new Error("Attendance already recorded");

  session.attended = true;
  session.attendedAt = new Date();

  await profile.save();

  return {
    success: true,
    message: "Attendance recorded successfully",
    session,
  };
};

export const generateCertificate = async (trainerId, traineeId, sessionId) => {
  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.trainer": trainerId,
  });

  if (!profile) throw new Error("Trainee not found or not assigned to you");

  const session = profile.sessions.id(sessionId);
  if (!session) throw new Error("Session not found");

  if (!session.attended)
    throw new Error("Cannot generate certificate for unattended session");

  const certificateId = `CERT-${Date.now()}-${traineeId.slice(-6)}`;
  session.certificate = `/certificates/${certificateId}.pdf`;

  await profile.save();

  await Notification.create({
    user: traineeId,
    title: "Certificate Generated",
    message: `Your certificate for "${session.title}" is now available`,
    type: "success",
  });

  return {
    success: true,
    message: "Certificate generated",
    certificateUrl: session.certificate,
  };
};

export const getTrainerStats = async (trainerId) => {
  const trainees = await TrainingProfile.find({
    "placement.trainer": trainerId,
  });

  const totalTrainees = trainees.length;
  const totalSessions = trainees.reduce(
    (sum, t) => sum + (t.sessions?.length || 0),
    0,
  );
  const attendedSessions = trainees.reduce(
    (sum, t) => sum + (t.sessions?.filter((s) => s.attended).length || 0),
    0,
  );
  const averageCompletion =
    totalSessions > 0
      ? Math.round((attendedSessions / totalSessions) * 100)
      : 0;

  return {
    totalTrainees,
    totalSessions,
    attendedSessions,
    averageCompletion,
  };
};

export const getTrainerDashboard = async (trainerId) => {
  const [stats, recentTrainees] = await Promise.all([
    getTrainerStats(trainerId),
    getMyTrainees(trainerId, { page: 1, limit: 5, skip: 0 }),
  ]);

  return {
    success: true,
    stats,
    recentTrainees: recentTrainees.data,
  };
};
export const submitTrainerSummary = async (
  trainerId,
  traineeId,
  summaryData,
) => {
  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.trainer": trainerId,
  }).populate("user", "fullName email");

  if (!profile) throw new Error("Trainee not found or not assigned to you");

  // Add trainer summary
  profile.trainerSummary = {
    overallPerformance: summaryData.overallPerformance,
    skillsAcquired: summaryData.skillsAcquired || [],
    attendanceRate: profile.progress?.completionRate || 0,
    certificationRecommended: summaryData.certificationRecommended,
    recommendation: summaryData.recommendation,
    comments: summaryData.comments,
    submittedAt: new Date(),
    submittedBy: trainerId,
    status: "pending_director_review",
  };

  await profile.save();

  // Notify director
  const director = await User.findOne({
    directorate: profile.placement?.directorate,
    position: "director",
  });

  if (director) {
    await Notification.create({
      user: director._id,
      title: "Trainer Summary Submitted",
      message: `Trainee ${profile.user.fullName} has been evaluated by their trainer`,
      type: "report",
      metadata: {
        traineeId,
        traineeName: profile.user.fullName,
      },
    });
  }

  return {
    success: true,
    message: "Trainer summary submitted to director",
    summary: profile.trainerSummary,
  };
};

// Update trainee status
export const updateTraineeStatus = async (trainerId, traineeId, status) => {
  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.trainer": trainerId,
  });

  if (!profile) throw new Error("Trainee not found or not assigned to you");

  const oldStatus = profile.status;
  profile.status = status;

  if (status === "active" && !profile.placement?.startDate) {
    profile.placement.startDate = new Date();
  }

  if (status === "completed" && !profile.placement?.endDate) {
    profile.placement.endDate = new Date();
  }

  await profile.save();

  await Notification.create({
    user: traineeId,
    title: "Training Status Updated",
    message: `Your training status has been updated from ${oldStatus} to ${status}`,
    type: "info",
  });

  return {
    success: true,
    message: `Status updated from ${oldStatus} to ${status}`,
    status: profile.status,
  };
};
