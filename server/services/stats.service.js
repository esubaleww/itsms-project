import User from "../models/User.js";
import Request from "../models/Request.js";

export const getDashboardStats = async () => {
  try {
    const [
      totalUsers,
      totalInterns,
      totalInnovators,
      totalStartups,
      totalTrainees,
      completedProjects,
      totalApplications,
      approvedApplications,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ internProfile: { $exists: true } }),
      User.countDocuments({ innovatorProfile: { $exists: true } }),
      User.countDocuments({ startupProfile: { $exists: true } }),
      User.countDocuments({ trainingProfile: { $exists: true } }),
      Request.countDocuments({ status: "completed" }),
      Request.countDocuments({
        type: { $in: ["internship", "innovation", "startup", "training"] },
      }),
      Request.countDocuments({
        type: { $in: ["internship", "innovation", "startup", "training"] },
        status: "approved",
      }),
    ]);

    const successRate =
      totalApplications > 0
        ? Math.round((approvedApplications / totalApplications) * 100)
        : 0;

    return {
      success: true,
      stats: [
        {
          value: totalUsers.toLocaleString(),
          label: "Active Users",
          icon: "Users",
        },
        {
          value: totalStartups.toLocaleString(),
          label: "Active Startups",
          icon: "Rocket",
        },
        {
          value: totalTrainees.toLocaleString(),
          label: "Active Trainees",
          icon: "School",
        },
        {
          value: totalInterns.toLocaleString(),
          label: "Active Interns",
          icon: "Briefcase",
        },
        {
          value: totalInnovators.toLocaleString(),
          label: "Active Innovators",
          icon: "Lightbulb",
        },
        { value: `${successRate}%`, label: "Success Rate", icon: "TrendingUp" },
        {
          value: completedProjects.toLocaleString(),
          label: "Completed Projects",
          icon: "Code",
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }
};
