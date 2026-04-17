import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkTeamLead } from "../middleware/permission.middleware.js";
import * as teamleadReportController from "../controllers/teamLead.report.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkTeamLead);

router.get("/reports", teamleadReportController.getMyTeamReports);
router.post("/reports", teamleadReportController.submitTeamReport);
router.get("/reports/my", teamleadReportController.getMyReports);
router.get("/reports/:id", teamleadReportController.getReportById);

export default router;
