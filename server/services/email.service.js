import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";
import { renderTemplate } from "./email.template.service.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, templateName, data) => {
  const html = renderTemplate(templateName, {
    ...data,
    year: new Date().getFullYear(),
    appName: "ITSMS",
  });

  const mailOptions = {
    from: `"ITSMS" <${ENV.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
};

export const sendVerificationEmail = (to, fullName, token) => {
  return sendEmail(to, "Verify Your Email Address", "verification", {
    fullName,
    verificationUrl: `${ENV.CLIENT_URL}/verify-email?token=${token}`,
  });
};

export const sendPasswordResetEmail = (to, fullName, token) => {
  return sendEmail(to, "Reset Your Password", "password-reset", {
    fullName,
    resetUrl: `${ENV.CLIENT_URL}/reset-password?token=${token}`,
  });
};

export const sendStaffWelcomeEmail = (to, fullName, tempPassword) => {
  return sendEmail(to, "Welcome to ITSMS Staff", "staff-welcome", {
    fullName,
    email: to,
    tempPassword,
    loginUrl: `${ENV.CLIENT_URL}/login`,
  });
};

export const sendApplicationApprovedEmail = (to, fullName, applicationType) => {
  return sendEmail(to, "Application Approved", "application-approved", {
    fullName,
    applicationType,
    approvalDate: new Date().toLocaleDateString(),
    dashboardUrl: `${ENV.CLIENT_URL}/dashboard`,
  });
};

export const sendApplicationRejectedEmail = (to, fullName, applicationType) => {
  return sendEmail(to, "Application Rejected", "application-rejected", {
    fullName,
    applicationType,
    approvalDate: new Date().toLocaleDateString(),
    dashboardUrl: `${ENV.CLIENT_URL}/dashboard`,
  });
};

export const sendRequestAssignedEmail = (
  to,
  fullName,
  requestType,
  priority,
  deadline,
) => {
  const priorityColor =
    {
      low: "#22c55e",
      medium: "#eab308",
      high: "#f97316",
      urgent: "#ef4444",
    }[priority] || "#666";

  return sendEmail(to, "New Request Assigned", "request-assigned", {
    fullName,
    requestType,
    priority,
    priorityColor,
    deadline: new Date(deadline).toLocaleDateString(),
    taskUrl: `${ENV.CLIENT_URL}/tasks`,
  });
};

export const sendInternshipAcceptedEmail = (
  to,
  fullName,
  startDate,
  directorate,
) => {
  const formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString()
    : "To be determined";
  const directorateName = directorate || "To be assigned";
  return sendEmail(to, "Internship Accepted", "internship-accepted", {
    fullName,
    startDate: formattedStartDate,
    directorate: directorateName,
    dashboardUrl: `${ENV.CLIENT_URL}/dashboard`,
  });
};

export const sendTaskAssignedEmail = (
  to,
  fullName,
  assignerName,
  taskTitle,
  taskDescription,
  priority,
  deadline,
  instructions,
) => {
  const priorityColor = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#f97316",
    urgent: "#ef4444",
  }[priority];
  return sendEmail(to, "New Task Assigned", "task-assigned", {
    fullName,
    assignerName,
    taskTitle,
    taskDescription,
    priority,
    priorityColor,
    deadline,
    instructions,
    taskUrl: `${ENV.CLIENT_URL}/tasks`,
  });
};

export const sendRequestAssignedToTeam = (
  to,
  fullName,
  assignerName,
  teamName,
  requestType,
  description,
  priority,
  deadline,
  instructions,
) => {
  const priorityColor = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#f97316",
    urgent: "#ef4444",
  }[priority];
  return sendEmail(
    to,
    "New Request Assigned to Your Team",
    "request-assigned-to-team",
    {
      fullName,
      assignerName,
      teamName,
      requestType,
      description,
      priority,
      priorityColor,
      deadline,
      instructions,
      requestUrl: `${ENV.CLIENT_URL}/requests`,
    },
  );
};

export const sendPromotedToTeamLead = (
  to,
  fullName,
  assignerName,
  teamName,
  directorate,
  memberCount,
) => {
  return sendEmail(
    to,
    "Promoted to Team Lead",
    "request-assigned-to-team-lead",
    {
      fullName,
      assignerName,
      teamName,
      directorate,
      memberCount,
      teamUrl: `${ENV.CLIENT_URL}/team`,
    },
  );
};

export const sendTaskStatusUpdated = (
  to,
  fullName,
  memberName,
  taskTitle,
  status,
  notes,
) => {
  const statusColor = {
    pending: "#eab308",
    in_progress: "#3b82f6",
    completed: "#22c55e",
  }[status];
  return sendEmail(to, "Task Status Updated", "task-status-updated", {
    fullName,
    memberName,
    taskTitle,
    status,
    statusColor,
    notes,
    taskUrl: `${ENV.CLIENT_URL}/tasks`,
  });
};

export const sendAddedToTeam = (
  to,
  fullName,
  assignerName,
  teamName,
  directorate,
  teamLeadName,
) => {
  return sendEmail(to, "Added to Team", "member-added-to-team", {
    fullName,
    assignerName,
    teamName,
    directorate,
    teamLeadName,
    teamUrl: `${ENV.CLIENT_URL}/team`,
  });
};
