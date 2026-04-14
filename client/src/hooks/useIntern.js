import { useState, useCallback } from "react";
import { internService } from "../services/intern.service";
import { useToast } from "../components/ui/Toast";

export const useIntern = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [advisor, setAdvisor] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await internService.getMyReports();
      setReports(data.reports || []);
      setStats(data.stats);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch reports", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const submitReport = useCallback(
    async (reportData) => {
      setLoading(true);
      try {
        const data = await internService.submitReport(reportData);
        addToast("Report submitted successfully!", "success");
        await fetchReports();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to submit report", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchReports],
  );

  const updateReport = useCallback(
    async (week, reportData) => {
      setLoading(true);
      try {
        const data = await internService.updateReport(week, reportData);
        addToast("Report updated successfully!", "success");
        await fetchReports();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update report", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchReports],
  );

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await internService.getProfile();
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
      const data = await internService.getProgress();
      setProgress(data.stats);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch progress", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchAdvisor = useCallback(async () => {
    setLoading(true);
    try {
      const data = await internService.getAdvisor();
      setAdvisor(data.advisor);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch advisor", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await internService.getDashboard();
      setProfile(data.profile);
      setProgress(data.progress);
      setReports(data.recentReports);
      setAdvisor(data.advisor);
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
    reports,
    profile,
    progress,
    advisor,
    stats,
    fetchReports,
    submitReport,
    updateReport,
    fetchProfile,
    fetchProgress,
    fetchAdvisor,
    fetchDashboard,
  };
};
