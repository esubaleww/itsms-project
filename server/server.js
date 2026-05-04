import express from "express";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminReportRoutes from "./routes/admin.report.routes.js";
import adminAnnouncementRoutes from "./routes/admin.announcement.routes.js";
import directorReportRoutes from "./routes/director.report.routes.js";
import directorRoutes from "./routes/director.routes.js";
import teamLeadReportRoutes from "./routes/teamLead.report.routes.js";
import teamLeadRoutes from "./routes/teamLead.routes.js";
import publicAnnouncementRoutes from "./routes/public.announcement.routes.js";
import internRoutes from "./routes/intern.routes.js";
import innovatorRoutes from "./routes/innovator.routes.js";
import startupRoutes from "./routes/startup.routes.js";
import traineeRoutes from "./routes/trainee.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import serviceCatalogRoutes from "./routes/serviceCatalog.routes.js";
import adminAnalyticsRoutes from "./routes/admin.analytics.routes.js";
import documentRoutes from "./routes/document.routes.js";
import { handleValidationErrors } from "./middleware/validation.js";
import staffRoutes from "./routes/staff.routes.js";
import advisorRoutes from "./routes/advisor.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import trainerRoutes from "./routes/trainer.routes.js";

import helmet from "helmet";
import cors from "cors";

const app = express();
const PORT = ENV.PORT || 5000;

app.use(helmet());
app.use(handleValidationErrors);
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use("/api/auth", authRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminReportRoutes);
app.use("/api/admin", adminAnnouncementRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

app.use("/api/director", directorRoutes);
app.use("/api/director", directorReportRoutes);

app.use("/api/team-lead", teamLeadRoutes);
app.use("/api/team-lead", teamLeadReportRoutes);

app.use("/api/staff", staffRoutes);

app.use("/api/public", publicAnnouncementRoutes);

app.use("/api/staff/advisor", advisorRoutes);
app.use("/api/staff/mentor", mentorRoutes);
app.use("/api/staff/trainer", trainerRoutes);

app.use("/api/intern", internRoutes);
app.use("/api/innovator", innovatorRoutes);
app.use("/api/startup", startupRoutes);
app.use("/api/trainee", traineeRoutes);
app.use("/api/service-catalog", serviceCatalogRoutes);

app.use("/api/documents", documentRoutes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(ENV.NODE_ENV === "development" && { stack: err.stack }),
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
