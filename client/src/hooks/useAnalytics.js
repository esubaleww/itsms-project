import { useEffect } from "react";
import useAnalyticsStore from "../store/analyticsStore";
import { useToast } from "../common/ui/Toast";

export const useAnalytics = () => {
  const { addToast } = useToast();
  const {
    dailyActivity,
    requestDistribution,
    statusDistribution,
    userStats,
    requestStats,
    programStats,
    performanceMetrics,
    loading,
    error,
    fetchAnalytics,
    fetchDailyActivity,
    clearError,
  } = useAnalyticsStore();

  useEffect(() => {
    if (error) {
      addToast(error, "error");
      clearError();
    }
  }, [error, addToast, clearError]);

  return {
    dailyActivity,
    requestDistribution,
    statusDistribution,
    userStats,
    requestStats,
    programStats,
    performanceMetrics,
    loading,
    fetchAnalytics,
    fetchDailyActivity,
  };
};
