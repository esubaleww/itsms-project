import { useState, useCallback } from "react";
import { useToast } from "../common/ui/Toast";
import { teamLeadApi } from "../services/teamLead.service";

export const useTeamLead = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    completed: [],
  });
  const [progress, setProgress] = useState(null);
  const [reports, setReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getMyTeam();
      if (data.success) {
        setTeam(data.team);
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getTeamMembers();
      if (data.success) {
        setMembers(data.members || []);
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getTeamTasks(filters);
      if (data.success && data.tasks) {
        setTasks({
          pending: data.tasks.pending || [],
          in_progress: data.tasks.in_progress || [],
          completed: data.tasks.completed || [],
        });
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignTask = useCallback(
    async (taskId, memberId, instructions) => {
      setLoading(true);
      try {
        const data = await teamLeadApi.assignTask(
          taskId,
          memberId,
          instructions,
        );
        if (data.success) {
          await fetchTasks();
        }
        return data;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  const updateTaskStatus = useCallback(
    async (taskId, taskIndex, status, notes) => {
      setLoading(true);
      try {
        const data = await teamLeadApi.updateTaskStatus(
          taskId,
          taskIndex,
          status,
          notes,
        );
        if (data.success) {
          await fetchTasks();
        }
        return data;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getTeamProgress();
      if (data.success) {
        setProgress({
          stats: data.stats,
          memberPerformance: data.memberPerformance,
          weeklyActivity: data.weeklyActivity,
          completionRate: data.stats?.completionRate || 0,
          efficiency: Math.round(data.stats?.completionRate || 0),
          teamRating:
            data.stats?.completionRate > 80
              ? "A"
              : data.stats?.completionRate > 60
                ? "B"
                : "C",
        });
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestStaff = useCallback(async (data) => {
    setLoading(true);
    try {
      const result = await teamLeadApi.requestStaff(data);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getTeamReports(filters);
      if (data.success) {
        setReports(data.reports || []);
        setPagination(data.pagination || {});
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getMyReports();
      if (data.success) {
        setMyReports(data.reports || []);
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReport = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const result = await teamLeadApi.submitTeamReport(data);
        await fetchMyReports();
        await fetchReports();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchMyReports, fetchReports],
  );

  return {
    loading,
    team,
    members,
    tasks,
    progress,
    reports,
    myReports,
    pagination,
    fetchTeam,
    fetchMembers,
    fetchTasks,
    fetchProgress,
    fetchReports,
    fetchMyReports,
    assignTask,
    updateTaskStatus,
    requestStaff,
    submitReport,
  };
};
