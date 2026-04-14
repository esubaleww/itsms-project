import InternProfile from "../models/InternProfile.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getPagination } from "../utils/pagination.js";

export const getMyInterns = async (advisorId, queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  const advisor = await User.findById(advisorId);
  if (!advisor) throw new Error("Advisor not found");

  const filter = {
    "placement.advisor": advisorId,
    status: { $in: ["active", "approved"] },
  };

  const total = await InternProfile.countDocuments(filter);

  const interns = await InternProfile.find(filter)
    .populate("user", "fullName email phone")
    .populate("placement.directorate", "name type")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  return {
    success: true,
    data: interns.map((i) => ({
      intern: i.user,
      university: i.university,
      placement: i.placement,
      status: i.status,
      reports: i.reports,
      advisorSummary: i.advisorSummary,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getInternReports = async (advisorId, internId, queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  const intern = await InternProfile.findOne({
    user: internId,
    "placement.advisor": advisorId,
  });

  if (!intern) throw new Error("Intern not found or not assigned to you");

  const reports = intern.reports.sort((a, b) => b.week - a.week);
  const total = reports.length;

  const paginatedReports = reports.slice(skip, skip + limit);

  return {
    success: true,
    reports: paginatedReports,
    stats: {
      total,
      submitted: reports.filter((r) => r.status === "submitted").length,
      reviewed: reports.filter((r) => r.status === "advisor_reviewed").length,
      averageRating:
        reports.reduce((sum, r) => sum + (r.advisorRating || 0), 0) / total ||
        0,
    },
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const reviewReport = async (
  advisorId,
  internId,
  week,
  feedback,
  rating,
) => {
  const profile = await InternProfile.findOne({
    user: internId,
    "placement.advisor": advisorId,
  }).populate("user", "fullName");

  if (!profile) throw new Error("Intern not found or not assigned to you");

  const report = profile.reports.find((r) => r.week === week);
  if (!report) throw new Error("Report not found");

  report.status = "advisor_reviewed";
  report.advisorFeedback = feedback;
  report.advisorRating = rating;
  report.reviewedBy = advisorId;
  report.reviewedAt = new Date();

  await profile.save();

  await Notification.create({
    user: internId,
    title: "Report Reviewed",
    message: `Your week ${week} report has been reviewed by your advisor`,
    type: "success",
  });

  return {
    success: true,
    message: "Report reviewed successfully",
    report,
  };
};

export const submitAdvisorSummary = async (advisorId, internId, data) => {
  const profile = await InternProfile.findOne({
    user: internId,
    "placement.advisor": advisorId,
  }).populate("user", "fullName");

  if (!profile) throw new Error("Intern not found or not assigned to you");

  profile.advisorSummary = {
    overallPerformance: data.performance,
    strengths: data.strengths,
    weaknesses: data.weaknesses,
    recommendation: data.recommendation,
    comments: data.comments,
    submittedAt: new Date(),
    submittedBy: advisorId,
  };

  await profile.save();

  const director = await User.findOne({
    directorate: profile.placement.directorate,
    position: "director",
  });

  if (director) {
    await Notification.create({
      user: director._id,
      title: "Intern Summary Submitted",
      message: `Summary for ${profile.user.fullName} is ready for review`,
      type: "report",
    });
  }

  return {
    success: true,
    message: "Advisor summary submitted successfully",
    summary: profile.advisorSummary,
  };
};

export const getInternProgress = async (advisorId, internId) => {
  const profile = await InternProfile.findOne({
    user: internId,
    "placement.advisor": advisorId,
  }).populate("user", "fullName email");

  if (!profile) throw new Error("Intern not found or not assigned to you");

  const reports = profile.reports;
  const totalWeeks = reports.length;
  const reviewedWeeks = reports.filter(
    (r) => r.status === "advisor_reviewed",
  ).length;
  const averageRating =
    reports.reduce((sum, r) => sum + (r.advisorRating || 0), 0) / totalWeeks ||
    0;

  return {
    success: true,
    intern: profile.user,
    stats: {
      totalWeeks,
      reviewedWeeks,
      pendingWeeks: totalWeeks - reviewedWeeks,
      averageRating,
      completionRate:
        totalWeeks > 0 ? Math.round((reviewedWeeks / totalWeeks) * 100) : 0,
    },
    reports,
    summary: profile.advisorSummary,
  };
};

export const getAdvisorDashboard = async (advisorId) => {
  const [interns, stats] = await Promise.all([
    getMyInterns(advisorId, { page: 1, limit: 5, skip: 0 }),
    getAdvisorStats(advisorId),
  ]);

  return {
    success: true,
    interns: interns.data,
    stats: stats,
  };
};

export const getAdvisorStats = async (advisorId) => {
  const interns = await InternProfile.find({ "placement.advisor": advisorId });

  const totalInterns = interns.length;
  const totalReports = interns.reduce((sum, i) => sum + i.reports.length, 0);
  const pendingReviews = interns.reduce(
    (sum, i) => sum + i.reports.filter((r) => r.status === "submitted").length,
    0,
  );
  const completedReviews = interns.reduce(
    (sum, i) =>
      sum + i.reports.filter((r) => r.status === "advisor_reviewed").length,
    0,
  );

  return {
    totalInterns,
    totalReports,
    pendingReviews,
    completedReviews,
    completionRate:
      totalReports > 0
        ? Math.round((completedReviews / totalReports) * 100)
        : 0,
  };
};
