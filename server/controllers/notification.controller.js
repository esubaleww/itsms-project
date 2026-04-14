// server/controllers/notification.controller.js
import * as notificationService from "../services/notification.service.js";

export const getMyNotifications = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const result = await notificationService.getUserNotifications(
      req.user.id,
      parseInt(limit),
      parseInt(page),
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.id,
    );
    res.json({ success: true, notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
