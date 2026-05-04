import { create } from "zustand";
import { analyticsApi } from "../services/admin.analytics.service";

const useAnalyticsStore = create((set, get) => ({
  dailyActivity: [],
  requestDistribution: [],
  statusDistribution: [],
  userStats: null,
  requestStats: null,
  programStats: null,
  performanceMetrics: null,
  loading: false,
  error: null,

  fetchAnalytics: async (dateRange = "30days") => {
    set({ loading: true, error: null });
    try {
      const response = await analyticsApi.getAllAnalytics(dateRange);

      if (response.success) {
        set({
          dailyActivity: response.data.dailyActivity,
          requestDistribution: response.data.requestDistribution,
          statusDistribution: response.data.statusDistribution,
          userStats: response.data.userStats,
          requestStats: response.data.requestStats,
          programStats: response.data.programStats,
          performanceMetrics: response.data.performanceMetrics,
          loading: false,
        });
      }
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchDailyActivity: async (dateRange = "30days") => {
    set({ loading: true });
    try {
      const response = await analyticsApi.getDailyActivity(dateRange);

      if (response.success) {
        set({ dailyActivity: response.data, loading: false });
      }
      return response;
    } catch (error) {
      console.error("🔴 Store error:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  reset: () =>
    set({
      dailyActivity: [],
      requestDistribution: [],
      statusDistribution: [],
      userStats: null,
      requestStats: null,
      programStats: null,
      performanceMetrics: null,
      loading: false,
      error: null,
    }),
}));

export default useAnalyticsStore;
