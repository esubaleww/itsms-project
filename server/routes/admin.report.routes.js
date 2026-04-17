import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkAdmin } from "../middleware/permission.middleware.js";
import * as adminReportController from "../controllers/admin.report.controller.js";
const router = express.Router();

router.use(protect);
router.use(checkAdmin);

router.get("/director-reports", adminReportController.getDirectorReports);

router.get(
  "/director-reports/:id",
  adminReportController.getDirectorReportById,
);
router.put(
  "/director-reports/:id/review",
  adminReportController.reviewDirectorReport,
);
router.put(
  "/director-reports/:id/approve",
  adminReportController.approveDirectorReport,
);
router.put(
  "/director-reports/:id/reject",
  adminReportController.rejectDirectorReport,
);
export default router;
