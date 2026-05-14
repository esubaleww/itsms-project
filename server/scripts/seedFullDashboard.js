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
    const innovator = await User.findOne({ email: "innovator@itsms.gov.et" });
    const intern = await User.findOne({ email: "intern@itsms.gov.et" });
    const startup = await User.findOne({ email: "startup@itsms.gov.et" });
    const trainee = await User.findOne({ email: "trainee@itsms.gov.et" });

    if (!admin || !director || !teamlead || !staff) {
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

    // 4. Seed Staff Profiles
    console.log("👤 Seeding Staff Profiles...");
    await StaffProfile.insertMany([
      { user: director._id, directorate: serviceDir._id, employeeId: "DIR001" },
      { user: teamlead._id, directorate: serviceDir._id, employeeId: "TL001" },
      { user: staff._id, directorate: serviceDir._id, employeeId: "ST001" }
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

    // 7. Seed Requests (All types and statuses)
    console.log("📝 Seeding Requests...");
    const requestTypes = ["service", "innovation", "internship", "startup", "training"];
    const requestStatuses = ["pending_admin", "approved", "assigned_to_team", "in_progress", "completed", "rejected"];
    
    for (const type of requestTypes) {
      for (const status of requestStatuses) {
        const applicant = type === "service" ? innovator._id : (type === "internship" ? intern._id : (type === "startup" ? startup._id : trainee._id));
        const request = await Request.create({
          type,
          applicant,
          status,
          metadata: { description: `Sample ${type} request with status ${status}`, priority: "medium" },
          assignedTeam: status === "assigned_to_team" || status === "in_progress" || status === "completed" ? team._id : null,
          createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
        });

        // Add timeline for better visual in history
        request.timeline.push({
          action: "Application submitted",
          by: applicant,
          date: new Date(request.createdAt),
          details: "Initial submission"
        });
        if (status !== "pending_admin") {
          request.timeline.push({
            action: "Admin decision",
            by: admin._id,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            details: "Approved for further processing"
          });
        }
        await request.save();
      }
    }

    // 8. Seed Intern Profile & Reports
    console.log("🎓 Seeding Intern Data...");
    await InternProfile.create({
      user: intern._id,
      phone: "+251911223344",
      university: { name: "Addis Ababa University", studentId: "ATR/1234/12", department: "Computer Science", year: "5th" },
      documents: { 
        applicationLetter: { url: "http://example.com/letter.pdf", name: "letter.pdf" }, 
        cv: { url: "http://example.com/cv.pdf", name: "cv.pdf" } 
      },
      status: "active",
      placement: { 
        directorate: internDir._id, 
        team: team._id,
        advisor: staff._id, 
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      reports: [
        { week: 1, content: "Orientation and network setup.", learnings: "Corporate network standards", status: "advisor_reviewed", advisorFeedback: "Great start!", advisorRating: 5, submittedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
        { week: 2, content: "Learned about server maintenance.", learnings: "Nginx config", status: "advisor_reviewed", advisorFeedback: "Good progress.", advisorRating: 4, submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        { week: 3, content: "Worked on database optimization.", learnings: "Indexing", status: "submitted", submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { week: 4, content: "Assisting with system deployment.", learnings: "CI/CD pipelines", status: "submitted" }
      ]
    });

    // 9. Seed Innovator Profile & Milestones
    console.log("💡 Seeding Innovator Data...");
    await InnovatorProfile.create({
      user: innovator._id,
      phone: "+251922334455",
      institution: "AAiT",
      ideaTitle: "Smart Agriculture IoT",
      ideaDescription: "Automated irrigation system using sensors and mobile app.",
      documents: { businessPlan: { url: "http://example.com/plan.pdf", name: "plan.pdf" } },
      status: "incubating",
      incubation: {
        center: innovDir._id,
        mentor: staff._id,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        milestones: [
          { title: "Hardware Selection", status: "completed", completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), feedback: "Well researched.", feedbackBy: staff._id },
          { title: "Hardware Prototype", status: "completed", completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), feedback: "Impressive work.", feedbackBy: staff._id },
          { title: "Mobile App Beta", status: "in_progress", dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
          { title: "Pilot Testing", status: "pending", dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) }
        ]
      }
    });

    // 10. Seed Startup Profile
    console.log("🚀 Seeding Startup Data...");
    await StartupProfile.create({
      user: startup._id,
      companyName: "EthioTech Solutions",
      industry: "Fintech",
      registrationNumber: "ET-123456",
      sector: "Financial Technology",
      description: "Digital payment solutions for local markets.",
      status: "incubating",
      documents: { businessLicense: { url: "http://example.com/license.pdf", name: "license.pdf" } },
      founders: [{ name: "Startup User", role: "CEO", email: "startup@itsms.gov.et", phone: "+251999887766" }],
      incubation: { 
        center: serviceDir._id, 
        mentor: teamlead._id,
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        stage: "mvp",
        milestones: [
          { title: "Product Concept", status: "completed", completedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), feedback: "Solid concept." },
          { title: "Initial Funding", status: "completed", completedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), feedback: "Angel investment secured." },
          { title: "Beta Launch", status: "in_progress", dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        ]
      }
    });

    // 11. Seed Training Data
    console.log("📚 Seeding Training Data...");
    const trainingProfile = await TrainingProfile.create({
      user: trainee._id,
      phone: "+251933445566",
      institution: "Unity University",
      profession: "Software Engineer",
      status: "active",
      documents: { applicationLetter: { url: "http://example.com/letter.pdf", name: "letter.pdf" } }
    });

    const sessions = await Session.insertMany([
      { title: "React Fundamentals", trainer: staff._id, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), duration: 120, link: "https://zoom.us/r1", type: "online", status: "completed" },
      { title: "State Management", trainer: staff._id, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), duration: 120, link: "https://zoom.us/r2", type: "online", status: "completed" },
      { title: "Next.js Mastery", trainer: staff._id, date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), duration: 180, link: "https://zoom.us/r3", type: "online", status: "scheduled" }
    ]);

    // Add attendance
    trainingProfile.attendance = [
      { session: sessions[0]._id, attended: true, attendedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { session: sessions[1]._id, attended: true, attendedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    ];
    await trainingProfile.save();

    // 12. Seed Reports (Team & Director)
    console.log("📊 Seeding Reports...");
    await Report.insertMany([
      {
        title: "Weekly Infrastructure Report - W1",
        type: "team_report",
        submittedBy: teamlead._id,
        team: team._id,
        directorate: serviceDir._id,
        period: { startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        summary: "Established initial server monitoring and handled firewall updates.",
        status: "approved",
        approvedBy: director._id,
        approvedAt: new Date()
      },
      {
        title: "Weekly Infrastructure Report - W2",
        type: "team_report",
        submittedBy: teamlead._id,
        team: team._id,
        directorate: serviceDir._id,
        period: { startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), endDate: new Date() },
        summary: "Completed 5 network installations and resolved 3 major outages.",
        status: "submitted"
      },
      {
        title: "Monthly Directorate Overview - April",
        type: "director_report",
        submittedBy: director._id,
        directorate: serviceDir._id,
        period: { startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate: new Date() },
        summary: "Service delivery improved by 20% this month across all teams.",
        status: "approved",
        approvedBy: admin._id,
        approvedAt: new Date()
      }
    ]);

    // 13. Seed Announcements & Audit Logs
    console.log("📢 Seeding Announcements & Logs...");
    await Announcement.create({
      title: "New Policy Update",
      content: "Please check the updated security guidelines.",
      category: "update",
      createdBy: admin._id,
      isPublished: true
    });
    await AuditLog.create({
      user: admin._id,
      action: "CREATE",
      entity: "User",
      entityId: innovator._id,
      details: "Seeded initial user data",
      ipAddress: "127.0.0.1"
    });

    console.log("\n✨ SUCCESS! All dashboards are now fully populated with data.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedFullData();
