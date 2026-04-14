import API from "./api";

export const analyticsApi = {
  getAllAnalytics: async () => {
    const response = await API.get("/analytics");
    return response.data;
  },

  getDailyActivity: async () => {
    const response = await API.get("/analytics/daily-activity");
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

  getUserStats: async () => {
    const response = await API.get("/analytics/user-stats");
    return response.data;
  },

  getRequestStats: async () => {
    const response = await API.get("/analytics/request-stats");
    return response.data;
  },

  getProgramStats: async () => {
    const response = await API.get("/analytics/program-stats");
    return response.data;
  },

  getPerformanceMetrics: async () => {
    const response = await API.get("/analytics/performance-metrics");
    return response.data;
  },
};
