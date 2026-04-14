import * as authService from "../services/auth.service.js";
import { logAction } from "../utils/auditLogger.js";

export const register = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);

    await logAction({
      user: data.user,
      action: "CREATE",
      entity: "User",
      entityId: data.user.id,
      req,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    res.json({
      success: true,
      message:
        result.message || "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Invalid or expired verification token",
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const result = await authService.resendVerification(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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
      entityId: data.user.id,
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

    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword({ email });
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await authService.resetPassword(token, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user._id);
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

  res.json({ success: true, message: "Logged out successfully" });
};
