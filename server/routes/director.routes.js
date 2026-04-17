import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkDirector } from "../middleware/permission.middleware.js";
import * as directorController from "../controllers/director.controller.js";
import * as directorInternController from "../controllers/director.intern.controller.js";
import * as directorAnalyticsController from "../controllers/directorAnalytics.controller.js";
import * as directorExportController from "../controllers/directorExport.controller.js";
import * as directorInnovatorController from "../controllers/director.innovator.controller.js";
import * as directorStartupController from "../controllers/director.startup.controller.js";
import * as directorTraineeController from "../controllers/director.trainee.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkDirector);

router.get("/stats", directorController.getDirectorStats);

router.get("/requests", directorController.getAssignedRequests);
router.get("/requests/:id", directorController.getRequestById);
router.post("/requests/:id/assign-team", directorController.assignToTeam);

router.post("/teams", directorController.createTeam);
router.get("/teams", directorController.getTeams);
router.get("/teams/:teamId", directorController.getTeamById);
router.put("/teams/:teamId", directorController.updateTeam);
router.delete("/teams/:teamId", directorController.deleteTeam);

router.post("/teams/:teamId/lead", directorController.assignTeamLead);
router.post("/teams/:teamId/members", directorController.assignToTeamMember);
router.delete(
  "/teams/:teamId/members/:staffId",
  directorController.removeFromTeam,
);
router.get("/staff/available", directorController.getAvailableStaff);

router.post(
  "/interns/:internId/assign-advisor",
  directorInternController.assignAdvisor,
);
router.get("/interns", directorInternController.getInternSummaries);
router.get(
  "/interns/:internId/progress",
  directorInternController.getInternProgress,
);
router.patch(
  "/interns/:internId/status",
  directorInternController.updateInternStatus,
);

router.get("/innovators", directorInnovatorController.getInnovatorSummaries);
router.post(
  "/innovators/:innovatorId/mentor",
  directorInnovatorController.assignMentor,
);
router.get(
  "/innovators/:innovatorId/progress",
  directorInnovatorController.getInnovatorProgress,
);
router.delete(
  "/innovators/:innovatorId/mentor",
  directorInnovatorController.removeInnovatorMentor,
);
router.patch(
  "/innovators/:innovatorId/status",
  directorInnovatorController.updateInnovatorStatus,
);
router.get(
  "/innovators/:innovatorId/progress",
  directorInnovatorController.getInnovatorProgress,
);

router.get("/startups", directorStartupController.getStartupSummaries);
router.get(
  "/startups/:startupId/progress",
  directorStartupController.getStartupProgress,
);
router.post(
  "/startups/:startupId/mentor",
  directorStartupController.assignStartupMentor,
);
router.delete(
  "/startups/:startupId/mentor",
  directorStartupController.removeStartupMentor,
);
router.patch(
  "/startups/:startupId/status",
  directorStartupController.updateStartupStatus,
);

router.get("/trainees", directorTraineeController.getTraineeSummaries);
router.get(
  "/trainees/:traineeId/progress",
  directorTraineeController.getTraineeProgress,
);
router.get(
  "/trainees/:traineeId/sessions",
  directorTraineeController.getTraineeSessions,
);
router.post(
  "/trainees/:traineeId/trainer",
  directorTraineeController.assignTrainer,
);
router.delete(
  "/trainees/:traineeId/trainer",
  directorTraineeController.removeTrainer,
);
router.patch(
  "/trainees/:traineeId/status",
  directorTraineeController.updateTraineeStatus,
);

router.get("/analytics", directorAnalyticsController.getAnalytics);
router.get("/analytics/weekly", directorAnalyticsController.getWeeklyActivity);
router.get(
  "/analytics/request-distribution",
  directorAnalyticsController.getRequestDistribution,
);
router.get(
  "/analytics/status-distribution",
  directorAnalyticsController.getStatusDistribution,
);
router.get("/analytics/teams", directorAnalyticsController.getTeamPerformance);
router.get("/analytics/interns", directorAnalyticsController.getInternProgress);
router.get(
  "/analytics/innovators",
  directorAnalyticsController.getInnovatorProgress,
);
router.get(
  "/analytics/startups",
  directorAnalyticsController.getStartupProgress,
);

router.post("/export", directorExportController.exportData);
export default router;
