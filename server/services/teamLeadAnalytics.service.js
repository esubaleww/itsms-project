import User from "../models/User.js";
import Request from "../models/Request.js";
import Report from "../models/Report.js";

class TeamLeadAnalyticsService {
  async getTeamInfo(teamLeadId) {
    const teamLead = await User.findById(teamLeadId)
      .populate("team")
      .populate("directorate");

    if (!teamLead || !teamLead.team) {
      console.log("Team lead not found or no team assigned");
      return;
    }

    return {
      teamId: teamLead.team._id,
      teamName: teamLead.team.name,
      directorateId: teamLead.directorate?._id,
      directorateName: teamLead.directorate?.name,
    };
  }

  async getWeeklyActivity(teamId) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const weeklyStats = await Request.aggregate([
      {
        $match: {
          assignedTeam: teamId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            dayOfWeek: { $dayOfWeek: "$createdAt" },
          },
          tasks: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
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
      const stats = statsMap.get(dateStr) || { tasks: 0, completed: 0 };
      return {
        name: dayNames[date.getDay()],
        tasks: stats.tasks,
        completed: stats.completed,
        fullDate: dateStr,
      };
    });
  }

  async getTeamPerformance(teamId) {
    const totalTasks = await Request.countDocuments({ assignedTeam: teamId });
    const completedTasks = await Request.countDocuments({
      assignedTeam: teamId,
      status: "completed",
    });
    const inProgressTasks = await Request.countDocuments({
      assignedTeam: teamId,
      status: "in_progress",
    });
    const pendingTasks = await Request.countDocuments({
      assignedTeam: teamId,
      status: "assigned_to_team",
    });

    const completionRate = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
      teamRating:
        completionRate >= 80
          ? "A"
          : completionRate >= 60
            ? "B"
            : completionRate >= 40
              ? "C"
              : "D",
      efficiency: Math.round((completedTasks / Math.max(totalTasks, 1)) * 100),
    };
  }

  async getMemberPerformance(teamId) {
    const members = await User.find({ team: teamId, isActive: true }).select(
      "fullName email position",
    );

    const memberPerformance = await Promise.all(
      members.map(async (member) => {
        const memberTasks = await Request.find({ assignedTo: member._id });
        const completed = memberTasks.filter(
          (t) => t.status === "completed",
        ).length;
        const inProgress = memberTasks.filter(
          (t) => t.status === "in_progress",
        ).length;
        const total = memberTasks.length;

        return {
          id: member._id,
          name: member.fullName,
          email: member.email,
          position: member.position || "Team Member",
          totalTasks: total,
          completedTasks: completed,
          inProgressTasks: inProgress,
          completionRate: total ? Math.round((completed / total) * 100) : 0,
          rating: total ? (completed / total) * 5 : 0,
        };
      }),
    );

    return memberPerformance.sort(
      (a, b) => b.completionRate - a.completionRate,
    );
  }

  async getTaskDistribution(teamId) {
    const distribution = await Request.aggregate([
      { $match: { assignedTeam: teamId } },
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

  async getRecentReports(teamId) {
    const reports = await Report.find({ team: teamId, type: "team_report" })
      .populate("submittedBy", "fullName")
      .sort("-createdAt")
      .limit(5)
      .lean();

    return reports.map((report) => ({
      id: report._id,
      title: report.title,
      status: report.status,
      submittedBy: report.submittedBy?.fullName,
      createdAt: report.createdAt,
    }));
  }

  async getAllAnalytics(teamLeadId) {
    const { teamId, teamName, directorateName } =
      await this.getTeamInfo(teamLeadId);

    const [
      weeklyActivity,
      teamPerformance,
      memberPerformance,
      taskDistribution,
      recentReports,
    ] = await Promise.all([
      this.getWeeklyActivity(teamId),
      this.getTeamPerformance(teamId),
      this.getMemberPerformance(teamId),
      this.getTaskDistribution(teamId),
      this.getRecentReports(teamId),
    ]);

    return {
      team: {
        id: teamId,
        name: teamName,
        directorate: directorateName,
      },
      weeklyActivity,
      teamPerformance,
      memberPerformance,
      taskDistribution,
      recentReports,
    };
  }
}

export default new TeamLeadAnalyticsService();
