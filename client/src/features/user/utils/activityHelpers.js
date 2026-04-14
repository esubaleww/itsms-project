export const getRecentActivities = (notifications) => {
  if (!notifications || notifications.length === 0) return [];

  return notifications.slice(0, 5).map((notif) => ({
    type:
      notif.type === "success"
        ? "approval"
        : notif.type === "submission"
          ? "submission"
          : notif.type === "assignment"
            ? "assignment"
            : notif.type === "report"
              ? "report"
              : notif.type === "milestone"
                ? "milestone"
                : notif.type === "session"
                  ? "session"
                  : "update",
    category: notif.category || "user",
    title: notif.title,
    message: notif.message,
    details: notif.details,
    time: new Date(notif.createdAt).toLocaleDateString(),
    createdAt: notif.createdAt,
  }));
};
