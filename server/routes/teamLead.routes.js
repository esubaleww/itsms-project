import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkTeamLead } from "../middleware/permission.middleware.js";
import * as teamleadController from "../controllers/teamLead.controller.js";
import * as teamLeadAnalyticsController from "../controllers/teamLeadAnalytics.controller.js";
import * as teamLeadExportController from "../controllers/teamLeadExport.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkTeamLead);

router.get("/team", teamleadController.getMyTeam);
router.get("/members", teamleadController.getTeamMembers);

router.get("/tasks", teamleadController.getTeamTasks);
router.get("/tasks/:taskId", teamleadController.getTaskById);
router.post("/tasks/:taskId/assign", teamleadController.assignTask);
router.put(
  "/tasks/:taskId/:taskIndex/status",
  teamleadController.updateTaskStatus,
);

router.get("/progress", teamleadController.getTeamProgress);

router.post("/request-staff", teamleadController.requestStaff);

router.get("/analytics", teamLeadAnalyticsController.getAnalytics);
router.get("/analytics/weekly", teamLeadAnalyticsController.getWeeklyActivity);
router.get(
  "/analytics/performance",
  teamLeadAnalyticsController.getTeamPerformance,
);
router.get(
  "/analytics/members",
  teamLeadAnalyticsController.getMemberPerformance,
);

router.post("/export", teamLeadExportController.exportData);

export default router;
