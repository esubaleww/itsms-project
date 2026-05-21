import User from "../models/User.js";
import Request from "../models/Request.js";
import ServiceCatalog from "../models/ServiceCatalog.js";

class TeamLeadAnalyticsService {
  async getTeamInfo(teamLeadId) {
    const teamLead = await User.findById(teamLeadId)
      .populate("team")
      .populate("directorate");

    if (!teamLead || !teamLead.team) {
      throw new Error("No team assigned to you. Please contact your director.");
    }

    return {
      teamId: teamLead.team._id,
      teamName: teamLead.team.name,
      directorateId: teamLead.directorate?._id,
      directorateName: teamLead.directorate?.name,
    };
  }

  async getWeeklyActivity(teamId) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(23, 59, 59, 999);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const totalTasksUpToDate = await Request.countDocuments({
        assignedTeam: teamId,
        type: "service",
        createdAt: { $lte: date },
      });

      const completedUpToDate = await Request.countDocuments({
        assignedTeam: teamId,
        type: "service",
        status: "completed",
        completedAt: { $lte: date },
      });

      const inProgressAtDate = await Request.countDocuments({
        assignedTeam: teamId,
        type: "service",
        status: "in_progress",
        createdAt: { $lte: date },
      });

      const pendingAtDate = await Request.countDocuments({
        assignedTeam: teamId,
        type: "service",
        status: "assigned_to_team",
        createdAt: { $lte: date },
      });

      weeklyData.push({
        name: days[date.getDay()],
        tasks: totalTasksUpToDate,
        completed: completedUpToDate,
        inProgress: inProgressAtDate,
        pending: pendingAtDate,
        remaining: totalTasksUpToDate - completedUpToDate,
        fullDate: date.toISOString().split("T")[0],
      });
    }

    return weeklyData;
  }

  async getTeamPerformance(teamId) {
    const totalTasks = await Request.countDocuments({
      assignedTeam: teamId,
      type: "service",
    });

    const completedTasks = await Request.countDocuments({
      assignedTeam: teamId,
      type: "service",
      status: "completed",
    });

    const inProgressTasks = await Request.countDocuments({
      assignedTeam: teamId,
      type: "service",
      status: "in_progress",
    });

    const pendingTasks = await Request.countDocuments({
      assignedTeam: teamId,
      type: "service",
      status: "assigned_to_team",
    });

    const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
      teamRating:
        completionRate >= 80
          ? "Excellent"
          : completionRate >= 60
            ? "Good"
            : completionRate >= 40
              ? "Average"
              : "Needs Improvement",
      efficiency: Math.round((completedTasks / Math.max(totalTasks, 1)) * 100),
    };
  }

  calculateAvgResponseTime(tasks) {
    if (!tasks || tasks.length === 0) return null;

    let totalResponseTime = 0;
    let tasksWithResponse = 0;

    for (const task of tasks) {
      if (task.completedAt && task.createdAt) {
        const responseTime =
          new Date(task.completedAt) - new Date(task.createdAt);
        const hours = responseTime / (1000 * 60 * 60);
        totalResponseTime += hours;
        tasksWithResponse++;
      }
    }

    if (tasksWithResponse === 0) return null;

    const avgHours = totalResponseTime / tasksWithResponse;

    if (avgHours < 1) {
      const minutes = Math.round(avgHours * 60);
      return `${minutes} min`;
    } else if (avgHours < 24) {
      return `${Math.round(avgHours)} hrs`;
    } else {
      const days = Math.round(avgHours / 24);
      return `${days} days`;
    }
  }

  async getMemberPerformance(teamId) {
    const members = await User.find({ team: teamId, isActive: true }).select(
      "fullName email position",
    );

    const memberPerformance = await Promise.all(
      members.map(async (member) => {
        const memberTasks = await Request.find({
          assignedTo: member._id,
          type: "service",
        });

        const completed = memberTasks.filter(
          (t) => t.status === "completed",
        ).length;

        const inProgress = memberTasks.filter(
          (t) => t.status === "in_progress",
        ).length;

        const total = memberTasks.length;

        const avgResponseTime = this.calculateAvgResponseTime(memberTasks);

        return {
          id: member._id,
          name: member.fullName,
          email: member.email,
          position: member.position || "Team Member",
          totalTasks: total,
          completedTasks: completed,
          inProgressTasks: inProgress,
          completionRate: total ? Math.round((completed / total) * 100) : 0,
          avgResponseTime: avgResponseTime || "N/A",
        };
      }),
    );

    return memberPerformance.sort(
      (a, b) => b.completionRate - a.completionRate,
    );
  }

  async getTaskDistribution(teamId) {
    const serviceRequests = await Request.find({
      assignedTeam: teamId,
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

  async getRecentServiceRequests(teamId) {
    const requests = await Request.find({
      assignedTeam: teamId,
      type: "service",
    })
      .populate("applicant", "fullName email")
      .populate("assignedTo", "fullName")
      .sort("-createdAt")
      .limit(10)
      .lean();

    return requests.map((req) => ({
      id: req._id,
      title: req.title || req.metadata?.serviceType || "Service Request",
      serviceType: req.metadata?.serviceType || "General Service",
      priority: req.metadata?.priority || "medium",
      status: req.status,
      applicant: req.applicant?.fullName || "Unknown",
      assignedTo: req.assignedTo?.fullName,
      createdAt: req.createdAt,
      completedAt: req.completedAt,
    }));
  }

  async getAllAnalytics(teamLeadId) {
    try {
      const teamInfo = await this.getTeamInfo(teamLeadId);

      const [
        weeklyActivity,
        teamPerformance,
        memberPerformance,
        taskDistribution,
        recentRequests,
      ] = await Promise.all([
        this.getWeeklyActivity(teamInfo.teamId),
        this.getTeamPerformance(teamInfo.teamId),
        this.getMemberPerformance(teamInfo.teamId),
        this.getTaskDistribution(teamInfo.teamId),
        this.getRecentServiceRequests(teamInfo.teamId),
      ]);

      return {
        team: {
          id: teamInfo.teamId,
          name: teamInfo.teamName,
          directorate: teamInfo.directorateName,
        },
        weeklyActivity,
        teamPerformance,
        memberPerformance,
        taskDistribution,
        recentRequests,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new TeamLeadAnalyticsService();
