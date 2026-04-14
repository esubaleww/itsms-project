import User from "../models/User.js";
import Request from "../models/Request.js";
import Team from "../models/Team.js";

import Notification from "../models/Notification.js";

export const getMyTeam = async (teamLeadId) => {
  const teamLead = await User.findById(teamLeadId)
    .populate("directorate", "name type")
    .populate("team");

  if (!teamLead || !teamLead.team) {
    console.log("Team lead not found or no team assigned");
    return;
  }

  const team = await Team.findById(teamLead.team._id)
    .populate("lead", "fullName email phone")
    .populate("members", "fullName email position staffProfile")
    .populate("directorate", "name head");

  const activeRequests = await Request.countDocuments({
    assignedTeam: team._id,
    status: { $in: ["assigned_to_team", "in_progress"] },
  });

  const completedRequests = await Request.countDocuments({
    assignedTeam: team._id,
    status: "completed",
  });

  return {
    success: true,
    team: {
      ...team.toObject(),
      stats: {
        totalMembers: team.members.length,
        activeRequests,
        completedRequests,
        workload: activeRequests / Math.max(team.members.length, 1),
      },
    },
  };
};

export const getTeamMembers = async (teamLeadId) => {
  const teamLead = await User.findById(teamLeadId).populate("team");

  if (!teamLead || !teamLead.team) {
    console.log("Team lead not found or no team assigned");
    return;
  }

  const members = await User.find({ team: teamLead.team._id, isActive: true })
    .select("-password")
    .populate("staffProfile", "skills qualifications");

  const membersWithWorkload = await Promise.all(
    members.map(async (member) => {
      const activeTasks = await Request.countDocuments({
        assignedTo: member._id,
        status: { $in: ["assigned_to_team", "in_progress"] },
      });
      return {
        ...member.toObject(),
        activeTasks,
      };
    }),
  );

  return {
    success: true,
    members: membersWithWorkload,
  };
};

