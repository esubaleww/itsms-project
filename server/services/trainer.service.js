import TrainingProfile from "../models/TrainingProfile.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getPagination } from "../utils/pagination.js";

export const getMyTrainees = async (trainerId, queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  const trainer = await User.findById(trainerId);
  if (!trainer) throw new Error("Trainer not found");

  const filter = {
    "placement.trainer": trainerId,
    status: { $in: ["pending", "active", "approved", "completed"] },
  };

  const total = await TrainingProfile.countDocuments(filter);

  const trainees = await TrainingProfile.find(filter)
    .populate("user", "fullName email phone")
    .populate("placement.directorate", "name type")
    .populate("attendance.session", "title date duration location")
    .select(
      "user institution profession skills status attendance progress trainerSummary",
    )
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  return {
    success: true,
    data: trainees.map((t) => ({
      _id: t._id,
      trainee: t.user,
      institution: t.institution,
      profession: t.profession,
      skills: t.skills,
      status: t.status,
      attendance: t.attendance,
      progress: t.progress,
      trainerSummary: t.trainerSummary,
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
  })
    .populate("user", "fullName email")
    .populate("attendance.session", "title date duration location");

  if (!profile) throw new Error("Trainee not found or not assigned to you");

  const attendance = profile.attendance || [];
  const totalSessions = attendance.length;
  const attendedSessions = attendance.filter((a) => a.attended).length;

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
    sessions: attendance,
    skills: profile.skills,
    institution: profile.institution,
    profession: profile.profession,
  };
};

export const createSession = async (trainerId, sessionData) => {
  const session = new Session({
    title: sessionData.title,
    date: new Date(sessionData.date),
    duration: sessionData.duration,
    location: sessionData.location,
    trainer: trainerId,
  });

  await session.save();

  const trainees = await TrainingProfile.find({
    "placement.trainer": trainerId,
  });

  for (const trainee of trainees) {
    trainee.attendance.push({
      session: session._id,
      attended: false,
    });
    await trainee.save();

    await Notification.create({
      user: trainee.user,
      title: "New Training Session",
      message: `A new training session "${sessionData.title}" has been scheduled for ${new Date(sessionData.date).toLocaleDateString()}`,
      type: "info",
    });
  }

  return {
    success: true,
    message: "Session created successfully",
    session,
  };
};

export const markAttendance = async (sessionId, traineeId) => {
  const session = await Session.findById(sessionId);
  if (!session) throw new Error("Session not found");

  const profile = await TrainingProfile.findOne({
    user: traineeId,
    "placement.trainer": session.trainer,
  });

  if (!profile)
    throw new Error("Trainee not found or not assigned to this trainer");

  const attendanceRecord = profile.attendance.find(
    (a) => a.session.toString() === sessionId,
  );

  if (!attendanceRecord) throw new Error("Session not found for this trainee");
  if (attendanceRecord.attended) throw new Error("Attendance already recorded");

  attendanceRecord.attended = true;
  attendanceRecord.attendedAt = new Date();

  await profile.save();

  return {
    success: true,
    message: "Attendance recorded successfully",
  };
};

export const getTrainerStats = async (trainerId) => {
  const trainees = await TrainingProfile.find({
    "placement.trainer": trainerId,
  });

  const sessions = await Session.find({ trainer: trainerId });

  const totalTrainees = trainees.length;
  const totalSessions = sessions.length;

  let attendedSessions = 0;
  for (const trainee of trainees) {
    attendedSessions += trainee.attendance.filter((a) => a.attended).length;
  }

  const averageCompletion =
    totalTrainees > 0 && totalSessions > 0
      ? Math.round((attendedSessions / (totalTrainees * totalSessions)) * 100)
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

export const getSessions = async (trainerId) => {
  const sessions = await Session.find({ trainer: trainerId }).sort({
    date: -1,
  });

  return {
    success: true,
    sessions,
  };
};

export const getSessionAttendance = async (trainerId, sessionId) => {
  const session = await Session.findOne({ _id: sessionId, trainer: trainerId });
  if (!session) throw new Error("Session not found");

  const trainees = await TrainingProfile.find({
    "placement.trainer": trainerId,
  }).populate("user", "fullName email");

  const attendance = trainees.map((trainee) => {
    const record = trainee.attendance.find(
      (a) => a.session.toString() === sessionId,
    );
    return {
      trainee: trainee.user,
      attended: record?.attended || false,
      attendedAt: record?.attendedAt,
    };
  });

  return {
    success: true,
    session,
    attendance,
  };
};
