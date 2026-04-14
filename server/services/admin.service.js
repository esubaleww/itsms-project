import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Directorate from "../models/Directorate.js";
import Team from "../models/Team.js";
import Notification from "../models/Notification.js";
import StaffProfile from "../models/StaffProfile.js";
import AuditLog from "../models/AuditLog.js";
import Settings from "../models/Settings.js";
import { logAction } from "../utils/auditLogger.js";
import {
  sendVerificationEmail,
  sendStaffWelcomeEmail,
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
  sendInternshipAcceptedEmail,
} from "./email.service.js";

export const getPendingRequests = async () => {
  const requests = await Request.find({ status: "pending_admin" })
    .populate("applicant", "fullName email")
    .populate("relatedProfile")
    .sort("-createdAt");

  const grouped = {
    internship: [],
    innovation: [],
    startup: [],
    service: [],
    training: [],
  };

  requests.forEach((r) => {
    grouped[r.type]?.push(r);
  });

  return {
    success: true,
    counts: {
      total: requests.length,
      internship: grouped.internship.length,
      innovation: grouped.innovation.length,
      startup: grouped.startup.length,
      service: grouped.service.length,
      training: grouped.training.length,
    },
    requests: grouped,
  };
};

export const getRequestById = async (requestId) => {
  const request = await Request.findById(requestId)
    .populate("applicant", "fullName email phone")
    .populate("relatedProfile")
    .populate("timeline.by", "fullName");

  if (!request) throw new Error("Request not found");

  return { success: true, request };
};

