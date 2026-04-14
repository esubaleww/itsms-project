import AuditLog from "../models/AuditLog.js";

export const logAction = async ({
  user,
  action,
  entity,
  entityId,
  request,
  metadata,
  req,
}) => {
  try {
    await AuditLog.create({
      user: user?._id,
      role: user?.role,
      action,
      entity,
      entityId,
      request,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers["user-agent"],
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
};
