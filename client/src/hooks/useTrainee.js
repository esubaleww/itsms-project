import { useState, useCallback } from "react";
import { traineeService } from "../services/trainee.service";
import { useToast } from "../common/ui/Toast";

export const useTrainee = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState({ upcoming: [], past: [] });
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [attendedCount, setAttendedCount] = useState(0);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await traineeService.getSessions();
      setSessions(data.sessions);
      setAttendedCount(data.sessions.attended);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch sessions", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const markAttendance = useCallback(
    async (sessionId) => {
      setLoading(true);
      try {
        const data = await traineeService.markAttendance(sessionId);
        addToast("Attendance marked successfully!", "success");
        await fetchSessions();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to mark attendance", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchSessions],
  );

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await traineeService.getProfile();
      setProfile(data.profile);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch profile", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const data = await traineeService.getProgress();
      setProgress(data.stats);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch progress", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchTrainer = useCallback(async () => {
    setLoading(true);
    try {
      const data = await traineeService.getTrainer();
      setTrainer(data.trainer);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch trainer", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await traineeService.getDashboard();
      setProfile(data.profile);
      setProgress(data.progress);
      setSessions((prev) => ({ ...prev, past: data.recentSessions || [] }));
      setTrainer(data.trainer);
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
    sessions,
    profile,
    progress,
    trainer,
    certificates,
    attendedCount,
    fetchSessions,
    markAttendance,
    fetchProfile,
    fetchProgress,
    fetchTrainer,
    fetchDashboard,
  };
};
