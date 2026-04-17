import Request from "../models/Request.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getStaffStats = async (userId) => {
  const tasks = await Request.find({
    assignedTo: userId,
    status: { $in: ["assigned_to_team", "in_progress", "completed"] },
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const pendingTasks = tasks.filter(
    (t) => t.status === "assigned_to_team",
  ).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    completionRate,
  };
};

export const getMyTasks = async (userId) => {
  const tasks = await Request.find({
    assignedTo: userId,
    status: { $in: ["assigned_to_team", "in_progress", "completed"] },
  })
    .populate("applicant", "fullName email")
    .populate("assignedDirector", "fullName email")
    .populate("assignedTeam", "name")
    .populate("directorate", "name")
    .sort({ createdAt: -1 });

  return tasks.map((task) => ({
    _id: task._id,
    type: task.type,
    title:
      task.type === "service"
        ? task.metadata?.serviceType || "Service Request"
        : `${task.type.charAt(0).toUpperCase() + task.type.slice(1)} Request`,
    description: task.metadata?.description || task.description,
    status: task.status,
    createdAt: task.createdAt,
    deadline: task.deadline,
    assignedBy: task.assignedDirector,
    assignedTeam: task.assignedTeam,
    directorate: task.directorate,
    applicant: task.applicant,
    tasks: task.tasks || [],
    timeline: task.timeline || [],
    metadata: task.metadata,
  }));
};

export const updateTaskStatus = async (
  userId,
  taskId,
  taskIndex,
  status,
  notes,
) => {
  const allowedStatuses = ["pending", "in_progress", "completed"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const request = await Request.findOne({
    _id: taskId,
    assignedTo: userId,
  });

  if (!request) {
    throw new Error("Task not found");
  }

  if (taskIndex !== undefined && request.tasks && request.tasks[taskIndex]) {
    request.tasks[taskIndex].status = status;
    if (status === "completed") {
      request.tasks[taskIndex].completedAt = new Date();
      request.tasks[taskIndex].notes = notes;
    }

    const allCompleted = request.tasks.every((t) => t.status === "completed");
    if (allCompleted) {
      request.status = "completed";
      request.completedAt = new Date();
      request.timeline.push({
        action: "Task completed",
        by: userId,
        details: notes || "All tasks completed",
      });
    } else if (status === "in_progress") {
      request.status = "in_progress";
    }
  } else {
    request.status = status;
    if (status === "completed") {
      request.completedAt = new Date();
    }
    request.timeline.push({
      action: `Task status updated to ${status}`,
      by: userId,
      details: notes,
    });
  }

  await request.save();

  const teamLead = await User.findById(request.assignedDirector);
  if (teamLead) {
    await Notification.create({
      user: teamLead._id,
      title: "Task Status Updated",
      message: `${userId} updated task status to ${status}${notes ? `: ${notes}` : ""}`,
      type: "info",
      relatedTo: { model: "Request", id: request._id },
      actionUrl: `/teamlead/tasks/${request._id}`,
    });
  }

  return request;
};
