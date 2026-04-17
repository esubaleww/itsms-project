import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const newPassword = "Admin@12345";
    S;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await User.findOneAndUpdate(
      { role: "admin" },
      { $set: { password: hashedPassword } },
      { new: true },
    );

    if (result) {
      console.log("✅ Admin password reset successfully!");
      console.log("Email:", result.email);
      console.log("New password:", newPassword);
    } else {
      console.log("❌ Admin user not found");
    }

    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetAdminPassword();
