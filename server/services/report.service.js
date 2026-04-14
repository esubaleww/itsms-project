import Report from "../models/Report.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { logAction } from "../utils/auditLogger.js";
import Team from "../models/Team.js";

import {
  calculateTeamMetrics,
  calculateDirectorMetrics,
} from "../utils/reportMetrics.js";
import { getPagination } from "../utils/pagination.js";

export const createTeamReport = async (user, data) => {
  if (!user.team) throw new Error("User is not assigned to a team");

  // Get team details
  const team = await Team.findById(user.team).populate("directorate");

  const metrics = await calculateTeamMetrics(
    user.team,
    data.startDate,
    data.endDate,
  );

  const report = await Report.create({
    title: data.title,
    type: "team_report",
    submittedBy: user._id,
    team: user.team,
    directorate: team.directorate._id,
    period: {
      startDate: data.startDate,
      endDate: data.endDate,
    },
    summary: data.summary,
    achievements: data.achievements || [],
    challenges: data.challenges || [],
    nextSteps: data.nextSteps || [],
    metrics,
    status: "submitted",
    submittedAt: new Date(),
    teamLead: user._id,
  });

  const director = await User.findOne({
    directorate: team.directorate._id,
    position: "director",
  });

  if (director) {
    await Notification.create({
      user: director._id,
      title: "Team Report Submitted",
      message: `Team ${team.name} has submitted a report: ${data.title}`,
      type: "report",
      relatedTo: { model: "Report", id: report._id },
      actionUrl: `/director/reports/${report._id}`,
    });
  }

  await Notification.create({
    user: user._id,
    title: "Report Submitted",
    message: `Your team report "${data.title}" has been submitted to the director`,
    type: "success",
    relatedTo: { model: "Report", id: report._id },
  });

  await logAction({
    user,
    action: "CREATE",
    entity: "Report",
    entityId: report._id,
    metadata: { type: "team_report" },
  });

  return { success: true, report };
};

export const createDirectorReport = async (user, data) => {
  if (!user.directorate)
    throw new Error("User is not assigned to a directorate");

  const metrics = await calculateDirectorMetrics(
    user.directorate,
    data.startDate,
    data.endDate,
  );

  const report = await Report.create({
    title: data.title,
    type: "director_report",
    submittedBy: user._id,
    directorate: user.directorate,
    period: {
      startDate: data.startDate,
      endDate: data.endDate,
    },
    summary: data.summary,
    achievements: data.achievements,
    challenges: data.challenges,
    nextSteps: data.nextSteps,
    metrics,
    status: "submitted",
    submittedAt: new Date(),
  });

  // 🔔 Notify admin
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    await Notification.create({
      user: admin._id,
      title: "Director Report Submitted",
      message: `${report.title} has been submitted`,
      type: "report",
      relatedTo: { model: "Report", id: report._id },
    });
  }

  return { success: true, report };
};

export const submitReport = async (reportId, user, req) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  if (report.status !== "draft") {
    throw new Error("Only draft reports can be submitted");
  }

  report.status = "submitted";
  report.submittedAt = new Date();

  await report.save();

  // 🔔 Notify next level
  let notifyUser = null;

  if (report.type === "team_report") {
    // notify director (FIXED)
    const director = await User.findOne({
      directorate: report.directorate,
      position: "director",
    });
    if (director) notifyUser = director._id;
  }

  if (notifyUser) {
    await Notification.create({
      user: notifyUser,
      title: "New Report Submitted",
      message: `${report.title} has been submitted`,
      type: "info",
    });
  }

  await logAction({
    user,
    action: "SUBMIT",
    entity: "Report",
    entityId: report._id,
    req,
  });

  return { success: true, report };
};

export const getReports = async (filters = {}, queryParams = {}) => {
  const query = {};

  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.directorate) query.directorate = filters.directorate;
  if (filters.team) query.team = filters.team;
  if (filters.submittedBy) query.submittedBy = filters.submittedBy;
  if (filters.teamLead) query.teamLead = filters.teamLead;

  const { page, limit, skip } = getPagination(queryParams);

  const total = await Report.countDocuments(query);

  const reports = await Report.find(query)
    .populate("submittedBy", "fullName position")
    .populate("directorate", "name")
    .populate("team", "name")
    .populate("reviewedBy", "fullName")
    .populate("approvedBy", "fullName")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    success: true,
    reports,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getReportById = async (id) => {
  const report = await Report.findById(id)
    .populate("submittedBy", "fullName email")
    .populate("directorate", "name")
    .populate("team", "name")
    .populate("reviewedBy", "fullName")
    .populate("approvedBy", "fullName");

  if (!report) throw new Error("Report not found");

  return { success: true, report };
};

