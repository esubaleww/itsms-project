import { useState, useCallback } from "react";
import { useToast } from "../components/ui/Toast";
import { teamLeadApi } from "../services/teamLead.service";

export const useTeamLead = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(null);
  const [reports, setReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Team Management
  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getMyTeam();
      if (data.success) {
        setTeam(data.team);
      }
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch team", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getTeamMembers();
      if (data.success) {
        setMembers(data.members || []);
      }
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch members", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Task Management
  const fetchTasks = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const data = await teamLeadApi.getTeamTasks(filters);
        if (data.success) {
          // Flatten tasks from grouped structure
          const allTasks = [
            ...(data.tasks?.pending || []),
            ...(data.tasks?.in_progress || []),
            ...(data.tasks?.completed || []),
          ];
          setTasks(allTasks);
        }
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch tasks", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

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
          addToast(data.message || "Task assigned successfully!", "success");
          await fetchTasks();
        }
        return data;
      } catch (error) {
        addToast(error.message || "Failed to assign task", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTasks],
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
          addToast(data.message || "Task status updated!", "success");
          await fetchTasks();
        }
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update task status", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTasks],
  );

  // Progress
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
      addToast(error.message || "Failed to fetch progress", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Staff Request
  const requestStaff = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const result = await teamLeadApi.requestStaff(data);
        addToast(result.message || "Staff request submitted!", "success");
        return result;
      } catch (error) {
        addToast(error.message || "Failed to submit request", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  // Reports
  const fetchReports = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const data = await teamLeadApi.getTeamReports(filters);
        if (data.success) {
          setReports(data.reports || []);
          setPagination(data.pagination || {});
        }
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch reports", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const fetchMyReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamLeadApi.getMyReports();
      if (data.success) {
        setMyReports(data.reports || []);
      }
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch your reports", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const submitReport = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const result = await teamLeadApi.submitTeamReport(data);
        addToast(result.message || "Report submitted successfully!", "success");
        await fetchMyReports();
        await fetchReports();
        return result;
      } catch (error) {
        addToast(error.message || "Failed to submit report", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchMyReports, fetchReports],
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
