import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import User from "../models/User.js";

const TEST_PASSWORD = "Password123!";

const usersToSeed = [
  {
    fullName: "System Administrator",
    email: "admin@itsms.gov.et",
    role: "admin",
    position: "hr_officer",
    isActive: true,
    emailVerified: true
  },
  {
    fullName: "Director User",
    email: "director@itsms.gov.et",
    role: "staff",
    position: "director",
    isActive: true,
    emailVerified: true
  },
  {
    fullName: "Team Lead User",
    email: "teamlead@itsms.gov.et",
    role: "staff",
    position: "team_lead",
    isActive: true,
    emailVerified: true
  },
  {
    fullName: "Staff User",
    email: "staff@itsms.gov.et",
    role: "staff",
    position: "technical_staff",
    isActive: true,
    emailVerified: true
  },
  {
    fullName: "Innovator User",
    email: "innovator@itsms.gov.et",
    role: "user",
    position: "innovator",
    isActive: true,
    emailVerified: true
  },
  {
    fullName: "Intern User",
    email: "intern@itsms.gov.et",
    role: "user",
    position: "intern",
    isActive: true,
    emailVerified: true
  },
  {
    fullName: "Startup User",
    email: "startup@itsms.gov.et",
    role: "user",
    position: "startup",
    isActive: true,
    emailVerified: true
  },
  {
    fullName: "Trainee User",
    email: "trainee@itsms.gov.et",
    role: "user",
    position: "trainee",
    isActive: true,
    emailVerified: true
  }
];

const seedUsers = async () => {
  try {
    console.log("🔌 Connecting to database...");
    console.log("URI:", ENV.MONGO_URI);
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clean up old gov.et accounts to ensure fresh start
    console.log("🧹 Cleaning up existing test accounts...");
    await User.deleteMany({ email: { $regex: /@itsms\.gov\.et$/ } });

    for (const userData of usersToSeed) {
      console.log(`👤 Creating user: ${userData.email}...`);
      const user = new User({
        ...userData,
        password: TEST_PASSWORD
      });
      await user.save();
      console.log(`   ✅ Created ${userData.fullName}`);
    }

    console.log("\n✨ SUCCESS! All roles seeded.");
    console.log("-----------------------------------");
    console.log("Credentials for all accounts:");
    console.log("Password: " + TEST_PASSWORD);
    console.log("-----------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();