export const approveRequest = async (requestId, admin, comments, req) => {
  try {
    const request = await Request.findById(requestId).populate(
      "applicant",
      "fullName email",
    );

    if (!request) throw new Error("Request not found");

    const directorate = await request.autoRouteToDirectorate();

    if (!directorate) {
      throw new Error("No directorate available for this request type");
    }

    await request.populate("directorate");

    let profile = null;

    if (request.profileModel) {
      const Profile = mongoose.model(request.profileModel);
      profile = await Profile.findById(request.relatedProfile);

      if (!profile) throw new Error("Profile not found");

      profile.status = "approved";
      profile.approvedBy = admin._id;
      profile.approvedAt = new Date();
    }

    const programTypes = [
      "InternProfile",
      "InnovatorProfile",
      "StartupProfile",
      "TrainingProfile",
    ];

    if (programTypes.includes(request.profileModel) && profile) {
      const user = await User.findById(request.applicant._id);

      let existingProgram = null;
      if (user.internProfile && request.profileModel !== "InternProfile")
        existingProgram = "internship";
      if (user.innovatorProfile && request.profileModel !== "InnovatorProfile")
        existingProgram = "innovation";
      if (user.startupProfile && request.profileModel !== "StartupProfile")
        existingProgram = "startup";
      if (user.trainingProfile && request.profileModel !== "TrainingProfile")
        existingProgram = "training";

      if (existingProgram) {
        throw new Error(
          `User already has an active ${existingProgram} application. Cannot apply for another program.`,
        );
      }
    }

    if (request.profileModel === "InternProfile" && profile) {
      const directorateId = request.directorate._id;
      const directorateName = request.directorate.name;

      profile.status = "active";

      if (!profile.placement) {
        profile.placement = {};
      }
      profile.placement.directorate = directorateId;
      profile.placement.startDate = new Date();

      await profile.save();

      await User.findByIdAndUpdate(request.applicant._id, {
        internProfile: profile._id,
        position: "intern",
        directorate: directorateId,
        $unset: {
          innovatorProfile: "",
          startupProfile: "",
          trainingProfile: "",
        },
      });

      await Notification.create({
        user: request.applicant._id,
        title: "Internship Accepted 🎉",
        message: `Congratulations! You have been accepted into the ${directorateName} program.`,
        type: "success",
      });

      try {
        await sendInternshipAcceptedEmail(
          request.applicant.email,
          request.applicant.fullName,
          new Date(),
          directorateName,
        );
      } catch (emailError) {
        console.error("Email sending failed for intern:", emailError.message);
      }
    }

    if (request.profileModel === "InnovatorProfile" && profile) {
      const directorateId = request.directorate._id;

      profile.status = "incubating";

      if (!profile.incubation) {
        profile.incubation = {};
      }
      profile.incubation.center = directorateId;
      profile.incubation.startDate = new Date();

      await profile.save();

      await User.findByIdAndUpdate(request.applicant._id, {
        innovatorProfile: profile._id,
        position: "innovator",
        directorate: directorateId,
        $unset: {
          internProfile: "",
          startupProfile: "",
          trainingProfile: "",
        },
      });

      await Notification.create({
        user: request.applicant._id,
        title: "Innovation Application Approved 🎉",
        message: `Your innovation idea "${profile.ideaTitle}" has been approved for incubation.`,
        type: "success",
      });

      try {
        await sendApplicationApprovedEmail(
          request.applicant.email,
          request.applicant.fullName,
          "innovation",
        );
      } catch (emailError) {
        console.error(
          "Email sending failed for innovator:",
          emailError.message,
        );
      }
    }

    if (request.profileModel === "StartupProfile" && profile) {
      const directorateId = request.directorate._id;

      profile.status = "incubating";

      if (!profile.incubation) {
        profile.incubation = {};
      }
      profile.incubation.center = directorateId;
      profile.incubation.startDate = new Date();
      profile.incubation.stage = "idea";
      profile.incubation.fundingStage = "bootstrapped";

      await profile.save();

      await User.findByIdAndUpdate(request.applicant._id, {
        startupProfile: profile._id,
        position: "startup",
        directorate: directorateId,
        $unset: {
          internProfile: "",
          innovatorProfile: "",
          trainingProfile: "",
        },
      });

      await Notification.create({
        user: request.applicant._id,
        title: "Startup Registration Approved 🚀",
        message: `Your startup "${profile.companyName}" has been approved for incubation.`,
        type: "success",
      });

      try {
        await sendApplicationApprovedEmail(
          request.applicant.email,
          request.applicant.fullName,
          "startup",
        );
      } catch (emailError) {
        console.error("Email sending failed for startup:", emailError.message);
      }
    }

    if (request.profileModel === "TrainingProfile" && profile) {
      const directorateId = request.directorate._id;

      profile.status = "active";
      if (!profile.placement) {
        profile.placement = {};
      }
      profile.placement.directorate = directorateId;
      profile.placement.startDate = new Date();
      await profile.save();

      await User.findByIdAndUpdate(request.applicant._id, {
        trainingProfile: profile._id,
        position: "trainee",
        directorate: directorateId,
        $unset: {
          internProfile: "",
          innovatorProfile: "",
          startupProfile: "",
        },
      });

      await Notification.create({
        user: request.applicant._id,
        title: "Training Application Approved 📚",
        message: `Your training application has been approved.`,
        type: "success",
      });

      try {
        await sendApplicationApprovedEmail(
          request.applicant.email,
          request.applicant.fullName,
          "training",
        );
      } catch (emailError) {
        console.error("Email sending failed for training:", emailError.message);
      }
    }

    if (request.profileModel === "RequesterProfile" && profile) {
      profile.status = "active";
      profile.totalRequests = (profile.totalRequests || 0) + 1;
      await profile.save();

      await User.findByIdAndUpdate(request.applicant._id, {
        requesterProfile: profile._id,
      });

      await Notification.create({
        user: request.applicant._id,
        title: "Service Request Approved ✅",
        message: `Your service request for "${request.metadata?.serviceType}" has been approved and assigned to the appropriate team.`,
        type: "success",
      });

      try {
        await sendApplicationApprovedEmail(
          request.applicant.email,
          request.applicant.fullName,
          "service",
        );
      } catch (emailError) {
        console.error("Email sending failed for service:", emailError.message);
      }
    }

    request.adminDecision = {
      approved: true,
      comment: comments,
      date: new Date(),
      by: admin._id,
    };

    request.status = "approved";
    request.timeline.push({
      action: "Application approved",
      by: admin._id,
      details: comments || "Approved by admin",
    });

    await request.save();

    if (request.assignedDirector) {
      await Notification.create({
        user: request.assignedDirector,
        title: "New Request Assigned",
        message: `${request.type} request from ${request.applicant.fullName} assigned to your directorate`,
        type: "assignment",
        relatedTo: { model: "Request", id: request._id },
        actionUrl: `/director/requests/${request._id}`,
      });
    }

    await logAction({
      user: admin,
      action: "APPROVE",
      entity: "Request",
      entityId: request._id,
      metadata: { comments },
      req,
    });

    return {
      success: true,
      message: "Request approved and routed successfully",
      request,
    };
  } catch (error) {
    console.error("Approve request error:", error);
    throw error;
  }
};

