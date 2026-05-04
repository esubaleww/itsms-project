import TrainingProfile from "../models/TrainingProfile.js";
import Session from "../models/Session.js";

export const getMySessions = async (userId) => {
  const profile = await TrainingProfile.findOne({ user: userId }).populate(
    "attendance.session",
    "title date duration location",
  );

  if (!profile) throw new Error("Trainee profile not found");

  const attendance = profile.attendance || [];
  const now = new Date();

  const upcoming = [];
  const past = [];
  let attendedCount = 0;

  for (const item of attendance) {
    const session = item.session;
    const sessionDate = new Date(session.date);
    const isAttended = item.attended === true;

    const sessionObj = {
      _id: session._id,
      title: session.title,
      date: session.date,
      duration: session.duration,
      location: session.location,
      attended: isAttended,
      attendedAt: item.attendedAt || null,
    };

    if (isAttended) {
      attendedCount++;
      past.push(sessionObj);
    } else if (sessionDate > now) {
      upcoming.push(sessionObj);
    } else {
      past.push(sessionObj);
    }
  }

  return {
    success: true,
    sessions: {
      upcoming,
      past,
      attended: attendedCount,
      total: attendance.length,
    },
    progress: profile.progress,
  };
};
export const markAttendance = async (userId, sessionId) => {
  const session = await Session.findById(sessionId);
  if (!session) throw new Error("Session not found");

  const sessionDate = new Date(session.date);
  const durationInMs = (session.duration || 0) * 60 * 60 * 1000;
  const sessionEndTime = new Date(sessionDate.getTime() + durationInMs);
  const now = new Date();

  if (now < sessionDate) {
    throw new Error(
      `This session starts on ${sessionDate.toLocaleString()}. Please scan during the session time.`,
    );
  }

  if (now > sessionEndTime) {
    throw new Error(
      "This session has expired. You cannot mark attendance for past sessions.",
    );
  }

  const profile = await TrainingProfile.findOne({ user: userId });
  if (!profile) throw new Error("Trainee profile not found");

  const attendanceRecord = profile.attendance.find(
    (a) => a.session.toString() === sessionId,
  );

  if (!attendanceRecord) throw new Error("Session not found");
  if (attendanceRecord.attended) throw new Error("Attendance already marked");

  attendanceRecord.attended = true;
  attendanceRecord.attendedAt = new Date();

  await profile.save();

  return {
    success: true,
    message: "Attendance marked successfully",
    session,
  };
};

export const getMyTraineeProfile = async (userId) => {
  const profile = await TrainingProfile.findOne({ user: userId })
    .populate("placement.trainer", "fullName email position")
    .populate("placement.directorate", "name type")
    .populate("attendance.session", "title date duration location");

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

  const attendance = profile.attendance || [];
  const totalSessions = attendance.length;
  const attendedSessions = attendance.filter((a) => a.attended).length;
  const completionRate =
    totalSessions > 0
      ? Math.round((attendedSessions / totalSessions) * 100)
      : 0;

  const recentAttendance = attendance.slice(-5);
  const recentSessions = await Promise.all(
    recentAttendance.map(async (a) => {
      const session = await Session.findById(a.session);
      return session
        ? {
            ...session.toObject(),
            attended: a.attended,
            attendedAt: a.attendedAt,
          }
        : null;
    }),
  );

  return {
    success: true,
    stats: {
      totalSessions,
      attendedSessions,
      completionRate,
      startDate: profile.placement?.startDate,
      trainerAssigned: !!profile.placement?.trainer,
    },
    recentSessions: recentSessions.filter(Boolean),
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
