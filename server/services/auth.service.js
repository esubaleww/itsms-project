import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./email.service.js";

export const registerUser = async ({ email, password, fullName }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    email,
    password,
    fullName,
    role: "user",
    isActive: true,
    emailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
  });

  await sendVerificationEmail(email, fullName, verificationToken);

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.emailVerificationToken;
  delete userResponse.emailVerificationExpires;

  return {
    success: true,
    message:
      "Registration successful! Please check your email to verify your account.",
    user: userResponse,
    token: generateToken(user),
  };
};

export const verifyEmail = async (token) => {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) throw new Error("Invalid or expired verification token");

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return {
    success: true,
    message: "Email verified successfully! You can now log in.",
  };
};

export const resendVerification = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("Email already verified");
  }
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  await sendVerificationEmail(user.email, user.fullName, verificationToken);

  return {
    success: true,
    message: "Verification email sent successfully",
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);

  if (!isMatch) throw new Error("Invalid credentials");
  if (!user.emailVerified && user.role !== "admin") {
    throw new Error("Please verify your email before logging in");
  }

  if (!user.isActive) throw new Error("Account disabled");

  user.lastLogin = new Date();
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.emailVerificationToken;
  delete userResponse.emailVerificationExpires;
  delete userResponse.passwordResetToken;
  delete userResponse.passwordResetExpires;

  return {
    success: true,
    message: "Login successful",
    user: userResponse,
    token: generateToken(user),
  };
};

export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No account found with that email");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = resetExpires;
  await user.save();

  await sendPasswordResetEmail(email, user.fullName, resetToken);

  return {
    success: true,
    message: "Password reset email sent",
  };
};

export const resetPassword = async (token, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    const anyUser = await User.findOne({ passwordResetToken: token });
    if (anyUser) {
      console.log(
        "Token exists but expired. Expiration:",
        anyUser.passwordResetExpires,
      );
      throw new Error("Reset link has expired. Please request a new one.");
    }

    throw new Error(
      "Invalid reset token. Please request a new password reset link.",
    );
  }

  user.password = newPassword || user.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return {
    success: true,
    message: "Password reset successfully",
  };
};
export const getProfile = async (userId) => {
  const user = await User.findById(userId)
    .select(
      "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires",
    )
    .populate("directorate", "name type");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    user,
  };
};

export const updateProfile = async (userId, updateData) => {
  const { fullName, phone } = updateData;

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (fullName !== undefined) user.fullName = fullName;

  await user.save();

  return {
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }
  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters");
  }

  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    throw new Error("Current password is incorrect");
  }
  if (currentPassword === newPassword) {
    throw new Error("New password must be different from current password");
  }

  user.password = newPassword;
  await user.save();

  return {
    success: true,
    message: "Password changed successfully",
  };
};
