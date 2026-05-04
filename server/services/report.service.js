import Report from "../models/Report.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { logAction } from "../utils/auditLogger.js";
import Team from "../models/Team.js";
import InternProfile from "../models/InternProfile.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import TrainingProfile from "../models/TrainingProfile.js";

import {
  calculateTeamMetrics,
  calculateDirectorMetrics,
} from "../utils/reportMetrics.js";
import { getPagination } from "../utils/pagination.js";

const formatAttachments = (attachments = []) => {
  return attachments.map((attachment) => ({
    filename: {
      url: attachment.filename?.url || attachment.url,
      public_id: attachment.filename?.public_id || attachment.public_id,
      name: attachment.filename?.name || attachment.name,
      size: attachment.filename?.size || attachment.size,
      mimeType: attachment.filename?.mimeType || attachment.mimeType,
      isImage: attachment.filename?.isImage || attachment.isImage || false,
    },
    url: {
      url: attachment.url || attachment.filename?.url,
      public_id: attachment.public_id || attachment.filename?.public_id,
      name: attachment.name || attachment.filename?.name,
      size: attachment.size || attachment.filename?.size,
      mimeType: attachment.mimeType || attachment.filename?.mimeType,
      isImage: attachment.isImage || attachment.filename?.isImage || false,
    },
    uploadedAt: new Date(),
  }));
};

// ==================== TEAM REPORTS (from Report model) ====================
export const createTeamReport = async (user, data) => {
  if (!user.team) throw new Error("User is not assigned to a team");

  const team = await Team.findById(user.team).populate("directorate");

  const metrics = await calculateTeamMetrics(
    user.team,
    data.startDate,
    data.endDate,
  );

  const attachments = formatAttachments(data.attachments);

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
    attachments,
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

// ==================== DIRECTOR REPORTS (from Report model) ====================
export const createDirectorReport = async (user, data) => {
  if (!user.directorate)
    throw new Error("User is not assigned to a directorate");

  const metrics = await calculateDirectorMetrics(
    user.directorate,
    data.startDate,
    data.endDate,
  );

  const attachments = formatAttachments(data.attachments);

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
    achievements: data.achievements || [],
    challenges: data.challenges || [],
    nextSteps: data.nextSteps || [],
    metrics,
    attachments,
    status: "submitted",
    submittedAt: new Date(),
  });

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

// ==================== ADVISOR REPORTS (from InternProfile) ====================
export const getAdvisorReports = async (directorateId) => {
  const profiles = await InternProfile.find({
    "placement.directorate": directorateId,
    "advisorSummary.submittedAt": { $exists: true },
  })
    .populate("user", "fullName email")
    .populate("placement.advisor", "fullName email");

  return profiles.map((profile) => ({
    _id: profile._id,
    title: `Advisor Summary - ${profile.user?.fullName}`,
    type: "advisor_report",
    status: "submitted",
    createdAt: profile.advisorSummary?.submittedAt,
    submittedBy: profile.placement?.advisor,
    participant: profile.user,
    data: profile.advisorSummary,
    summary: `Overall Performance: ${profile.advisorSummary?.overallPerformance || "N/A"}`,
  }));
};

// ==================== MENTOR REPORTS (from InnovatorProfile) ====================
export const getMentorReports = async (directorateId) => {
  const profiles = await InnovatorProfile.find({
    "incubation.center": directorateId,
    "mentorSummary.submittedAt": { $exists: true },
  })
    .populate("user", "fullName email")
    .populate("incubation.mentor", "fullName email");

  return profiles.map((profile) => ({
    _id: profile._id,
    title: `Mentor Summary - ${profile.user?.fullName}`,
    type: "mentor_report",
    status: "submitted",
    createdAt: profile.mentorSummary?.submittedAt,
    submittedBy: profile.incubation?.mentor,
    participant: profile.user,
    data: profile.mentorSummary,
    summary: `Overall Progress: ${profile.mentorSummary?.overallProgress || "N/A"}`,
  }));
};

