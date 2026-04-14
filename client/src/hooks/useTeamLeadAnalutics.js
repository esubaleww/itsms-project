import { useState, useCallback } from "react";
import { useToast } from "../components/ui/Toast";
import { teamLeadApi } from "../services/teamLead.service";

export const useTeamLeadAnalytics = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    team: { id: null, name: "", directorate: "" },
    weeklyActivity: [],
    teamPerformance: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      completionRate: 0,
      teamRating: "A",
      efficiency: 0,
    },
    memberPerformance: [],
    taskDistribution: [],
    recentReports: [],
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await teamLeadApi.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
      return response;
    } catch (error) {
      addToast(error.message || "Failed to fetch analytics", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return {
    loading,
    analytics,
    fetchAnalytics,
  };
};
