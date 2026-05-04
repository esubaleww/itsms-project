import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkStaff } from "../middleware/permission.middleware.js";
import * as staffController from "../controllers/staff.controller.js";
import StaffProfile from "../models/StaffProfile.js";
import User from "../models/User.js";

const router = express.Router();

router.use(protect);
router.use(checkStaff);

router.get("/stats", staffController.getStaffStats);
router.get("/tasks", staffController.getMyTasks);
router.patch("/tasks/:taskId/status", staffController.updateTaskStatus);
router.get("/profile", async (req, res) => {
  try {
    const staffProfile = await StaffProfile.findOne({ user: req.user.id })
      .populate("user", "fullName email phone position directorate team")
      .populate("directorate", "name type")
      .populate("team", "name");

    if (!staffProfile) {
      const user = await User.findById(req.user.id).select(
        "fullName email phone position directorate team",
      );
      return res.json({
        success: true,
        profile: {
          user,
          employeeId: null,
          directorate: user?.directorate,
          team: user?.team,
          isActive: true,
        },
      });
    }

    res.json({
      success: true,
      profile: staffProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
