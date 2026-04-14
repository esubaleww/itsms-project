// backend/controllers/staff.controller.js
import * as staffService from "../services/staff.service.js";

export const getStaffStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await staffService.getStaffStats(userId);
    res.json(stats);
  } catch (error) {
    console.error("Get staff stats error:", error);
    res.status(500).json({ message: error.message || "Failed to get stats" });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await staffService.getMyTasks(userId);
    res.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: error.message || "Failed to get tasks" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { taskIndex, status, notes } = req.body;

    const task = await staffService.updateTaskStatus(
      userId,
      taskId,
      taskIndex,
      status,
      notes,
    );

    res.json({
      success: true,
      message: "Task status updated",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: error.message || "Failed to update task" });
  }
};
