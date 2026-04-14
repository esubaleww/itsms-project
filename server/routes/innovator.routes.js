import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as innovatorController from "../controllers/innovator.controller.js";

const router = express.Router();

router.use(protect);

router.get("/milestones", innovatorController.getMyMilestones);
router.put(
  "/milestones/:milestoneId/status",
  innovatorController.updateMilestoneStatus,
);

router.get("/profile", innovatorController.getMyInnovatorProfile);
router.get("/progress", innovatorController.getMyProgress);
router.get("/mentor", innovatorController.getMyMentor);

router.get("/documents", innovatorController.getMyDocuments);

router.get("/dashboard", innovatorController.getInnovatorDashboard);

export default router;
