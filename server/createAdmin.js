import mongoose from "mongoose";

import User from "./models/User.js";
import { ENV } from "./config/env.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);

    const existing = await User.findOne({ email: "admin@itsms.gov.et" });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = await User.create({
      email: "admin@itsms.gov.et",
      password: "Admin@123",
      fullName: "System Administrator",
      role: "admin",
      isActive: true,

      emailVerified: true,
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
