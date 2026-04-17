import Notification from "../models/Notification.js";

export const createNotification = async (data) => {
  return await Notification.create(data);
};

export const getUserNotifications = async (userId, limit = 20, page = 1) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ user: userId }),
  ]);

  const unreadCount = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  return {
    success: true,
    notifications,
    unreadCount,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { returnDocument: "after" },
  );
  if (!notification) throw new Error("Notification not found");
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() },
  );
  return { success: true };
};
