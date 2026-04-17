import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as startupController from "../controllers/startup.controller.js";

const router = express.Router();

router.use(protect);

router.get("/milestones", startupController.getMyMilestones);
router.put(
  "/milestones/:milestoneId/status",
  startupController.updateMilestoneStatus,
);

router.get("/profile", startupController.getMyStartupProfile);
router.get("/progress", startupController.getMyProgress);
router.get("/mentor", startupController.getMyMentor);

router.get("/founders", startupController.getMyStartupProfile);
router.put("/founders", startupController.updateFounders);
router.post("/founders", startupController.addFounder);
router.delete("/founders/:founderId", startupController.removeFounder);

router.get("/documents", startupController.getMyDocuments);

router.get("/dashboard", startupController.getStartupDashboard);

export default router;
