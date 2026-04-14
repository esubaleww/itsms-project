// client/src/hooks/useDirectorAnalytics.js
import { useState, useCallback } from "react";
import { directorService } from "../services/director.service";
import { useToast } from "../components/ui/Toast";

export const useDirectorAnalytics = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    directorate: {
      id: null,
      name: "",
      type: "",
    },
    weeklyActivity: [],
    requestDistribution: [],
    statusDistribution: [],
    teamPerformance: [],
    internProgress: { stats: {}, recentInterns: [] },
    innovatorProgress: { stats: {}, recentInnovators: [] },
    startupProgress: { stats: {}, recentStartups: [] },
    directorateSpecific: {},
    completionRate: 0,
    totalRequests: 0,
    completedRequests: 0,
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await directorService.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch analytics");
      }
      return response;
    } catch (error) {
      console.error("Fetch analytics error:", error);
      setError(error.message);
      addToast(error.message || "Failed to fetch analytics", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchWeeklyActivity = useCallback(async () => {
    setLoading(true);
    try {
      const response = await directorService.getWeeklyActivity();
      if (response.success) {
        setAnalytics((prev) => ({ ...prev, weeklyActivity: response.data }));
      }
      return response;
    } catch (error) {
      addToast(error.message || "Failed to fetch weekly activity", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchTeamPerformance = useCallback(async () => {
    setLoading(true);
    try {
      const response = await directorService.getTeamPerformance();
      if (response.success) {
        setAnalytics((prev) => ({ ...prev, teamPerformance: response.data }));
      }
      return response;
    } catch (error) {
      addToast(error.message || "Failed to fetch team performance", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchInternProgress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await directorService.getInternProgress();
      if (response.success) {
        setAnalytics((prev) => ({ ...prev, internProgress: response.data }));
      }
      return response;
    } catch (error) {
      addToast(error.message || "Failed to fetch intern progress", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return {
    loading,
    error,
    analytics,
    fetchAnalytics,
    fetchWeeklyActivity,
    fetchTeamPerformance,
    fetchInternProgress,
  };
};
