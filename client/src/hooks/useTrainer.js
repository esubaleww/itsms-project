import { useState, useCallback } from "react";
import { trainerService } from "../services/trainer.service";
import { useToast } from "../common/ui/Toast";

export const useTrainer = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [traineeProgress, setTraineeProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const fetchTrainees = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const data = await trainerService.getMyTrainees(params);
        setTrainees(data.data || []);
        setPagination(data.pagination);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch trainees", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const fetchTraineeProgress = useCallback(
    async (traineeId) => {
      setLoading(true);
      try {
        const data = await trainerService.getTraineeProgress(traineeId);
        setTraineeProgress(data);
        setSelectedTrainee(data.trainee);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch progress", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const createSession = useCallback(
    async (sessionData) => {
      setLoading(true);
      try {
        const data = await trainerService.createSession(sessionData);
        addToast(
          "Session created! QR code generated for all trainees",
          "success",
        );
        return data;
      } catch (error) {
        addToast(error.message || "Failed to create session", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const markAttendance = useCallback(
    async (sessionId) => {
      setLoading(true);
      try {
        const data = await trainerService.markAttendance(sessionId);
        addToast("Attendance marked successfully!", "success");
        return data;
      } catch (error) {
        addToast(error.message || "Failed to mark attendance", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const getSessions = useCallback(async () => {
    try {
      const response = await trainerService.getSessions();
      return response;
    } catch (error) {
      addToast(error.message || "Failed to fetch sessions", "error");
      throw error;
    }
  }, [addToast]);

  const getSessionAttendance = useCallback(
    async (sessionId) => {
      try {
        const response = await trainerService.getSessionAttendance(sessionId);
        return response;
      } catch (error) {
        addToast(
          error.message || "Failed to fetch session attendance",
          "error",
        );
        throw error;
      }
    },
    [addToast],
  );

  const submitTrainerSummary = useCallback(
    async (traineeId, summaryData) => {
      setLoading(true);
      try {
        const data = await trainerService.submitTrainerSummary(
          traineeId,
          summaryData,
        );
        addToast("Summary submitted to director!", "success");
        return data;
      } catch (error) {
        addToast(error.message || "Failed to submit summary", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const updateTraineeStatus = useCallback(
    async (traineeId, status) => {
      setLoading(true);
      try {
        const data = await trainerService.updateTraineeStatus(
          traineeId,
          status,
        );
        addToast(`Status updated to ${status}!`, "success");
        await fetchTrainees();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update status", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTrainees],
  );

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await trainerService.getStats();
      setStats(data);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch stats", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await trainerService.getDashboard();
      setStats(data.stats);
      setTrainees(data.recentTrainees || []);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch dashboard", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return {
    loading,
    trainees,
    selectedTrainee,
    traineeProgress,
    stats,
    pagination,
    fetchTrainees,
    setSelectedTrainee,
    fetchTraineeProgress,
    createSession,
    markAttendance,
    getSessions,
    getSessionAttendance,
    submitTrainerSummary,
    updateTraineeStatus,
    fetchStats,
    fetchDashboard,
  };
};
