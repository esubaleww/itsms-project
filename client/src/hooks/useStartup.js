// client/src/hooks/useStartup.js
import { useState, useCallback } from "react";
import { startupService } from "../services/startup.service";
import { useToast } from "../components/ui/Toast";

export const useStartup = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [milestoneStats, setMilestoneStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [founders, setFounders] = useState([]);

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    try {
      const data = await startupService.getMilestones();
      setMilestones(data.milestones || []);
      setMilestoneStats(data.stats);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch milestones", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const updateMilestoneStatus = useCallback(
    async (milestoneId, status) => {
      setLoading(true);
      try {
        const data = await startupService.updateMilestoneStatus(
          milestoneId,
          status,
        );
        addToast(data.message || "Milestone updated!", "success");
        await fetchMilestones();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update milestone", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchMilestones],
  );

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await startupService.getProfile();
      setProfile(data.profile);
      setFounders(data.profile?.founders || []);
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
      const data = await startupService.getProgress();
      setProgress(data.stats);
      setMilestones(data.milestones);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch progress", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchMentor = useCallback(async () => {
    setLoading(true);
    try {
      const data = await startupService.getMentor();
      setMentor(data.mentor);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch mentor", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await startupService.getDocuments();
      setDocuments(data.documents);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch documents", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const updateFounders = useCallback(
    async (newFounders) => {
      setLoading(true);
      try {
        const data = await startupService.updateFounders(newFounders);
        setFounders(data.founders);
        addToast("Founders updated!", "success");
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update founders", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const addFounder = useCallback(
    async (founderData) => {
      setLoading(true);
      try {
        const data = await startupService.addFounder(founderData);
        setFounders(data.founders);
        addToast("Founder added!", "success");
        return data;
      } catch (error) {
        addToast(error.message || "Failed to add founder", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const removeFounder = useCallback(
    async (founderId) => {
      setLoading(true);
      try {
        const data = await startupService.removeFounder(founderId);
        setFounders(data.founders);
        addToast("Founder removed!", "success");
        return data;
      } catch (error) {
        addToast(error.message || "Failed to remove founder", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await startupService.getDashboard();
      setProfile(data.profile);
      setProgress(data.progress);
      setMilestones(data.milestones);
      setMentor(data.mentor);
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
    milestones,
    milestoneStats,
    profile,
    progress,
    mentor,
    documents,
    founders,
    fetchMilestones,
    updateMilestoneStatus,
    fetchProfile,
    fetchProgress,
    fetchMentor,
    fetchDocuments,
    updateFounders,
    addFounder,
    removeFounder,
    fetchDashboard,
  };
};
