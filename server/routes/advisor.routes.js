import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkStaff } from "../middleware/permission.middleware.js";
import * as advisorController from "../controllers/advisor.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkStaff);

router.get("/interns", advisorController.getMyInterns);
router.get("/interns/:internId/progress", advisorController.getInternProgress);
router.get("/interns/:internId/reports", advisorController.getInternReports);

router.put(
  "/interns/:internId/reports/:week/review",
  advisorController.reviewReport,
);
router.post(
  "/interns/:internId/summary",
  advisorController.submitAdvisorSummary,
);

router.get("/dashboard", advisorController.getAdvisorDashboard);
router.get("/stats", advisorController.getAdvisorStats);

export default router;