// ==================== STARTUP MENTOR REPORTS (from StartupProfile) ====================
export const getStartupMentorReports = async (directorateId) => {
  const profiles = await StartupProfile.find({
    "incubation.center": directorateId,
    "mentorSummary.submittedAt": { $exists: true },
  })
    .populate("user", "fullName email companyName")
    .populate("incubation.mentor", "fullName email");

  return profiles.map((profile) => ({
    _id: profile._id,
    title: `Mentor Summary - ${profile.user?.companyName || profile.user?.fullName}`,
    type: "startup_mentor_report",
    status: "submitted",
    createdAt: profile.mentorSummary?.submittedAt,
    submittedBy: profile.incubation?.mentor,
    participant: profile.user,
    data: profile.mentorSummary,
    summary: `Overall Progress: ${profile.mentorSummary?.overallProgress || "N/A"}`,
  }));
};

// ==================== TRAINER REPORTS (from TrainingProfile) ====================
export const getTrainerReports = async (directorateId) => {
  const profiles = await TrainingProfile.find({
    "placement.directorate": directorateId,
    "trainerSummary.submittedAt": { $exists: true },
  })
    .populate("user", "fullName email")
    .populate("placement.trainer", "fullName email");

  return profiles.map((profile) => ({
    _id: profile._id,
    title: `Trainer Summary - ${profile.user?.fullName}`,
    type: "trainer_report",
    status: profile.trainerSummary?.status || "submitted",
    createdAt: profile.trainerSummary?.submittedAt,
    submittedBy: profile.placement?.trainer,
    participant: profile.user,
    data: profile.trainerSummary,
    summary: `Overall Performance: ${profile.trainerSummary?.overallPerformance || "N/A"}`,
  }));
};

// ==================== GET ALL REPORTS (Unified) ====================
export const getAllReportsForDirector = async (directorateId) => {
  const [
    teamReports,
    advisorReports,
    mentorReports,
    startupReports,
    trainerReports,
  ] = await Promise.all([
    getReports({
      directorate: directorateId,
      type: "team_report",
      status: "submitted",
    }),
    getAdvisorReports(directorateId),
    getMentorReports(directorateId),
    getStartupMentorReports(directorateId),
    getTrainerReports(directorateId),
  ]);

  const allReports = [
    ...(teamReports.reports || []),
    ...advisorReports,
    ...mentorReports,
    ...startupReports,
    ...trainerReports,
  ];

  allReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return allReports;
};

