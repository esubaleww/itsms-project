import { useState, useCallback } from "react";
import { advisorService } from "../services/advisor.service";
import { useToast } from "../components/ui/Toast";

export const useAdvisor = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [internReports, setInternReports] = useState([]);
  const [internProgress, setInternProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const fetchInterns = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const data = await advisorService.getMyInterns(params);
        setInterns(data.data || []);
        setPagination(data.pagination);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch interns", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const fetchInternReports = useCallback(
    async (internId, params = {}) => {
      setLoading(true);
      try {
        const data = await advisorService.getInternReports(internId, params);
        setInternReports(data.reports || []);
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

  const fetchInternProgress = useCallback(
    async (internId) => {
      setLoading(true);
      try {
        const data = await advisorService.getInternProgress(internId);
        setInternProgress(data);
        setSelectedIntern(data.intern);
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

  const reviewReport = useCallback(
    async (internId, week, feedback, rating) => {
      setLoading(true);
      try {
        const data = await advisorService.reviewReport(
          internId,
          week,
          feedback,
          rating,
        );
        addToast("Report reviewed!", "success");
        await fetchInternReports(internId);
        await fetchInternProgress(internId);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to review report", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchInternReports, fetchInternProgress],
  );

  const submitSummary = useCallback(
    async (internId, summaryData) => {
      setLoading(true);
      try {
        const data = await advisorService.submitSummary(internId, summaryData);
        addToast("Summary submitted!", "success");
        await fetchInternProgress(internId);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to submit summary", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchInternProgress],
  );

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await advisorService.getStats();
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
      const data = await advisorService.getDashboard();
      setInterns(data.interns || []);
      setStats(data.stats);
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
    interns,
    selectedIntern,
    internReports,
    internProgress,
    stats,
    pagination,
    fetchInterns,
    fetchInternReports,
    fetchInternProgress,
    reviewReport,
    submitSummary,
    fetchStats,
    fetchDashboard,
  };
};
