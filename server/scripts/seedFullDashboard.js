import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Directorate from "../models/Directorate.js";
import ServiceCatalog from "../models/ServiceCatalog.js";
import Announcement from "../models/Announcement.js";
import Team from "../models/Team.js";
import Report from "../models/Report.js";
import StaffProfile from "../models/StaffProfile.js";
import InternProfile from "../models/InternProfile.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import TrainingProfile from "../models/TrainingProfile.js";
import AuditLog from "../models/AuditLog.js";
import Session from "../models/Session.js";

const seedFullData = async () => {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Get Core Users
    const admin = await User.findOne({ email: "admin@itsms.gov.et" });
    const director = await User.findOne({ email: "director@itsms.gov.et" });
    const teamlead = await User.findOne({ email: "teamlead@itsms.gov.et" });
    const staff = await User.findOne({ email: "staff@itsms.gov.et" });
    const advisor = await User.findOne({ email: "advisor@itsms.gov.et" });
    const trainer = await User.findOne({ email: "trainer@itsms.gov.et" });
    const mentor = await User.findOne({ email: "mentor@itsms.gov.et" });
    
    // Mentees/Trainees/Interns
    const innovator = await User.findOne({ email: "innovator@itsms.gov.et" });
    const innovator2 = await User.findOne({ email: "innovator2@itsms.gov.et" });
    const intern = await User.findOne({ email: "intern@itsms.gov.et" });
    const intern2 = await User.findOne({ email: "intern2@itsms.gov.et" });
    const startup = await User.findOne({ email: "startup@itsms.gov.et" });
    const startup2 = await User.findOne({ email: "startup2@itsms.gov.et" });
    const trainee = await User.findOne({ email: "trainee@itsms.gov.et" });
    const trainee2 = await User.findOne({ email: "trainee2@itsms.gov.et" });

    if (!admin || !director || !teamlead || !staff || !advisor || !trainer || !mentor) {
      console.error("❌ Required users not found. Run seedAllRoles.js first.");
      process.exit(1);
    }

    // 2. Clear Existing Data (Except Users)
    console.log("🧹 Cleaning up old data...");
    await Promise.all([
      Directorate.deleteMany({}),
      ServiceCatalog.deleteMany({}),
      Request.deleteMany({}),
      Announcement.deleteMany({}),
      Team.deleteMany({}),
      Report.deleteMany({}),
      StaffProfile.deleteMany({}),
      InternProfile.deleteMany({}),
      InnovatorProfile.deleteMany({}),
      StartupProfile.deleteMany({}),
      TrainingProfile.deleteMany({}),
      AuditLog.deleteMany({}),
      Session.deleteMany({}),
    ]);

    // 3. Seed Directorates
    console.log("🏢 Seeding Directorates...");
    const directorates = await Directorate.insertMany([
      { name: "ICT Infrastructure", type: "service", head: director._id },
      { name: "Innovation Center", type: "innovation", head: director._id },
      { name: "HR & Internship", type: "internship", head: director._id },
      { name: "Capacity Building", type: "training", head: director._id },
      { name: "Startup Hub", type: "startup", head: director._id }
    ]);
    const serviceDir = directorates[0];
    const innovDir = directorates[1];
    const internDir = directorates[2];
    const trainingDir = directorates[3];
    const startupDir = directorates[4];

    // 4. Seed Staff Profiles
    console.log("👤 Seeding Staff Profiles...");
    await StaffProfile.insertMany([
      { user: director._id, directorate: serviceDir._id, employeeId: "DIR001" },
      { user: teamlead._id, directorate: serviceDir._id, employeeId: "TL001" },
      { user: staff._id, directorate: serviceDir._id, employeeId: "ST001" },
      { user: advisor._id, directorate: internDir._id, employeeId: "ADV001" },
      { user: trainer._id, directorate: trainingDir._id, employeeId: "TRN001" },
      { user: mentor._id, directorate: innovDir._id, employeeId: "MNT001" }
    ]);

    // 5. Seed Teams
    console.log("👥 Seeding Teams...");
    const team = await Team.create({
      name: "Network Support Alpha",
      directorate: serviceDir._id,
      lead: teamlead._id,
      members: [staff._id],
      description: "Handles campus-wide network infrastructure."
    });

    // 6. Seed Service Catalog
    console.log("🛠️ Seeding Service Catalog...");
    const dummyDoc = { url: "http://example.com/doc.pdf", name: "template.pdf", size: 1024, mimeType: "application/pdf" };
    await ServiceCatalog.insertMany([
      { name: "Network Installation", category: "infrastructure", description: "LAN/WAN setup", icon: "Wifi", estimatedTime: "3 days", popular: true, documents: { requestLetter: dummyDoc } },
      { name: "Software License", category: "development", description: "Official software keys", icon: "Code", estimatedTime: "1 day", popular: true, documents: { requestLetter: dummyDoc } },
      { name: "Cloud Storage", category: "infrastructure", description: "Secure storage", icon: "Cloud", estimatedTime: "2 hours", documents: { requestLetter: dummyDoc } }
    ]);

    // 7. Seed Requests
    console.log("📝 Seeding Requests...");
    const requestTypes = ["service", "innovation", "internship", "startup", "training"];
    for (const type of requestTypes) {
      const request = new Request({
        applicant: innovator._id,
        type: type,
        status: "pending_admin",
        timeline: [{ 
          action: "Application submitted", 
          by: innovator._id, 
          date: new Date(), 
          details: "Initial submission" 
        }],
        metadata: {
          serviceType: "General",
          description: "Need immediate assistance.",
          priority: "medium"
        }
      });
      await request.save();
    }

    // 8. Seed Intern Profiles (For Advisor)
    console.log("🎓 Seeding Interns for Advisor...");
    await InternProfile.insertMany([
      {
        user: intern._id,
        phone: "+251911223344",
        university: { name: "Addis Ababa University", studentId: "ATR/1234/12", department: "Computer Science", year: "5th" },
        documents: { 
          applicationLetter: { url: "http://example.com/letter.pdf", name: "letter.pdf" },
          cv: { url: "http://example.com/cv.pdf", name: "cv.pdf" }
        },
        status: "active",
        placement: { directorate: internDir._id, team: team._id, advisor: advisor._id, startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        reports: [
          { week: 1, content: "First week progress.", status: "advisor_reviewed", advisorRating: 5, submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
          { week: 2, content: "Second week progress.", status: "submitted", submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        user: intern2._id,
        phone: "+251922334455",
        university: { name: "Bahir Dar University", studentId: "ATR/5678/12", department: "IT", year: "4th" },
        documents: { 
          applicationLetter: { url: "http://example.com/letter2.pdf", name: "letter2.pdf" },
          cv: { url: "http://example.com/cv2.pdf", name: "cv2.pdf" }
        },
        status: "active",
        placement: { directorate: internDir._id, advisor: advisor._id, startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        reports: [{ week: 1, content: "Just started.", status: "submitted", submittedAt: new Date() }]
      }
    ]);

    // 9. Seed Innovators (For Mentor)
    console.log("💡 Seeding Innovators for Mentor...");
    await InnovatorProfile.insertMany([
      {
        user: innovator._id,
        phone: "+251933445566",
        institution: "AAiT",
        ideaTitle: "Smart Farm",
        ideaDescription: "IoT for farms",
        documents: { businessPlan: { url: "http://example.com/plan.pdf", name: "plan.pdf" } },
        status: "incubating",
        incubation: {
          center: innovDir._id,
          mentor: mentor._id,
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          milestones: [
            { title: "Design", status: "completed", completedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), feedback: "Good", feedbackBy: mentor._id },
            { title: "Prototype", status: "in_progress", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }
          ]
        }
      },
      {
        user: innovator2._id,
        phone: "+251944556677",
        institution: "HiLCoE",
        ideaTitle: "Solar Car",
        ideaDescription: "Eco car",
        documents: { businessPlan: { url: "http://example.com/plan2.pdf", name: "plan2.pdf" } },
        status: "incubating",
        incubation: {
          center: innovDir._id,
          mentor: mentor._id,
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          milestones: [{ title: "Concept", status: "pending", dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) }]
        }
      }
    ]);

    // 10. Seed Startups (For Mentor)
    console.log("🚀 Seeding Startups for Mentor...");
    await StartupProfile.insertMany([
      {
        user: startup._id,
        companyName: "TechOne",
        registrationNumber: "ET/ST/001",
        sector: "Education",
        status: "incubating",
        documents: { businessLicense: { url: "http://example.com/license.pdf", name: "license.pdf" } },
        incubation: { center: innovDir._id, mentor: mentor._id, startDate: new Date() },
        founders: [{ name: "Startup User", email: "startup@itsms.gov.et", role: "CEO" }]
      },
      {
        user: startup2._id,
        companyName: "EcoBuild",
        registrationNumber: "ET/ST/002",
        sector: "Construction",
        status: "incubating",
        documents: { businessLicense: { url: "http://example.com/license2.pdf", name: "license2.pdf" } },
        incubation: { center: innovDir._id, mentor: mentor._id, startDate: new Date() },
        founders: [{ name: "Startup User 2", email: "startup2@itsms.gov.et", role: "Founder" }]
      }
    ]);

    // 11. Seed Trainees & Sessions (For Trainer)
    console.log("📚 Seeding Training Data for Trainer...");
    const tProfiles = await TrainingProfile.insertMany([
      {
        user: trainee._id,
        phone: "+251955667788",
        institution: "AAU",
        profession: "Engineer",
        documents: { applicationLetter: { url: "http://example.com/letter.pdf", name: "letter.pdf" } },
        status: "active",
        placement: { directorate: trainingDir._id, trainer: trainer._id }
      },
      {
        user: trainee2._id,
        phone: "+251966778899",
        institution: "ASTU",
        profession: "Developer",
        documents: { applicationLetter: { url: "http://example.com/letter2.pdf", name: "letter2.pdf" } },
        status: "active",
        placement: { directorate: trainingDir._id, trainer: trainer._id }
      }
    ]);

    const sessions = await Session.insertMany([
      { title: "React Basics", trainer: trainer._id, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), duration: 2, status: "completed" },
      { title: "Node.js Basics", trainer: trainer._id, date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), duration: 2, status: "scheduled" }
    ]);

    // Update attendance link
    for (const p of tProfiles) {
      p.attendance = [{ session: sessions[0]._id, attended: true, attendedAt: new Date() }];
      await p.save();
    }

    console.log("\n✨ SUCCESS! Specialized staff dashboards are now fully populated.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedFullData();
