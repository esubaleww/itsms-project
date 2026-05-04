import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkAdmin } from "../middleware/permission.middleware.js";
import * as analyticsController from "../controllers/admin.analaytics.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkAdmin);

router.get("/", analyticsController.getAnalytics);
router.get("/daily-activity", analyticsController.getDailyActivity);
router.get("/request-distribution", analyticsController.getRequestDistribution);
router.get("/status-distribution", analyticsController.getStatusDistribution);
router.get("/user-stats", analyticsController.getUserStats);
router.get("/request-stats", analyticsController.getRequestStats);
router.get("/program-stats", analyticsController.getProgramStats);
router.get("/performance-metrics", analyticsController.getPerformanceMetrics);

export default router;
