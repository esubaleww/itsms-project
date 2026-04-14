import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "ITSMS" },
    siteEmail: { type: String, default: "" },
    maxFileSize: { type: Number, default: 10 },
    allowedFileTypes: { type: String, default: ".pdf,.doc,.docx,.jpg,.png" },
    sessionTimeout: { type: Number, default: 60 },
    enableEmailVerification: { type: Boolean, default: true },
    enableNotifications: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "" },
  },
  { timestamps: true },
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
