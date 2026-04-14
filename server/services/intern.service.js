import InternProfile from "../models/InternProfile.js";
import Notification from "../models/Notification.js";

export const getMyWeeklyReports = async (userId) => {
  const profile = await InternProfile.findOne({ user: userId });
  if (!profile) throw new Error("Intern profile not found");

  const reports = profile.reports.sort((a, b) => b.week - a.week);

  const stats = {
    total: reports.length,
    submitted: reports.filter((r) => r.status === "submitted").length,
    reviewed: reports.filter((r) => r.status === "advisor_reviewed").length,
    averageRating:
      reports.reduce((sum, r) => sum + (r.advisorRating || 0), 0) /
        reports.length || 0,
  };

  return { success: true, reports, stats };
};

export const submitWeeklyReport = async (userId, data) => {
  const profile = await InternProfile.findOne({ user: userId }).populate(
    "user",
    "fullName",
  );
  if (!profile) throw new Error("Intern profile not found");
  if (!profile.placement?.advisor) throw new Error("No advisor assigned");

  const exists = profile.reports.find((r) => r.week === data.week);
  if (exists) throw new Error("Week already submitted");

  profile.reports.push({
    week: data.week,
    startDate: data.startDate,
    endDate: data.endDate,
    content: data.content,
    challenges: data.challenges,
    learnings: data.learnings,
    nextPlan: data.nextPlan,
    hoursWorked: data.hoursWorked,
    status: "submitted",
    submittedAt: new Date(),
  });

  await profile.save();

  await Notification.create({
    user: profile.placement.advisor,
    title: "Weekly Report Submitted",
    message: `Week ${data.week} report submitted by ${profile.user.fullName}`,
    type: "report",
  });

  return { success: true, profile };
};

export const getReportByWeek = async (userId, week) => {
  const profile = await InternProfile.findOne({ user: userId });
  if (!profile) throw new Error("Intern profile not found");

  const report = profile.reports.find((r) => r.week === week);
  if (!report) throw new Error("Report not found");

  return { success: true, report };
};

export const updateReport = async (userId, week, data) => {
  const profile = await InternProfile.findOne({ user: userId });
  if (!profile) throw new Error("Intern profile not found");

  const reportIndex = profile.reports.findIndex((r) => r.week === week);
  if (reportIndex === -1) throw new Error("Report not found");

  if (profile.reports[reportIndex].status !== "submitted") {
    throw new Error("Cannot update report after review");
  }

  Object.assign(profile.reports[reportIndex], data);
  await profile.save();

  return { success: true, report: profile.reports[reportIndex] };
};

export const getMyInternProfile = async (userId) => {
  const profile = await InternProfile.findOne({ user: userId })
    .populate("placement.advisor", "fullName email position")
    .populate("placement.directorate", "name type");

  if (!profile) throw new Error("Intern profile not found");

  return {
    success: true,
    profile: {
      ...profile.toObject(),
      user: profile.user,
    },
  };
};

export const getMyProgress = async (userId) => {
  const profile = await InternProfile.findOne({ user: userId });
  if (!profile) throw new Error("Intern profile not found");

  const reports = profile.reports;
  const totalWeeks = reports.length;
  const completedWeeks = reports.filter(
    (r) => r.status === "advisor_reviewed",
  ).length;
  const averageRating =
    reports.reduce((sum, r) => sum + (r.advisorRating || 0), 0) / totalWeeks ||
    0;

  return {
    success: true,
    stats: {
      totalWeeks,
      completedWeeks,
      remainingWeeks: Math.max(0, 10 - totalWeeks),
      averageRating,
      completionRate:
        totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0,
    },
    recentReports: reports.slice(-3),
    advisor: profile.placement?.advisor,
  };
};

export const getMyAdvisor = async (userId) => {
  const profile = await InternProfile.findOne({ user: userId }).populate(
    "placement.advisor",
    "fullName email position phone",
  );

  if (!profile) throw new Error("Intern profile not found");
  if (!profile.placement?.advisor) {
    return {
      success: true,
      advisor: null,
      message: "No advisor assigned yet",
      assignedAt: null,
    };
  }
  return {
    success: true,
    advisor: profile.placement.advisor,
    assignedAt: profile.placement.advisorAssignedAt,
  };
};

export const getInternDashboard = async (userId) => {
  const [profile, progress] = await Promise.all([
    getMyInternProfile(userId),
    getMyProgress(userId),
  ]);

  return {
    success: true,
    profile: profile.profile,
    progress: progress.stats,
    recentReports: progress.recentReports,
    advisor: await getMyAdvisor(userId),
  };
};
