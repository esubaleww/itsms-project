// server/routes/notification.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as notificationController from "../controllers/notification.controller.js";

const router = express.Router();

router.use(protect);

router.get("/my", notificationController.getMyNotifications);
router.put("/:id/read", notificationController.markAsRead);
router.put("/read-all", notificationController.markAllAsRead);

export default router;
