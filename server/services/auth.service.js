import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async ({ email, password, fullName }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const user = await User.create({
    email,
    password,
    fullName,
  });

  return {
    user,
    token: generateToken(user),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isActive) throw new Error("Account disabled");

  user.lastLogin = new Date();
  await user.save();

  return {
    user,
    token: generateToken(user),
  };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  const profile = await user.getProfile();

  return {
    success: true,
    user: {
      ...user.toObject(),
      profile,
    },
  };
};

export const updateProfile = async (userId, updateData) => {
  const { fullName, phone, demographic } = updateData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;
  if (demographic) {
    user.demographic = { ...user.demographic, ...demographic };
  }

  await user.save();

  const profile = await user.getProfile();

  return {
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      profile,
    },
  };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return {
    success: true,
    message: "Password changed successfully",
  };
};
