// client/src/hooks/useMentor.js
import { useState, useCallback } from "react";
import { mentorService } from "../services/mentor.service";
import { useToast } from "../components/ui/Toast";

export const useMentor = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [innovators, setInnovators] = useState([]);
  const [startups, setStartups] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [menteeProgress, setMenteeProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const fetchInnovators = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const data = await mentorService.getMyInnovators(params);
        setInnovators(data.data || []);
        setPagination(data.pagination);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch innovators", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const fetchStartups = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const data = await mentorService.getMyStartups(params);
        setStartups(data.data || []);
        setPagination(data.pagination);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch startups", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const fetchMenteeProgress = useCallback(
    async (menteeId, type) => {
      setLoading(true);
      try {
        let data;
        if (type === "innovator") {
          data = await mentorService.getInnovatorProgress(menteeId);
        } else {
          data = await mentorService.getStartupProgress(menteeId);
        }
        setMenteeProgress(data);
        setSelectedMentee(data.mentee);
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

  const addMilestone = useCallback(
    async (menteeId, type, milestoneData) => {
      setLoading(true);
      try {
        let data;
        if (type === "innovator") {
          data = await mentorService.addInnovatorMilestone(
            menteeId,
            milestoneData,
          );
        } else {
          data = await mentorService.addStartupMilestone(
            menteeId,
            milestoneData,
          );
        }
        addToast("Milestone added!", "success");
        await fetchMenteeProgress(menteeId, type);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to add milestone", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchMenteeProgress],
  );

  const reviewMilestone = useCallback(
    async (menteeId, milestoneId, type, status, feedback) => {
      setLoading(true);
      try {
        let data;
        if (type === "innovator") {
          data = await mentorService.reviewInnovatorMilestone(
            menteeId,
            milestoneId,
            status,
            feedback,
          );
        } else {
          data = await mentorService.reviewStartupMilestone(
            menteeId,
            milestoneId,
            status,
            feedback,
          );
        }
        addToast(`Milestone marked as ${status}!`, "success");
        await fetchMenteeProgress(menteeId, type);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to review milestone", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchMenteeProgress],
  );

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mentorService.getStats();
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
      const data = await mentorService.getDashboard();
      setStats(data.stats);
      setInnovators(data.recentInnovators || []);
      setStartups(data.recentStartups || []);
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
    innovators,
    startups,
    selectedMentee,
    menteeProgress,
    stats,
    pagination,
    fetchInnovators,
    fetchStartups,
    fetchMenteeProgress,
    addMilestone,
    reviewMilestone,
    fetchStats,
    fetchDashboard,
  };
};