export const getTeamTasks = async (teamLeadId, filters = {}) => {
  const teamLead = await User.findById(teamLeadId).populate("team");

  if (!teamLead || !teamLead.team) {
    console.log("Team lead not found or no team assigned");
    return;
  }

  const query = { assignedTeam: teamLead.team._id };

  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.assignedTo) query.assignedTo = filters.assignedTo;
  if (filters.search) {
    query.$or = [
      { "applicant.fullName": { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }

  const tasks = await Request.find(query)
    .populate("applicant", "fullName email")
    .populate("assignedTo", "fullName")
    .populate("relatedProfile")
    .sort("-createdAt");

  const grouped = {
    pending: tasks.filter((t) => t.status === "assigned_to_team"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  return {
    success: true,
    counts: {
      total: tasks.length,
      pending: grouped.pending.length,
      inProgress: grouped.in_progress.length,
      completed: grouped.completed.length,
    },
    tasks: grouped,
  };
};

export const getTaskById = async (teamLeadId, taskId) => {
  const teamLead = await User.findById(teamLeadId).populate("team");

  const task = await Request.findOne({
    _id: taskId,
    assignedTeam: teamLead.team._id,
  })
    .populate("applicant", "fullName email phone")
    .populate("relatedProfile")
    .populate("assignedTo", "fullName email")
    .populate("timeline.by", "fullName position");

  if (!task) {
    throw new Error("Task not found or not in your team");
  }

  const members = await User.find({
    team: teamLead.team._id,
    isActive: true,
  }).select("fullName email position");

  return {
    success: true,
    task,
    availableMembers: members,
  };
};

export const assignTask = async (
  teamLeadId,
  taskId,
  memberId,
  instructions,
) => {
  const teamLead = await User.findById(teamLeadId).populate("team");

  const task = await Request.findOne({
    _id: taskId,
    assignedTeam: teamLead.team._id,
  });

  if (!task) {
    throw new Error("Task not found or not in your team");
  }

  // Verify member is in team
  const member = await User.findOne({
    _id: memberId,
    team: teamLead.team._id,
    isActive: true,
  });

  if (!member) {
    throw new Error("Member not found or not in your team");
  }

  // Update task
  task.assignedTo = memberId;
  task.status = "in_progress";
  task.timeline.push({
    action: "Task assigned to individual",
    by: teamLeadId,
    details: instructions || "Assigned by team lead",
  });

  // Add to tasks array if needed
  if (!task.tasks) task.tasks = [];
  task.tasks.push({
    title: task.title || `${task.type} request`,
    description: task.description,
    assignedTo: memberId,
    status: "pending",
  });

  await task.save();

  // Notify member
  await Notification.create({
    user: memberId,
    title: "New Task Assigned",
    message: `You have been assigned a new task: ${task.type} request. ${instructions || ""}`,
    type: "assignment",
    relatedTo: { model: "Request", id: task._id },
    actionUrl: `/tasks/${task._id}`,
  });

  // Notify team lead (confirmation)
  await Notification.create({
    user: teamLeadId,
    title: "Task Assigned",
    message: `Task assigned to ${member.fullName}`,
    type: "success",
    relatedTo: { model: "Request", id: task._id },
  });

  return {
    success: true,
    message: `Task assigned to ${member.fullName}`,
    task,
  };
};

// Update task status (when member completes)
export const updateTaskStatus = async (
  teamLeadId,
  taskId,
  taskIndex,
  status,
  notes,
) => {
  const teamLead = await User.findById(teamLeadId).populate("team");

  const task = await Request.findOne({
    _id: taskId,
    assignedTeam: teamLead.team._id,
  });

  if (!task) {
    throw new Error("Task not found or not in your team");
  }

  if (task.tasks && task.tasks[taskIndex]) {
    task.tasks[taskIndex].status = status;
    if (status === "completed") {
      task.tasks[taskIndex].completedAt = new Date();
      task.tasks[taskIndex].notes = notes;
    }
  }

  // Check if all tasks are completed
  const allCompleted = task.tasks?.every((t) => t.status === "completed");

  if (allCompleted) {
    task.status = "completed";
    task.completedAt = new Date();
    task.timeline.push({
      action: "Task completed",
      by: teamLeadId,
      details: notes || "All tasks completed",
    });
  }

  await task.save();

  return {
    success: true,
    message: "Task status updated",
    task,
  };
};

export const getTeamProgress = async (teamLeadId) => {
  const teamLead = await User.findById(teamLeadId).populate("team");

  if (!teamLead || !teamLead.team) {
    console.log("Team lead not found or no team assigned");
    return;
  }

  const teamId = teamLead.team._id;

  const requests = await Request.find({ assignedTeam: teamId });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "assigned_to_team").length,
    inProgress: requests.filter((r) => r.status === "in_progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
    completionRate: requests.length
      ? (requests.filter((r) => r.status === "completed").length /
          requests.length) *
        100
      : 0,
  };

  // Get member performance
  const members = await User.find({ team: teamId, isActive: true }).select(
    "fullName email position",
  );

  const memberPerformance = await Promise.all(
    members.map(async (member) => {
      const memberTasks = await Request.find({ assignedTo: member._id });
      const completed = memberTasks.filter(
        (t) => t.status === "completed",
      ).length;
      return {
        id: member._id,
        name: member.fullName,
        position: member.position,
        totalTasks: memberTasks.length,
        completedTasks: completed,
        completionRate: memberTasks.length
          ? (completed / memberTasks.length) * 100
          : 0,
      };
    }),
  );

  // Get weekly activity
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    })
    .reverse();

  const weeklyActivity = await Promise.all(
    last7Days.map(async (date) => {
      const dayRequests = await Request.find({
        assignedTeam: teamId,
        createdAt: {
          $gte: new Date(date),
          $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      });
      return {
        date,
        completed: dayRequests.filter((r) => r.status === "completed").length,
        inProgress: dayRequests.filter((r) => r.status === "in_progress")
          .length,
      };
    }),
  );

  return {
    success: true,
    stats,
    memberPerformance,
    weeklyActivity,
  };
};

// Request new staff from HR/Admin
export const requestStaff = async (teamLeadId, requestData) => {
  const teamLead = await User.findById(teamLeadId)
    .populate("team")
    .populate("directorate");

  if (!teamLead || !teamLead.team) {
    throw new Error("Team lead not found or no team assigned");
  }

  const { position, skills, reason, urgency } = requestData;

  // Create a request record
  const request = await Request.create({
    type: "staff_request",
    applicant: teamLeadId,
    metadata: {
      position,
      skills,
      reason,
      urgency: urgency || "normal",
      teamId: teamLead.team._id,
      teamName: teamLead.team.name,
      directorate: teamLead.directorate.name,
    },
    status: "pending_admin",
    timeline: [
      {
        action: "Staff request submitted",
        by: teamLeadId,
        details: `Requesting ${position} for team ${teamLead.team.name}. Reason: ${reason}`,
      },
    ],
  });

  // Notify admin/HR
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    await Notification.create({
      user: admin._id,
      title: "Staff Request",
      message: `Team lead ${teamLead.fullName} requests a ${position} for team ${teamLead.team.name}`,
      type: "request",
      relatedTo: { model: "Request", id: request._id },
      actionUrl: `/admin/requests/${request._id}`,
    });
  }

  return {
    success: true,
    message: "Staff request submitted to HR",
    request,
  };
};
