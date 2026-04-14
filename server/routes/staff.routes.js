// backend/routes/staff.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkStaff } from "../middleware/permission.middleware.js";
import * as staffController from "../controllers/staff.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkStaff);

router.get("/stats", staffController.getStaffStats);
router.get("/tasks", staffController.getMyTasks);
router.patch("/tasks/:taskId/status", staffController.updateTaskStatus);

export default router;
