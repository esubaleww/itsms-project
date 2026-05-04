import Request from "../models/Request.js";
import Report from "../models/Report.js";
import InternProfile from "../models/InternProfile.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import ServiceCatalog from "../models/ServiceCatalog.js";

class DirectorAnalyticsService {
  async getDirectorInfo(directorId) {
    const director = await User.findById(directorId).populate("directorate");
    return director;
  }

  async getWeeklyActivity(directorId, days = 7) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      date.setHours(23, 59, 59, 999);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const requestsCount = await Request.countDocuments({
        directorate: directorateId,
        createdAt: { $lte: endOfDay },
      });

      const completedCount = await Request.countDocuments({
        directorate: directorateId,
        status: "completed",
        completedAt: { $lte: endOfDay },
      });

      const inProgressCount = await Request.countDocuments({
        directorate: directorateId,
        status: "in_progress",
        createdAt: { $lte: endOfDay },
      });

      const pendingCount = await Request.countDocuments({
        directorate: directorateId,
        status: "assigned_to_team",
        createdAt: { $lte: endOfDay },
      });

      weeklyData.push({
        name: dayNames[date.getDay()],
        requests: requestsCount,
        completed: completedCount,
        inProgress: inProgressCount,
        pending: pendingCount,
        remaining: requestsCount - completedCount,
        fullDate: date.toISOString().split("T")[0],
      });
    }

    return weeklyData;
  }

  async getRequestDistribution(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const serviceRequests = await Request.find({
      directorate: directorateId,
      type: "service",
    }).lean();

    if (serviceRequests.length === 0) {
      return [];
    }

    const serviceCatalog = await ServiceCatalog.find({ isActive: true });
    const catalogMap = new Map();
    serviceCatalog.forEach((service) => {
      catalogMap.set(service.name, {
        label: service.name,
        category: service.category,
      });
    });

    const distribution = new Map();

    for (const request of serviceRequests) {
      let serviceType = request.metadata?.serviceType;

      if (!serviceType) {
        serviceType = "General Service";
      }

      const catalogInfo = catalogMap.get(serviceType);
      const displayName = catalogInfo ? catalogInfo.label : serviceType;

      distribution.set(displayName, (distribution.get(displayName) || 0) + 1);
    }

    const total = serviceRequests.length;
    const result = [];

    const colorPalette = [
      "#10B981",
      "#3B82F6",
      "#8B5CF6",
      "#F59E0B",
      "#EF4444",
      "#EC4899",
      "#06B6D4",
      "#F97316",
      "#6366F1",
      "#14B8A6",
    ];

    let colorIndex = 0;
    for (const [name, count] of distribution) {
      result.push({
        name: name,
        value: count,
        percentage: Math.round((count / total) * 100),
        color: colorPalette[colorIndex % colorPalette.length],
      });
      colorIndex++;
    }

    return result.sort((a, b) => b.value - a.value);
  }

  async getStatusDistribution(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const distribution = await Request.aggregate([
      { $match: { directorate: directorateId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusConfig = {
      pending_admin: { label: "Pending Admin", color: "#F59E0B" },
      approved: { label: "Approved", color: "#10B981" },
      rejected: { label: "Rejected", color: "#EF4444" },
      assigned_to_director: { label: "With Director", color: "#3B82F6" },
      assigned_to_team: { label: "With Team", color: "#8B5CF6" },
      in_progress: { label: "In Progress", color: "#06B6D4" },
      completed: { label: "Completed", color: "#22C55E" },
    };

    return distribution.map((item) => ({
      name: statusConfig[item._id]?.label || item._id,
      value: item.count,
      color: statusConfig[item._id]?.color || "#6B7280",
    }));
  }

  async getTeamPerformance(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const teams = await Team.find({ directorate: directorateId })
      .populate("members", "fullName")
      .lean();

    const teamPerformance = await Promise.all(
      teams.map(async (team) => {
        const completedRequests = await Request.countDocuments({
          assignedTeam: team._id,
          status: "completed",
        });
        const totalRequests = await Request.countDocuments({
          assignedTeam: team._id,
        });
        const reports = await Report.countDocuments({
          team: team._id,
        });

        return {
          name: team.name,
          members: team.members?.length || 0,
          completedRequests,
          totalRequests,
          reports,
          completionRate: totalRequests
            ? Math.round((completedRequests / totalRequests) * 100)
            : 0,
        };
      }),
    );

    return teamPerformance;
  }

  async getRecentServiceRequests(directorId, limit = 10) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const requests = await Request.find({
      directorate: directorateId,
      type: "service",
    })
      .populate("applicant", "fullName email")
      .populate("assignedTeam", "name")
      .sort("-createdAt")
      .limit(limit)
      .lean();

    return requests.map((req) => ({
      id: req._id,
      title: req.title || req.metadata?.serviceType || "Service Request",
      serviceType: req.metadata?.serviceType || "General Service",
      priority: req.metadata?.priority || "medium",
      status: req.status,
      applicant: req.applicant?.fullName || "Unknown",
      assignedTeam: req.assignedTeam?.name,
      createdAt: req.createdAt,
      completedAt: req.completedAt,
    }));
  }

  async getDirectorateSpecificProgress(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;
    const directorateType = director.directorate?.type || "general";

    let specificData = {};

    if (directorateType === "internship") {
      const interns = await InternProfile.find({
        "placement.directorate": directorateId,
      }).lean();

      specificData = {
        activeInterns: interns.filter((i) => i.status === "active").length,
        totalInterns: interns.length,
        reportsSubmitted: interns.reduce(
          (sum, i) => sum + (i.reports?.length || 0),
          0,
        ),
      };
    } else if (directorateType === "innovation") {
      const innovators = await InnovatorProfile.find({
        "incubation.center": directorateId,
      }).lean();

      specificData = {
        activeInnovators: innovators.filter((i) => i.status === "incubating")
          .length,
        totalInnovators: innovators.length,
        graduatedInnovators: innovators.filter((i) => i.status === "graduated")
          .length,
      };
    } else if (directorateType === "startup") {
      const startups = await StartupProfile.find({
        "incubation.center": directorateId,
      }).lean();

      specificData = {
        activeStartups: startups.filter((s) => s.status === "incubating")
          .length,
        totalStartups: startups.length,
        graduatedStartups: startups.filter((s) => s.status === "graduated")
          .length,
      };
    }

    return specificData;
  }

  async getAllAnalytics(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const [
      weeklyActivity,
      requestDistribution,
      statusDistribution,
      teamPerformance,
      recentRequests,
      directorateSpecific,
    ] = await Promise.all([
      this.getWeeklyActivity(directorId),
      this.getRequestDistribution(directorId),
      this.getStatusDistribution(directorId),
      this.getTeamPerformance(directorId),
      this.getRecentServiceRequests(directorId),
      this.getDirectorateSpecificProgress(directorId),
    ]);

    const totalRequests = await Request.countDocuments({
      directorate: directorateId,
    });
    const completedRequests = await Request.countDocuments({
      directorate: directorateId,
      status: "completed",
    });
    const completionRate = totalRequests
      ? Math.round((completedRequests / totalRequests) * 100)
      : 0;

    return {
      directorate: {
        id: directorateId,
        name: director.directorate?.name,
        type: director.directorate?.type || "general",
      },
      weeklyActivity,
      requestDistribution,
      statusDistribution,
      teamPerformance,
      recentRequests,
      directorateSpecific,
      completionRate,
      totalRequests,
      completedRequests,
    };
  }
}

export default new DirectorAnalyticsService();
