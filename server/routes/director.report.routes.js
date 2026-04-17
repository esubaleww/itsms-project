import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkDirector } from "../middleware/permission.middleware.js";
import * as directorReportController from "../controllers/director.report.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkDirector);

router.get("/team-reports", directorReportController.getTeamReports);
router.get("/team-reports/:reportId", directorReportController.getReportById);
router.put(
  "/team-reports/:reportId/review",
  directorReportController.reviewTeamReport,
);
router.put(
  "/team-reports/:reportId/approve",
  directorReportController.approveTeamReport,
);

router.post("/my-reports", directorReportController.createDirectorReport);
router.get("/my-reports", directorReportController.getMyDirectorReports);
router.put(
  "/team-reports/:reportId/reject",
  directorReportController.rejectTeamReport,
);

export default router;
