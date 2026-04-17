import API from "./api";

export const analyticsApi = {
  getAllAnalytics: async (dateRange = "30days") => {
    const response = await API.get(`/analytics?dateRange=${dateRange}`);
    return response.data;
  },

  getDailyActivity: async (dateRange = "30days") => {
    const response = await API.get(
      `/analytics/daily-activity?dateRange=${dateRange}`,
    );
    return response.data;
  },

  getRequestDistribution: async () => {
    const response = await API.get("/analytics/request-distribution");
    return response.data;
  },

  getStatusDistribution: async () => {
    const response = await API.get("/analytics/status-distribution");
    return response.data;
  },

  getUserStats: async (dateRange = "30days") => {
    const response = await API.get(
      `/analytics/user-stats?dateRange=${dateRange}`,
    );
    return response.data;
  },

  getRequestStats: async (dateRange = "30days") => {
    const response = await API.get(
      `/analytics/request-stats?dateRange=${dateRange}`,
    );
    return response.data;
  },

  getProgramStats: async (dateRange = "30days") => {
    const response = await API.get(
      `/analytics/program-stats?dateRange=${dateRange}`,
    );
    return response.data;
  },

  getPerformanceMetrics: async (dateRange = "30days") => {
    const response = await API.get(
      `/analytics/performance-metrics?dateRange=${dateRange}`,
    );
    return response.data;
  },
};
