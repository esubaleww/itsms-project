import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  role: String,

  action: {
    type: String,
    required: true,
    enum: [
      "CREATE",
      "UPDATE",
      "DELETE",
      "LOGIN",
      "LOGOUT",
      "APPROVE",
      "REJECT",
      "ASSIGN",
      "ROUTE",
      "COMPLETE",
      "REVIEW",
    ],
  },

  entity: {
    type: String,
    required: true,
  },

  entityId: mongoose.Schema.Types.ObjectId,

  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
  },

  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,

  metadata: mongoose.Schema.Types.Mixed,

  ipAddress: String,
  userAgent: String,

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ request: 1 });

export default mongoose.model("AuditLog", auditLogSchema);
