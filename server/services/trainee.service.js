import TrainingProfile from "../models/TrainingProfile.js";

export const getMySessions = async (userId) => {
  const profile = await TrainingProfile.findOne({ user: userId });
  if (!profile) throw new Error("Trainee profile not found");

  const sessions = profile.sessions || [];
  const upcoming = sessions.filter((s) => new Date(s.date) > new Date());
  const past = sessions.filter((s) => new Date(s.date) <= new Date());
  const attended = sessions.filter((s) => s.attended).length;

  return {
    success: true,
    sessions: {
      upcoming,
      past,
      attended,
      total: sessions.length,
    },
    progress: profile.progress,
  };
};

export const markAttendance = async (userId, sessionId) => {
  const profile = await TrainingProfile.findOne({ user: userId });
  if (!profile) throw new Error("Trainee profile not found");

  const session = profile.sessions.id(sessionId);
  if (!session) throw new Error("Session not found");

  if (session.attended) throw new Error("Attendance already marked");

  session.attended = true;
  session.attendedAt = new Date();

  await profile.save();

  return {
    success: true,
    message: "Attendance marked successfully",
    session,
  };
};

export const getMyCertificates = async (userId) => {
  const profile = await TrainingProfile.findOne({ user: userId });
  if (!profile) throw new Error("Trainee profile not found");

  const certificates = profile.sessions
    .filter((s) => s.attended && s.certificate)
    .map((s) => ({
      title: s.title,
      date: s.date,
      certificate: s.certificate,
    }));

  return {
    success: true,
    certificates,
  };
};

export const getMyTraineeProfile = async (userId) => {
  const profile = await TrainingProfile.findOne({ user: userId })
    .populate("placement.trainer", "fullName email position")
    .populate("placement.directorate", "name type");

  if (!profile) throw new Error("Trainee profile not found");

  return {
    success: true,
    profile: {
      ...profile.toObject(),
      user: profile.user,
    },
  };
};

export const getMyProgress = async (userId) => {
  const profile = await TrainingProfile.findOne({ user: userId });
  if (!profile) throw new Error("Trainee profile not found");

  const sessions = profile.sessions || [];
  const totalSessions = sessions.length;
  const attendedSessions = sessions.filter((s) => s.attended).length;
  const completionRate =
    totalSessions > 0
      ? Math.round((attendedSessions / totalSessions) * 100)
      : 0;

  return {
    success: true,
    stats: {
      totalSessions,
      attendedSessions,
      completionRate,
      startDate: profile.placement?.startDate,
      trainerAssigned: !!profile.placement?.trainer,
    },
    recentSessions: sessions.slice(-5),
  };
};

export const getMyTrainer = async (userId) => {
  const profile = await TrainingProfile.findOne({ user: userId }).populate(
    "placement.trainer",
    "fullName email position phone",
  );

  if (!profile) throw new Error("Trainee profile not found");
  if (!profile.placement?.trainer) {
    return {
      success: true,
      trainer: null,
      message: "No trainer assigned yet",
      assignedAt: null,
    };
  }
  return {
    success: true,
    trainer: profile.placement.trainer,
    assignedAt: profile.placement.trainerAssignedAt,
  };
};

export const getTraineeDashboard = async (userId) => {
  const [profile, progress] = await Promise.all([
    getMyTraineeProfile(userId),
    getMyProgress(userId),
  ]);

  return {
    success: true,
    profile: profile.profile,
    progress: progress.stats,
    recentSessions: progress.recentSessions,
    trainer: await getMyTrainer(userId).catch(() => null),
  };
};
