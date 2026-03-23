import * as authService from "../services/auth.service.js";
import { logAction } from "../utils/auditLogger.js";

export const register = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);

    await logAction({
      user: data.user,
      action: "CREATE",
      entity: "User",
      entityId: data.user._id,
      req,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);

    await logAction({
      user: data.user,
      action: "LOGIN",
      entity: "User",
      entityId: data.user._id,
      req,
    });

    res.json(data);
  } catch (err) {
    await logAction({
      action: "LOGIN",
      entity: "User",
      metadata: {
        email: req.body.email,
        success: false,
        reason: err.message,
      },
      req,
    });

    res.status(400).json({
      message: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Change password error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  await logAction({
    user: req.user,
    action: "LOGOUT",
    entity: "User",
    entityId: req.user._id,
    req,
  });

  res.json({ message: "Logged out" });
};
