import Request from "../models/Request.js";
import Report from "../models/Report.js";
import InternProfile from "../models/InternProfile.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import Team from "../models/Team.js";
import User from "../models/User.js";

class DirectorAnalyticsService {
  async getDirectorInfo(directorId) {
    const director = await User.findById(directorId).populate("directorate");
    return director;
  }

  async getWeeklyActivity(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const weeklyStats = await Request.aggregate([
      {
        $match: {
          directorate: directorateId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            dayOfWeek: { $dayOfWeek: "$createdAt" },
          },
          requests: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const statsMap = new Map();
    weeklyStats.forEach((stat) => {
      statsMap.set(stat._id.date, stat);
    });

    return last7Days.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const stats = statsMap.get(dateStr) || {
        requests: 0,
        completed: 0,
        inProgress: 0,
      };
      return {
        name: dayNames[date.getDay()],
        requests: stats.requests,
        completed: stats.completed,
        inProgress: stats.inProgress,
        fullDate: dateStr,
      };
    });
  }

  async getRequestDistribution(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const distribution = await Request.aggregate([
      { $match: { directorate: directorateId } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const typeConfig = {
      service: { label: "Service Requests", color: "#10B981" },
      internship: { label: "Internships", color: "#3B82F6" },
      innovation: { label: "Innovations", color: "#8B5CF6" },
      startup: { label: "Startups", color: "#F59E0B" },
      training: { label: "Trainings", color: "#EC4899" },
    };

    return distribution.map((item) => ({
      name: typeConfig[item._id]?.label || item._id,
      value: item.count,
      color: typeConfig[item._id]?.color || "#6B7280",
    }));
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
        const pendingReports = await Report.countDocuments({
          team: team._id,
          status: "pending",
        });

        return {
          name: team.name,
          members: team.members?.length || 0,
          completedRequests,
          totalRequests,
          pendingReports,
          completionRate: totalRequests
            ? Math.round((completedRequests / totalRequests) * 100)
            : 0,
        };
      }),
    );

    return teamPerformance;
  }

  async getInternProgress(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const interns = await InternProfile.find({
      "placement.directorate": directorateId,
    })
      .populate("user", "fullName email")
      .populate("placement.advisor", "fullName")
      .lean();

    const internStats = {
      total: interns.length,
      active: interns.filter((i) => i.status === "active").length,
      withAdvisor: interns.filter((i) => i.placement?.advisor).length,
      reportsSubmitted: interns.reduce(
        (sum, i) => sum + (i.reports?.length || 0),
        0,
      ),
      averageReports: interns.length
        ? Math.round(
            interns.reduce((sum, i) => sum + (i.reports?.length || 0), 0) /
              interns.length,
          )
        : 0,
    };

    const recentInterns = interns.slice(0, 5).map((intern) => ({
      name: intern.user?.fullName,
      advisor: intern.placement?.advisor?.fullName || "Not Assigned",
      reports: intern.reports?.length || 0,
      status: intern.status,
    }));

    return { stats: internStats, recentInterns };
  }

  async getInnovatorProgress(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const innovators = await InnovatorProfile.find({
      "incubation.center": directorateId,
    })
      .populate("user", "fullName email")
      .populate("incubation.mentor", "fullName")
      .lean();

    const innovatorStats = {
      total: innovators.length,
      incubating: innovators.filter((i) => i.status === "incubating").length,
      withMentor: innovators.filter((i) => i.incubation?.mentor).length,
      graduated: innovators.filter((i) => i.status === "graduated").length,
    };

    const recentInnovators = innovators.slice(0, 5).map((innovator) => ({
      name: innovator.user?.fullName,
      mentor: innovator.incubation?.mentor?.fullName || "Not Assigned",
      idea: innovator.ideaTitle,
      status: innovator.status,
    }));

    return { stats: innovatorStats, recentInnovators };
  }

  async getStartupProgress(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;

    const startups = await StartupProfile.find({
      "incubation.center": directorateId,
    })
      .populate("user", "fullName email")
      .populate("incubation.mentor", "fullName")
      .lean();

    const startupStats = {
      total: startups.length,
      incubating: startups.filter((s) => s.status === "incubating").length,
      withMentor: startups.filter((s) => s.incubation?.mentor).length,
      graduated: startups.filter((s) => s.status === "graduated").length,
    };

    const recentStartups = startups.slice(0, 5).map((startup) => ({
      name: startup.companyName,
      founder: startup.user?.fullName,
      mentor: startup.incubation?.mentor?.fullName || "Not Assigned",
      stage: startup.incubation?.stage,
      status: startup.status,
    }));

    return { stats: startupStats, recentStartups };
  }

  async getAllAnalytics(directorId) {
    const director = await this.getDirectorInfo(directorId);
    const directorateId = director.directorate?._id;
    const directorateType = director.directorate?.type || "general";

    const [
      weeklyActivity,
      requestDistribution,
      statusDistribution,
      teamPerformance,
      internProgress,
      innovatorProgress,
      startupProgress,
    ] = await Promise.all([
      this.getWeeklyActivity(directorId),
      this.getRequestDistribution(directorId),
      this.getStatusDistribution(directorId),
      this.getTeamPerformance(directorId),
      this.getInternProgress(directorId),
      this.getInnovatorProgress(directorId),
      this.getStartupProgress(directorId),
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

    let directorateSpecific = {};
    if (directorateType === "internship") {
      directorateSpecific = {
        activeInterns: internProgress.stats.active,
        totalInterns: internProgress.stats.total,
        reportsSubmitted: internProgress.stats.reportsSubmitted,
      };
    } else if (directorateType === "innovation") {
      directorateSpecific = {
        activeInnovators: innovatorProgress.stats.incubating,
        totalInnovators: innovatorProgress.stats.total,
        graduatedInnovators: innovatorProgress.stats.graduated,
      };
    } else if (directorateType === "startup") {
      directorateSpecific = {
        activeStartups: startupProgress.stats.incubating,
        totalStartups: startupProgress.stats.total,
        graduatedStartups: startupProgress.stats.graduated,
      };
    }

    return {
      directorate: {
        id: directorateId,
        name: director.directorate?.name,
        type: directorateType,
      },
      weeklyActivity,
      requestDistribution,
      statusDistribution,
      teamPerformance,
      internProgress,
      innovatorProgress,
      startupProgress,
      directorateSpecific,
      completionRate,
      totalRequests,
      completedRequests,
    };
  }
}

export default new DirectorAnalyticsService();
