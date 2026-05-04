import API from "./api";

export const analyticsApi = {
  getAllAnalytics: async (dateRange = "7days") => {
    const response = await API.get(`/admin/analytics?dateRange=${dateRange}`);
    return response.data;
  },

  getDailyActivity: async (dateRange = "7days") => {
    const response = await API.get(
      `/admin/analytics/daily-activity?dateRange=${dateRange}`,
    );
    return response.data;
  },

  getRequestDistribution: async () => {
    const response = await API.get("/admin/analytics/request-distribution");
    return response.data;
  },

  getStatusDistribution: async () => {
    const response = await API.get("/admin/analytics/status-distribution");
    return response.data;
  },

  getUserStats: async (dateRange = "7days") => {
    const response = await API.get(
      `/admin/analytics/user-stats?dateRange=${dateRange}`,
    );
    return response.data;
  },

  getRequestStats: async (dateRange = "7days") => {
    const response = await API.get(
      `/admin/analytics/request-stats?dateRange=${dateRange}`,
    );
    return response.data;
  },

  getProgramStats: async (dateRange = "7days") => {
    const response = await API.get(
      `/admin/analytics/program-stats?dateRange=${dateRange}`,
    );
    return response.data;
  },

  getPerformanceMetrics: async (dateRange = "7days") => {
    const response = await API.get(
      `/admin/analytics/performance-metrics?dateRange=${dateRange}`,
    );
    return response.data;
  },
};
