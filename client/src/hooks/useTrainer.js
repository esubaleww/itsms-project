import { useState, useCallback } from "react";
import { trainerService } from "../services/trainer.service";
import { useToast } from "../components/ui/Toast";

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
    async (traineeId, sessionData) => {
      setLoading(true);
      try {
        const data = await trainerService.createSession(traineeId, sessionData);
        addToast("Session created!", "success");
        await fetchTraineeProgress(traineeId);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to create session", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTraineeProgress],
  );

  const recordAttendance = useCallback(
    async (sessionId, traineeId) => {
      setLoading(true);
      try {
        const data = await trainerService.recordAttendance(
          sessionId,
          traineeId,
        );
        addToast("Attendance recorded!", "success");
        await fetchTraineeProgress(traineeId);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to record attendance", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTraineeProgress],
  );

  const generateCertificate = useCallback(
    async (traineeId, sessionId) => {
      setLoading(true);
      try {
        const data = await trainerService.generateCertificate(
          traineeId,
          sessionId,
        );
        addToast("Certificate generated!", "success");
        return data;
      } catch (error) {
        addToast(error.message || "Failed to generate certificate", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
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
    fetchTraineeProgress,
    createSession,
    recordAttendance,
    generateCertificate,
    fetchStats,
    fetchDashboard,
  };
};