export const rejectRequest = async (requestId, admin, reason, req) => {
  const request = await Request.findById(requestId);
  if (!request) throw new Error("Request not found");

  if (request.profileModel) {
    const Profile = mongoose.model(request.profileModel);
    await Profile.findByIdAndUpdate(request.relatedProfile, {
      status: "rejected",
      reviewedBy: admin._id,
      reviewedAt: new Date(),
      reviewNotes: [{ reviewer: admin._id, comment: reason }],
    });
  }

  request.status = "rejected";
  request.adminDecision = {
    approved: false,
    comment: reason,
    date: new Date(),
    by: admin._id,
  };
  request.timeline.push({
    action: "Application rejected",
    by: admin._id,
    details: reason,
  });

  await request.save();

  try {
    await sendApplicationRejectedEmail(
      request.applicant.email,
      request.applicant.fullName,
      request.type,
      reason,
    );
  } catch (emailError) {
    console.error("Email error (non-blocking):", emailError.message);
  }

  await logAction({
    user: admin,
    action: "REJECT",
    entity: "Request",
    entityId: request._id,
    metadata: { reason },
    req,
  });

  return {
    success: true,
    message: "Request rejected",
    request,
  };
};

export const getAdminStats = async () => {
  const [
    totalUsers,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    activeInterns,
    activeInnovators,
    activeStartups,
    newUsersThisMonth,
  ] = await Promise.all([
    User.countDocuments(),
    Request.countDocuments({ status: "pending_admin" }),
    Request.countDocuments({
      $or: [{ status: "approved" }, { "adminDecision.approved": true }],
    }),
    Request.countDocuments({
      $or: [{ status: "rejected" }, { "adminDecision.approved": false }],
    }),
    User.countDocuments({ internProfile: { $exists: true, $ne: null } }),
    User.countDocuments({ innovatorProfile: { $exists: true, $ne: null } }),
    User.countDocuments({ startupProfile: { $exists: true, $ne: null } }),
    User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    }),
  ]);

  const totalApproved = approvedRequests;

  return {
    success: true,
    stats: {
      totalUsers,
      pendingRequests,
      approvedRequests: totalApproved,
      rejectedRequests,
      activeInterns,
      activeInnovators,
      activeStartups,
      newUsersThisMonth,
    },
  };
};

export const createDirectorate = async (admin, data, req) => {
  const { name, type, description } = data;

  const existing = await Directorate.findOne({ name });
  if (existing) throw new Error("Directorate already exists");

  const directorate = await Directorate.create({
    name,
    type,
    description,
    isActive: true,
  });

  await logAction({
    user: admin,
    action: "CREATE",
    entity: "Directorate",
    entityId: directorate._id,
    req,
  });

  return {
    success: true,
    message: "Directorate created successfully",
    directorate,
  };
};

export const getAllDirectorates = async () => {
  const directorates = await Directorate.find({ isActive: true })
    .populate("head", "fullName email")
    .populate("teams", "name")
    .sort("-createdAt");

  return { success: true, directorates };
};

export const getDirectorateById = async (id) => {
  const directorate = await Directorate.findById(id)
    .populate("head", "fullName email")
    .populate("teams", "name lead");
  if (!directorate) throw new Error("Directorate not found");
  return { success: true, directorate };
};

export const updateDirectorate = async (id, data) => {
  const directorate = await Directorate.findById(id);
  if (!directorate) throw new Error("Directorate not found");

  Object.assign(directorate, data);
  await directorate.save();

  return {
    success: true,
    message: "Directorate updated successfully",
    directorate,
  };
};