export const reviewTeamReport = async (reportId, director, feedback, req) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  if (report.type !== "team_report") {
    throw new Error("Only team reports can be reviewed here");
  }

  report.status = "reviewed";
  report.feedback = feedback;
  report.reviewedBy = director._id;
  report.reviewedAt = new Date();

  await report.save();

  // 🔔 notify team lead
  await Notification.create({
    user: report.teamLead,
    title: "Report Reviewed",
    message: `Your report "${report.title}" was reviewed`,
    type: "info",
  });

  await logAction({
    user: director,
    action: "REVIEW",
    entity: "Report",
    entityId: report._id,
    req,
  });

  return { success: true, report };
};

export const reviewDirectorReport = async (reportId, admin, feedback, req) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  if (report.type !== "director_report") {
    throw new Error("Invalid report type");
  }

  report.status = "reviewed";
  report.feedback = feedback;
  report.reviewedBy = admin._id;
  report.reviewedAt = new Date();

  await report.save();

  await Notification.create({
    user: report.submittedBy,
    title: "Report Reviewed",
    message: `Your report "${report.title}" was reviewed`,
    type: "info",
  });

  await logAction({
    user: admin,
    action: "REVIEW",
    entity: "Report",
    entityId: report._id,
    req,
  });

  return { success: true, report };
};

export const approveDirectorReport = async (reportId, admin, comments, req) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  report.status = "approved";
  report.feedback = comments;
  report.approvedBy = admin._id;
  report.approvedAt = new Date();

  await report.save();

  await Notification.create({
    user: report.submittedBy,
    title: "Report Approved",
    message: `Your report "${report.title}" has been approved`,
    type: "success",
  });

  await logAction({
    user: admin,
    action: "APPROVE",
    entity: "Report",
    entityId: report._id,
    req,
  });

  return { success: true, report };
};

export const rejectDirectorReport = async (reportId, admin, reason, req) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  report.status = "rejected";
  report.feedback = reason;
  report.reviewedBy = admin._id;
  report.reviewedAt = new Date();

  await report.save();

  await Notification.create({
    user: report.submittedBy,
    title: "Report Rejected",
    message: reason,
    type: "warning",
  });

  await logAction({
    user: admin,
    action: "REJECT",
    entity: "Report",
    entityId: report._id,
    req,
  });

  return { success: true, report };
};

export const approveTeamReport = async (reportId, director, comments, req) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  if (report.type !== "team_report") {
    throw new Error("Only team reports can be approved");
  }

  if (report.status !== "reviewed") {
    throw new Error("Report must be reviewed before approval");
  }

  report.status = "approved";
  report.feedback = comments || "Approved by director";
  report.approvedBy = director._id;
  report.approvedAt = new Date();

  await report.save();

  // 🔔 Notify team lead
  await Notification.create({
    user: report.teamLead,
    title: "Report Approved",
    message: `Your report "${report.title}" has been approved`,
    type: "success",
    relatedTo: { model: "Report", id: report._id },
  });

  await logAction({
    user: director,
    action: "APPROVE",
    entity: "Report",
    entityId: report._id,
    req,
  });

  return { success: true, report };
};

export const rejectTeamReport = async (reportId, director, reason, req) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  if (report.type !== "team_report") {
    throw new Error("Only team reports can be rejected");
  }

  report.status = "rejected";
  report.feedback = reason || "Rejected by director";
  report.reviewedBy = director._id;
  report.reviewedAt = new Date();

  await report.save();

  // 🔔 Notify team lead
  await Notification.create({
    user: report.teamLead,
    title: "Report Rejected",
    message: `Your report "${report.title}" was rejected. Reason: ${reason}`,
    type: "warning",
    relatedTo: { model: "Report", id: report._id },
  });

  await logAction({
    user: director,
    action: "REJECT",
    entity: "Report",
    entityId: report._id,
    req,
  });

  return { success: true, report };
};
