import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as internController from "../controllers/intern.controller.js";

const router = express.Router();

router.use(protect);

router.get("/reports", internController.getMyWeeklyReports);
router.post("/reports", internController.submitWeeklyReport);
router.get("/reports/:week", internController.getReportByWeek);
router.put("/reports/:week", internController.updateReport);

router.get("/profile", internController.getMyInternProfile);
router.get("/progress", internController.getMyProgress);
router.get("/advisor", internController.getMyAdvisor);

router.get("/dashboard", internController.getInternDashboard);

export default router;
