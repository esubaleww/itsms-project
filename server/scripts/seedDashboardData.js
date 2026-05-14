import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Directorate from "../models/Directorate.js";
import ServiceCatalog from "../models/ServiceCatalog.js";
import Announcement from "../models/Announcement.js";

const seedData = async () => {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get existing users
    const admin = await User.findOne({ role: "admin" });
    const director = await User.findOne({ role: "staff", position: "director" });
    const staff = await User.findOne({ role: "staff", position: "technical_staff" });
    const innovator = await User.findOne({ email: "innovator@itsms.gov.et" });
    const intern = await User.findOne({ email: "intern@itsms.gov.et" });

    if (!admin || !director) {
      console.error("❌ Required users not found. Run seedAllRoles.js first.");
      process.exit(1);
    }

    // 1. Seed Directorates
    console.log("🏢 Seeding Directorates...");
    await Directorate.deleteMany({});
    const directorates = await Directorate.insertMany([
      { name: "Innovation & Technology", type: "innovation", head: director._id },
      { name: "ICT Infrastructure", type: "service", head: director._id },
      { name: "Human Resource Development", type: "internship", head: director._id },
      { name: "Capacity Building", type: "training", head: director._id },
      { name: "Startup Support", type: "startup", head: director._id }
    ]);

    // 2. Seed Service Catalog
    console.log("🛠️ Seeding Service Catalog...");
    await ServiceCatalog.deleteMany({});
    await ServiceCatalog.insertMany([
      {
        name: "Network Installation",
        category: "infrastructure",
        description: "LAN/WAN setup and configuration",
        icon: "Wifi",
        estimatedTime: "3-5 days",
        price: "Free",
        popular: true
      },
      {
        name: "System Development",
        category: "development",
        description: "Custom software solutions",
        icon: "Code",
        estimatedTime: "2-4 weeks",
        price: "Free",
        popular: true
      },
      {
        name: "Cloud Hosting",
        category: "infrastructure",
        description: "Secure cloud storage and hosting",
        icon: "Cloud",
        estimatedTime: "1-2 days",
        price: "Free"
      }
    ]);

    // 3. Seed Requests
    console.log("📝 Seeding Requests...");
    await Request.deleteMany({});
    
    // Some historic requests for analytics
    const statuses = ["approved", "completed", "rejected", "pending_admin"];
    const types = ["internship", "innovation", "startup", "training", "service"];
    
    for (let i = 0; i < 20; i++) {
      const type = types[i % types.length];
      const status = statuses[i % statuses.length];
      const applicant = i % 2 === 0 ? innovator._id : intern._id;
      
      const request = new Request({
        type,
        applicant,
        status,
        metadata: {
          description: `Test ${type} request ${i}`,
          priority: i % 4 === 0 ? "high" : "medium"
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
      
      if (status === "approved" || status === "completed") {
        request.adminDecision = {
          approved: true,
          date: new Date(),
          by: admin._id
        };
      }
      
      await request.save();
    }

    // 4. Seed Announcements
    console.log("📢 Seeding Announcements...");
    await Announcement.deleteMany({});
    await Announcement.insertMany([
      {
        title: "New Internship Program 2026",
        content: "Applications are now open for the summer internship program.",
        category: "program",
        priority: "high",
        author: admin._id,
        status: "published"
      },
      {
        title: "System Maintenance",
        content: "The system will be down for maintenance this Sunday.",
        category: "news",
        priority: "medium",
        author: admin._id,
        status: "published"
      }
    ]);

    console.log("\n✨ SUCCESS! Dashboard data populated.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
