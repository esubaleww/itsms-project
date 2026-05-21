/**
 * Upserts director + all staff role accounts without deleting existing users,
 * then populates dashboard data (profiles, assignments, sessions, etc.).
 *
 * Usage: node scripts/populateStaffOnExistingAccounts.js
 * Optional: node scripts/populateStaffOnExistingAccounts.js --data-only
 *   (skip user upsert; only refresh dashboard data if staff users already exist)
 */
import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import User from "../models/User.js";

const TEST_PASSWORD = "Password123!";
const DATA_ONLY = process.argv.includes("--data-only");

const staffAccounts = [
  {
    fullName: "Director User",
    email: "director@itsms.gov.et",
    role: "staff",
    position: "director",
  },
  {
    fullName: "Team Lead User",
    email: "teamlead@itsms.gov.et",
    role: "staff",
    position: "team_lead",
  },
  {
    fullName: "Staff User",
    email: "staff@itsms.gov.et",
    role: "staff",
    position: "technical_staff",
  },
  {
    fullName: "Advisor User",
    email: "advisor@itsms.gov.et",
    role: "staff",
    position: "advisor",
  },
  {
    fullName: "Trainer User",
    email: "trainer@itsms.gov.et",
    role: "staff",
    position: "trainer",
  },
  {
    fullName: "Mentor User",
    email: "mentor@itsms.gov.et",
    role: "staff",
    position: "mentor",
  },
];

const programAccounts = [
  {
    fullName: "Innovator User",
    email: "innovator@itsms.gov.et",
    role: "user",
    position: "innovator",
  },
  {
    fullName: "Innovator User 2",
    email: "innovator2@itsms.gov.et",
    role: "user",
    position: "innovator",
  },
  {
    fullName: "Intern User",
    email: "intern@itsms.gov.et",
    role: "user",
    position: "intern",
  },
  {
    fullName: "Intern User 2",
    email: "intern2@itsms.gov.et",
    role: "user",
    position: "intern",
  },
  {
    fullName: "Startup User",
    email: "startup@itsms.gov.et",
    role: "user",
    position: "startup",
  },
  {
    fullName: "Startup User 2",
    email: "startup2@itsms.gov.et",
    role: "user",
    position: "startup",
  },
  {
    fullName: "Trainee User",
    email: "trainee@itsms.gov.et",
    role: "user",
    position: "trainee",
  },
  {
    fullName: "Trainee User 2",
    email: "trainee2@itsms.gov.et",
    role: "user",
    position: "trainee",
  },
];

const upsertAccount = async (account) => {
  const existing = await User.findOne({ email: account.email });
  if (existing) {
    existing.fullName = account.fullName;
    existing.role = account.role;
    existing.position = account.position;
    existing.isActive = true;
    existing.emailVerified = true;
    await existing.save();
    console.log(`   ♻️  Updated: ${account.email} (${account.position})`);
    return existing;
  }

  const user = new User({
    ...account,
    password: TEST_PASSWORD,
    isActive: true,
    emailVerified: true,
  });
  await user.save();
  console.log(`   ✅ Created: ${account.email} (${account.position})`);
  return user;
};

const run = async () => {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    if (!DATA_ONLY) {
      console.log("👥 Upserting staff accounts (no deletes)...");
      for (const account of staffAccounts) {
        await upsertAccount(account);
      }

      console.log("\n👥 Upserting program user accounts for assignments...");
      for (const account of programAccounts) {
        await upsertAccount(account);
      }
    }

    await mongoose.disconnect();
    console.log("\n📦 Running full dashboard data population...");
    const { spawn } = await import("child_process");
    const { fileURLToPath } = await import("url");
    const { dirname, join } = await import("path");
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const seedPath = join(__dirname, "seedFullDashboard.js");

    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [seedPath], {
        stdio: "inherit",
        env: process.env,
      });
      child.on("close", (code) =>
        code === 0 ? resolve() : reject(new Error(`seedFullDashboard exited ${code}`)),
      );
    });

    console.log("\n✨ Done! Staff dashboards populated on existing accounts.");
    console.log("Password (new accounts only):", TEST_PASSWORD);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error);
    process.exit(1);
  }
};

run();
