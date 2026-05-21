import User from "../models/User.js";
import InternProfile from "../models/InternProfile.js";
import Notification from "../models/Notification.js";
import { getPagination } from "../utils/pagination.js";

export const assignAdvisor = async (directorId, internId, advisorId) => {
  const director = await User.findById(directorId);
  if (!director || director.position !== "director") {
    throw new Error("Only director can assign advisors");
  }

  const internUser = await User.findById(internId);
  if (!internUser || !internUser.internProfile) {
    throw new Error("Invalid intern");
  }

  const advisor = await User.findById(advisorId);
  if (
    !advisor ||
    !["technical_staff", "trainer", "advisor", "mentor"].includes(
      advisor.position,
    )
  ) {
    throw new Error(
      "Invalid advisor. Must be technical_staff, trainer, advisor, or mentor",
    );
  }

  const profile = await InternProfile.findOne({ user: internId });
  if (!profile) throw new Error("Intern profile not found");

  if (
    profile.placement?.directorate?.toString() !==
    director.directorate?.toString()
  ) {
    throw new Error("Intern not in your directorate");
  }

  profile.placement = {
    ...profile.placement,
    advisor: advisorId,
    advisorAssignedAt: new Date(),
    advisorAssignedBy: directorId,
  };

  await profile.save();

  await Notification.create({
    user: internId,
    title: "Advisor Assigned",
    message: `${advisor.fullName} is now your advisor`,
    type: "success",
  });

  await Notification.create({
    user: advisorId,
    title: "New Intern Assigned",
    message: `You are now advisor for ${internUser.fullName}`,
    type: "assignment",
  });

  return { success: true, profile };
};

export const getDirectorInternSummaries = async (directorId, queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  const director = await User.findById(directorId).populate("directorate");

  if (!director || !director.directorate) {
    throw new Error("Director not assigned to a directorate");
  }

  const usersInDirectorate = await User.find({
    directorate: director.directorate._id,
    position: "intern",
    isActive: true,
  }).select("_id");

  const userIds = usersInDirectorate.map((u) => u._id);

  const filter = {
    user: { $in: userIds },
    status: { $in: ["active", "approved"] },
  };

  const total = await InternProfile.countDocuments(filter);

  const interns = await InternProfile.find(filter)
    .populate("user", "fullName email phone")
    .populate("placement.advisor", "fullName email position")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  return {
    success: true,
    data: interns.map((i) => ({
      intern: i.user,
      advisor: i.placement?.advisor || null,
      advisorAssignedAt: i.placement?.advisorAssignedAt,
      summary: i.advisorSummary,
      reports: i.reports,
      placement: i.placement,
      status: i.status,
      university: i.university,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getInternProgress = async (directorId, internId) => {
  const director = await User.findById(directorId);

  const profile = await InternProfile.findOne({
    user: internId,
    "placement.directorate": director.directorate,
  })
    .populate("user", "fullName email")
    .populate("placement.advisor", "fullName");

  if (!profile) throw new Error("Intern not found in your directorate");

  const reports = profile.reports;

  const stats = {
    totalWeeks: reports.length,
    completedWeeks: reports.filter((r) => r.status === "advisor_reviewed")
      .length,
    averageRating:
      reports.reduce((sum, r) => sum + (r.advisorRating || 0), 0) /
        reports.length || 0,
    latestReport: reports[reports.length - 1],
    summary: profile.advisorSummary,
  };

  return {
    success: true,
    intern: profile.user,
    advisor: profile.placement.advisor,
    stats,
    reports,
  };
};

export const updateInternStatus = async (internId, status) => {
  const intern = await InternProfile.findById(internId);
  if (!intern) throw new Error("Intern not found");

  const oldStatus = intern.status;

  const validTransitions = {
    pending: ["approved", "rejected"],
    approved: ["active", "rejected"],
    active: ["completed", "suspended"],
    suspended: ["active", "rejected"],
    completed: [],
    rejected: [],
  };

  if (!validTransitions[oldStatus]?.includes(status)) {
    throw new Error(`Invalid status transition from ${oldStatus} to ${status}`);
  }

  intern.status = status;

  if (status === "completed" && !intern.placement?.endDate) {
    intern.placement.endDate = new Date();
  }

  await intern.save();

  await Notification.create({
    user: intern.user,
    title: "Internship Status Updated",
    message: `Your internship status has been updated from ${oldStatus} to ${status}`,
    type: "info",
  });

  return {
    success: true,
    message: `Intern status updated from ${oldStatus} to ${status}`,
    status: intern.status,
    startDate: intern.placement?.startDate,
    endDate: intern.placement?.endDate,
  };
};