export const deleteDirectorate = async (id) => {
  const directorate = await Directorate.findById(id);
  if (!directorate) throw new Error("Directorate not found");

  directorate.isActive = false;
  await directorate.save();

  return { success: true, message: "Directorate deactivated successfully" };
};

export const createStaff = async (admin, staffData, req) => {
  const { email, fullName, phone, position, directorateId, teamId } = staffData;

  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const tempPassword = Math.random().toString(36).slice(-8);
  console.log("Temp password:", tempPassword);

  const user = await User.create({
    email,
    password: tempPassword,
    fullName,
    phone: phone || "",
    role: "staff",
    position,
    directorate: directorateId || null,
    team: teamId || null,
    isActive: true,
    emailVerified: true,
  });

  const profile = await StaffProfile.create({
    user: user._id,
    employeeId: `EMP${Date.now()}`,
    position,
    directorate: directorateId,
    team: teamId,
  });

  user.staffProfile = profile._id;
  await user.save();

  if (position === "director" && directorateId) {
    const updated = await Directorate.findByIdAndUpdate(
      directorateId,
      { head: user._id },
      { new: true },
    );
    if (!updated) {
      console.error("Failed to update directorate head for:", directorateId);
    }
  }

  if (position === "team_lead" && teamId) {
    await Team.findByIdAndUpdate(teamId, { lead: user._id });
  }

  try {
    await sendStaffWelcomeEmail(email, fullName, tempPassword);
  } catch (emailError) {
    console.error("Email sending failed for service:", emailError.message);
  }

  await Notification.create({
    user: admin._id,
    title: "Staff Created",
    message: `Created ${position}: ${fullName} (${email})`,
    type: "info",
  });

  await logAction({
    user: admin,
    action: "CREATE",
    entity: "User",
    entityId: user._id,
    metadata: { position, email },
    req,
  });

  return {
    success: true,
    message: "Staff created successfully. Welcome email sent.",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      position: user.position,
      directorate: user.directorate,
      team: user.team,
      profile: {
        id: profile._id,
        employeeId: profile.employeeId,
      },
      tempPassword,
    },
  };
};

export const getAllStaff = async () => {
  const staff = await User.find({ role: "staff" })
    .populate("directorate", "name")
    .populate("team", "name")
    .select("-password")
    .sort("-createdAt");

  return { success: true, staff };
};

export const getStaffById = async (staffId) => {
  const staff = await User.findById(staffId)
    .populate("directorate", "name")
    .populate("team", "name")
    .select("-password");

  if (!staff) throw new Error("Staff not found");
  return { success: true, staff };
};

export const updateStaff = async (staffId, data) => {
  const user = await User.findById(staffId);
  if (!user) throw new Error("Staff not found");
  if (user.role !== "staff") throw new Error("User is not staff");

  const { position, directorateId, teamId, isActive } = data;

  if (position !== undefined) user.position = position;
  if (directorateId !== undefined) user.directorate = directorateId;
  if (teamId !== undefined) user.team = teamId;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  // Update staff profile
  await StaffProfile.findOneAndUpdate(
    { user: staffId },
    { position: user.position, directorate: user.directorate, team: user.team },
  );

  return { success: true, message: "Staff updated successfully", user };
};

export const deleteStaff = async (staffId) => {
  const user = await User.findById(staffId);
  if (!user) throw new Error("Staff not found");
  if (user.role !== "staff") throw new Error("User is not staff");

  user.isActive = false;
  await user.save();

  return { success: true, message: "Staff deactivated successfully" };
};

export const resetStaffPassword = async (staffId, admin) => {
  const user = await User.findById(staffId);
  if (!user) throw new Error("Staff not found");
  if (user.role !== "staff") throw new Error("User is not staff");

  const tempPassword = Math.random().toString(36).slice(-8);
  user.password = await bcrypt.hash(tempPassword, 10);
  await user.save();

  // Send email with new password
  await sendStaffWelcomeEmail(user.email, user.fullName, tempPassword);

  await Notification.create({
    user: admin._id,
    title: "Password Reset",
    message: `Password reset for ${user.email}`,
    type: "info",
  });

  return {
    success: true,
    message: "Password reset successfully. Email sent.",
    tempPassword,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  };
};

