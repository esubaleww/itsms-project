import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkStaff } from "../middleware/permission.middleware.js";
import * as mentorController from "../controllers/mentor.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkStaff);

router.get("/innovators", (req, res) =>
  mentorController.getMyMentees(req, res, "innovator"),
);
router.get("/innovators/:menteeId/progress", (req, res) =>
  mentorController.getMenteeProgress(req, res, "innovator"),
);
router.post("/innovators/:menteeId/milestones", (req, res) =>
  mentorController.addMilestone(req, res, "innovator"),
);
router.put("/innovators/:menteeId/milestones/:milestoneId/review", (req, res) =>
  mentorController.reviewMilestone(req, res, "innovator"),
);

router.get("/startups", (req, res) =>
  mentorController.getMyMentees(req, res, "startup"),
);
router.get("/startups/:menteeId/progress", (req, res) =>
  mentorController.getMenteeProgress(req, res, "startup"),
);
router.post("/startups/:menteeId/milestones", (req, res) =>
  mentorController.addMilestone(req, res, "startup"),
);
router.put("/startups/:menteeId/milestones/:milestoneId/review", (req, res) =>
  mentorController.reviewMilestone(req, res, "startup"),
);
router.post(
  "/mentees/:menteeId/:type/summary",
  mentorController.submitMentorSummary,
);

router.get("/dashboard", mentorController.getMentorDashboard);
router.get("/stats", mentorController.getMentorStats);

export default router;