// ==================== EXISTING FUNCTIONS ====================
export const submitReport = async (reportId, user, req) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  if (report.status !== "draft") {
    throw new Error("Only draft reports can be submitted");
  }

  report.status = "submitted";
  report.submittedAt = new Date();

  await report.save();

  let notifyUser = null;

  if (report.type === "team_report") {
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

export const approveSummary = async (
  profileId,
  director,
  type,
  comments,
  req,
) => {
  let profile;
  let summaryField;
  let summaryName;
  let userField;
  let staffField;
  let staffName;

  switch (type) {
    case "trainer_report":
      profile = await TrainingProfile.findById(profileId).populate(
        "user placement.trainer",
      );
      summaryField = "trainerSummary";
      summaryName = "Trainer Summary";
      userField = "user";
      staffField = "placement.trainer";
      staffName = "Trainer";
      break;
    case "advisor_report":
      profile = await InternProfile.findById(profileId).populate(
        "user placement.advisor",
      );
      summaryField = "advisorSummary";
      summaryName = "Advisor Summary";
      userField = "user";
      staffField = "placement.advisor";
      staffName = "Advisor";
      break;
    case "mentor_report":
      profile = await InnovatorProfile.findById(profileId).populate(
        "user incubation.mentor",
      );
      summaryField = "mentorSummary";
      summaryName = "Mentor Summary";
      userField = "user";
      staffField = "incubation.mentor";
      staffName = "Mentor";
      break;
    case "startup_mentor_report":
      profile = await StartupProfile.findById(profileId).populate(
        "user incubation.mentor",
      );
      summaryField = "mentorSummary";
      summaryName = "Mentor Summary";
      userField = "user";
      staffField = "incubation.mentor";
      staffName = "Mentor";
      break;
    default:
      throw new Error(`Unknown report type: ${type}`);
  }

  if (!profile) throw new Error(`${summaryName} not found`);
  if (!profile[summaryField]) throw new Error(`${summaryName} not found`);
  if (profile[summaryField].status !== "pending_director_review") {
    throw new Error(`${summaryName} is not pending review`);
  }

  profile[summaryField].status = "approved";
  profile[summaryField].directorFeedback = comments || "Approved by director";
  profile[summaryField].directorDecision = "approved";
  profile[summaryField].directorReviewedAt = new Date();
  profile[summaryField].directorReviewedBy = director._id;

  await profile.save();

  if (profile[staffField]) {
    await Notification.create({
      user: profile[staffField]._id,
      title: `${summaryName} Approved`,
      message: `Your ${summaryName.toLowerCase()} for ${profile[userField]?.fullName} has been approved`,
      type: "success",
    });
  }

  await Notification.create({
    user: profile[userField]._id,
    title: `${summaryName} Approved`,
    message: `Your ${summaryName.toLowerCase()} has been approved by the director`,
    type: "success",
  });

  await logAction({
    user: director,
    action: "APPROVE",
    entity: profile.constructor.modelName,
    entityId: profile._id,
    req,
    metadata: { type: summaryName },
  });

  return { success: true, profile };
};

export const rejectSummary = async (profileId, director, type, reason, req) => {
  let profile;
  let summaryField;
  let summaryName;
  let userField;
  let staffField;

  switch (type) {
    case "trainer_report":
      profile = await TrainingProfile.findById(profileId).populate(
        "user placement.trainer",
      );
      summaryField = "trainerSummary";
      summaryName = "Trainer Summary";
      userField = "user";
      staffField = "placement.trainer";
      break;
    case "advisor_report":
      profile = await InternProfile.findById(profileId).populate(
        "user placement.advisor",
      );
      summaryField = "advisorSummary";
      summaryName = "Advisor Summary";
      userField = "user";
      staffField = "placement.advisor";
      break;
    case "mentor_report":
      profile = await InnovatorProfile.findById(profileId).populate(
        "user incubation.mentor",
      );
      summaryField = "mentorSummary";
      summaryName = "Mentor Summary";
      userField = "user";
      staffField = "incubation.mentor";
      break;
    case "startup_mentor_report":
      profile = await StartupProfile.findById(profileId).populate(
        "user incubation.mentor",
      );
      summaryField = "mentorSummary";
      summaryName = "Mentor Summary";
      userField = "user";
      staffField = "incubation.mentor";
      break;
    default:
      throw new Error(`Unknown report type: ${type}`);
  }

  if (!profile) throw new Error(`${summaryName} not found`);
  if (!profile[summaryField]) throw new Error(`${summaryName} not found`);
  if (profile[summaryField].status !== "pending_director_review") {
    throw new Error(`${summaryName} is not pending review`);
  }

  profile[summaryField].status = "rejected";
  profile[summaryField].directorFeedback = reason || "Rejected by director";
  profile[summaryField].directorDecision = "rejected";
  profile[summaryField].directorReviewedAt = new Date();
  profile[summaryField].directorReviewedBy = director._id;

  await profile.save();

  if (profile[staffField]) {
    await Notification.create({
      user: profile[staffField]._id,
      title: `${summaryName} Rejected`,
      message: `Your ${summaryName.toLowerCase()} for ${profile[userField]?.fullName} was rejected. Reason: ${reason}`,
      type: "warning",
    });
  }

  await Notification.create({
    user: profile[userField]._id,
    title: `${summaryName} Rejected`,
    message: `Your ${summaryName.toLowerCase()} has been rejected. Please contact your ${staffName?.toLowerCase() || "staff"}.`,
    type: "warning",
  });

  await logAction({
    user: director,
    action: "REJECT",
    entity: profile.constructor.modelName,
    entityId: profile._id,
    req,
    metadata: { type: summaryName },
  });

  return { success: true, profile };
};