export const getAvailableStaff = async () => {
  const staff = await User.find({
    role: "staff",
    team: null,
    isActive: true,
    position: { $nin: ["director", "team_lead"] },
  })
    .select("-password")
    .sort("-createdAt");

  return { success: true, staff };
};

// ========================
// USER MANAGEMENT
// ========================

export const getAllUsers = async (filters = {}) => {
  const query = {};

  if (filters.role) query.role = filters.role;
  if (filters.verified === "true") query.emailVerified = true;
  if (filters.verified === "false") query.emailVerified = false;
  if (filters.search) {
    query.$or = [
      { fullName: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select(
      "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires",
    )
    .sort("-createdAt");

  return { success: true, users };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select(
      "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires",
    )
    .populate("directorate", "name")
    .populate("team", "name");

  if (!user) throw new Error("User not found");

  const profile = await user.getProfile();

  return {
    success: true,
    user: {
      ...user.toObject(),
      profile,
    },
  };
};

export const updateUser = async (userId, data, admin, req) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const { fullName, phone, role, isActive, demographic } = data;

  if (fullName !== undefined) user.fullName = fullName;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (demographic) user.demographic = { ...user.demographic, ...demographic };

  await user.save();

  await logAction({
    user: admin,
    action: "UPDATE",
    entity: "User",
    entityId: user._id,
    metadata: { updates: Object.keys(data) },
    req,
  });

  return { success: true, message: "User updated successfully", user };
};

export const deleteUser = async (userId, admin, req) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.isActive = false;
  await user.save();

  await logAction({
    user: admin,
    action: "DELETE",
    entity: "User",
    entityId: user._id,
    req,
  });

  return { success: true, message: "User deactivated successfully" };
};

export const resendVerification = async (userId, admin, req) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.emailVerified) {
    throw new Error("User already verified");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = verificationExpires;
  await user.save();

  await sendVerificationEmail(user.email, user.fullName, verificationToken);

  await logAction({
    user: admin,
    action: "RESEND_VERIFICATION",
    entity: "User",
    entityId: user._id,
    req,
  });

  return { success: true, message: "Verification email sent" };
};

// ========================
// DIRECTORATE HEAD
// ========================

export const updateDirectorateHead = async (directorateId, staffId) => {
  const directorate = await Directorate.findById(directorateId);
  if (!directorate) throw new Error("Directorate not found");

  directorate.head = staffId;
  await directorate.save();

  return { success: true, directorate };
};

// ========================
// AUDIT LOGS
// ========================

export const getAuditLogs = async (filters = {}) => {
  const query = {};
  const limit = parseInt(filters.limit) || 100;
  const skip = parseInt(filters.skip) || 0;

  if (filters.action) query.action = filters.action;
  if (filters.entity) query.entity = filters.entity;
  if (filters.userId) query.user = filters.userId;
  if (filters.startDate) {
    query.timestamp = { ...query.timestamp, $gte: new Date(filters.startDate) };
  }
  if (filters.endDate) {
    query.timestamp = { ...query.timestamp, $lte: new Date(filters.endDate) };
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate("user", "fullName email")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(query),
  ]);

  return {
    success: true,
    logs,
    pagination: {
      total,
      limit,
      skip,
      hasMore: skip + limit < total,
    },
  };
};

// ========================
// SYSTEM SETTINGS
// ========================

let settingsCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

export const getSettings = async () => {
  if (settingsCache && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
    return { success: true, settings: settingsCache };
  }

  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }

  settingsCache = settings.toObject();
  cacheTime = Date.now();

  return { success: true, settings: settingsCache };
};

export const updateSettings = async (data, admin, req) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  Object.assign(settings, data);
  await settings.save();

  settingsCache = null;
  cacheTime = null;

  await logAction({
    user: admin,
    action: "UPDATE_SETTINGS",
    entity: "Settings",
    entityId: settings._id,
    metadata: { updates: Object.keys(data) },
    req,
  });

  return { success: true, message: "Settings updated successfully", settings };
};
