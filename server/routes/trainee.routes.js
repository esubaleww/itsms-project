import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as traineeController from "../controllers/trainee.controller.js";

const router = express.Router();

router.use(protect);

router.get("/sessions", traineeController.getMySessions);
router.post(
  "/sessions/:sessionId/attendance",
  traineeController.markAttendance,
);

router.get("/profile", traineeController.getMyTraineeProfile);
router.get("/progress", traineeController.getMyProgress);
router.get("/trainer", traineeController.getMyTrainer);

router.get("/dashboard", traineeController.getTraineeDashboard);

export default router;
