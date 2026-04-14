import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkAdmin } from "../middleware/permission.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkAdmin);

router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.post(
  "/users/:id/resend-verification",
  adminController.resendVerification,
);

router.get("/audit-logs", adminController.getAuditLogs);

router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);

router.post("/export", adminController.exportData);

router.get("/pending-requests", adminController.getPendingRequests);
router.get("/stats", adminController.getAdminStats);
router.get("/requests/:id", adminController.getRequestById);
router.post("/requests/:id/approve", adminController.approveRequest);
router.post("/requests/:id/reject", adminController.rejectRequest);

router.post("/directorates", adminController.createDirectorate);
router.get("/directorates", adminController.getAllDirectorates);
router.get("/directorates/:id", adminController.getDirectorateById);
router.put("/directorates/:id", adminController.updateDirectorate);
router.delete("/directorates/:id", adminController.deleteDirectorate);
router.put("/directorates/:id/head", adminController.updateDirectorateHead);

router.post("/staff", adminController.createStaff);
router.get("/staff", adminController.getAllStaff);

router.put("/staff/:id", adminController.updateStaff);
router.delete("/staff/:id", adminController.deleteStaff);
router.post("/staff/:id/reset-password", adminController.resetStaffPassword);

export default router;
