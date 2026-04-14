import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkStaff } from "../middleware/permission.middleware.js";
import * as trainerController from "../controllers/trainer.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkStaff);

router.get("/trainees", trainerController.getMyTrainees);
router.get(
  "/trainees/:traineeId/progress",
  trainerController.getTraineeProgress,
);

router.post("/trainees/:traineeId/sessions", trainerController.createSession);
router.post(
  "/sessions/:sessionId/attendance",
  trainerController.recordAttendance,
);
router.post(
  "/trainees/:traineeId/sessions/:sessionId/certificate",
  trainerController.generateCertificate,
);
router.post(
  "/trainees/:traineeId/summary",
  trainerController.submitTrainerSummary,
);

router.patch(
  "/trainees/:traineeId/status",
  trainerController.updateTraineeStatus,
);

router.get("/dashboard", trainerController.getTrainerDashboard);
router.get("/stats", trainerController.getTrainerStats);

export default router;
