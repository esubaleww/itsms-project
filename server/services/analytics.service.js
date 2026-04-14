import User from "../models/User.js";
import Request from "../models/Request.js";
import InternProfile from "../models/InternProfile.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import Report from "../models/Report.js";
import ServiceCatalog from "../models/ServiceCatalog.js";
import Directorate from "../models/Directorate.js";
import Team from "../models/Team.js";

class AnalyticsService {
  _getDateRange(days) {
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();
    return dates;
  }

  async getDailyActivity(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const dailyStats = await Request.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          requests: { $sum: 1 },
          approvals: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "approved"] },
                    { $eq: ["$adminDecision.approved", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          rejections: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "rejected"] },
                    { $eq: ["$adminDecision.approved", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    const statsMap = new Map();
    dailyStats.forEach((stat) => {
      statsMap.set(stat._id.date, stat);
    });

    const dateRange = this._getDateRange(days);
    return dateRange.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const stats = statsMap.get(dateStr) || {
        requests: 0,
        approvals: 0,
        rejections: 0,
      };
      return {
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        requests: stats.requests,
        approvals: stats.approvals,
        rejections: stats.rejections,
        fullDate: dateStr,
      };
    });
  }

  async getRequestDistribution() {
    const distribution = await Request.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const typeConfig = {
      internship: { label: "Internships", color: "#10B981" },
      innovation: { label: "Innovations", color: "#8B5CF6" },
      startup: { label: "Startups", color: "#F59E0B" },
      training: { label: "Trainings", color: "#3B82F6" },
      service: { label: "Service Requests", color: "#EC4899" },
    };

    return distribution.map((item) => ({
      name: typeConfig[item._id]?.label || item._id,
      value: item.count,
      color: typeConfig[item._id]?.color || "#6B7280",
    }));
  }

  async getStatusDistribution() {
    const distribution = await Request.aggregate([
      {
        $addFields: {
          effectiveStatus: {
            $cond: [
              { $eq: ["$status", "pending_admin"] },
              "pending_admin",
              {
                $cond: [
                  { $eq: ["$status", "rejected"] },
                  "rejected",
                  {
                    $cond: [
                      { $eq: ["$adminDecision.approved", true] },
                      "approved",
                      "$status",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$effectiveStatus",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const statusConfig = {
      pending_admin: { label: "Pending Admin", color: "#F59E0B" },
      approved: { label: "Approved", color: "#10B981" },
      assigned_to_director: { label: "With Director", color: "#3B82F6" },
      assigned_to_team: { label: "With Team", color: "#8B5CF6" },
      in_progress: { label: "In Progress", color: "#06B6D4" },
      completed: { label: "Completed", color: "#22C55E" },
      rejected: { label: "Rejected", color: "#EF4444" },
    };

    return distribution.map((item) => ({
      name: statusConfig[item._id]?.label || item._id,
      value: item.count,
      color: statusConfig[item._id]?.color || "#6B7280",
    }));
  }

  async getUserStats() {
    const [
      totalUsers,
      verifiedUsers,
      activeUsers,
      usersByRole,
      usersByDemographic,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ emailVerified: true }),
      User.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.aggregate([
        { $match: { "demographic.gender": { $exists: true } } },
        { $group: { _id: "$demographic.gender", count: { $sum: 1 } } },
      ]),
    ]);

    return {
      total: totalUsers,
      verified: verifiedUsers,
      verificationRate: totalUsers
        ? Number(((verifiedUsers / totalUsers) * 100).toFixed(1))
        : 0,
      activeLast30Days: activeUsers,
      byRole: usersByRole,
      byGender: usersByDemographic,
    };
  }

  async getRequestStats() {
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      completedRequests,
      avgCompletionTime,
    ] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: "pending_admin" }),
      Request.countDocuments({
        $or: [{ status: "approved" }, { "adminDecision.approved": true }],
      }),
      Request.countDocuments({
        $or: [
          { status: "rejected" },
          {
            "adminDecision.approved": false,
            status: { $ne: "pending_admin" },
          },
        ],
      }),
      Request.countDocuments({ status: "completed" }),
      Request.aggregate([
        {
          $match: {
            completedAt: { $exists: true },
            createdAt: { $exists: true },
            status: "completed",
          },
        },
        {
          $project: {
            duration: { $subtract: ["$completedAt", "$createdAt"] },
          },
        },
        {
          $group: {
            _id: null,
            avg: { $avg: "$duration" },
          },
        },
      ]),
    ]);

    const avgDays = avgCompletionTime[0]?.avg
      ? Math.round(avgCompletionTime[0].avg / (1000 * 60 * 60 * 24))
      : 0;

    return {
      total: totalRequests,
      pending: pendingRequests,
      approved: approvedRequests,
      rejected: rejectedRequests,
      completed: completedRequests,
      approvalRate: totalRequests
        ? Number(((approvedRequests / totalRequests) * 100).toFixed(1))
        : 0,
      rejectionRate: totalRequests
        ? Number(((rejectedRequests / totalRequests) * 100).toFixed(1))
        : 0,
      avgCompletionDays: avgDays,
    };
  }

  async getProgramStats() {
    const [interns, innovators, startups] = await Promise.all([
      InternProfile.aggregate([
        {
          $facet: {
            active: [{ $match: { status: "active" } }, { $count: "count" }],
            total: [{ $count: "count" }],
          },
        },
      ]),
      InnovatorProfile.aggregate([
        {
          $facet: {
            active: [{ $match: { status: "incubating" } }, { $count: "count" }],
            total: [{ $count: "count" }],
          },
        },
      ]),
      StartupProfile.aggregate([
        {
          $facet: {
            active: [{ $match: { status: "incubating" } }, { $count: "count" }],
            total: [{ $count: "count" }],
          },
        },
      ]),
    ]);

    return {
      interns: {
        active: interns[0]?.active[0]?.count || 0,
        total: interns[0]?.total[0]?.count || 0,
      },
      innovators: {
        active: innovators[0]?.active[0]?.count || 0,
        total: innovators[0]?.total[0]?.count || 0,
      },
      startups: {
        active: startups[0]?.active[0]?.count || 0,
        total: startups[0]?.total[0]?.count || 0,
      },
    };
  }

  async getPerformanceMetrics() {
    const [
      totalReports,
      pendingReports,
      approvedReports,
      totalStaff,
      totalDirectorates,
      totalTeams,
      totalServices,
    ] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      Report.countDocuments({ status: "approved" }),
      User.countDocuments({ role: "staff" }),
      Directorate.countDocuments(),
      Team.countDocuments(),
      ServiceCatalog.countDocuments({ isActive: true }),
    ]);

    return {
      reports: {
        total: totalReports,
        pending: pendingReports,
        approved: approvedReports,
        approvalRate: totalReports
          ? Number(((approvedReports / totalReports) * 100).toFixed(1))
          : 0,
      },
      staff: totalStaff,
      directorates: totalDirectorates,
      teams: totalTeams,
      services: totalServices,
    };
  }

  async getAllAnalytics() {
    const [
      dailyActivity,
      requestDistribution,
      statusDistribution,
      userStats,
      requestStats,
      programStats,
      performanceMetrics,
    ] = await Promise.all([
      this.getDailyActivity(),
      this.getRequestDistribution(),
      this.getStatusDistribution(),
      this.getUserStats(),
      this.getRequestStats(),
      this.getProgramStats(),
      this.getPerformanceMetrics(),
    ]);

    return {
      dailyActivity,
      requestDistribution,
      statusDistribution,
      userStats,
      requestStats,
      programStats,
      performanceMetrics,
    };
  }
}

export default new AnalyticsService();
