// client/src/hooks/useInnovator.js
import { useState, useCallback } from "react";
import { innovatorService } from "../services/innovator.service";
import { useToast } from "../components/ui/Toast";

export const useInnovator = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [milestoneStats, setMilestoneStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [currentStage, setCurrentStage] = useState("idea");

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    try {
      const data = await innovatorService.getMilestones();
      setMilestones(data.milestones || []);
      setMilestoneStats(data.stats);
      setCurrentStage(data.currentStage);
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
        const data = await innovatorService.updateMilestoneStatus(
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
      const data = await innovatorService.getProfile();
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
      const data = await innovatorService.getProgress();
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
      const data = await innovatorService.getMentor();
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
      const data = await innovatorService.getDocuments();
      setDocuments(data.documents);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch documents", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await innovatorService.getDashboard();
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
    currentStage,
    fetchMilestones,
    updateMilestoneStatus,
    fetchProfile,
    fetchProgress,
    fetchMentor,
    fetchDocuments,
    fetchDashboard,
  };
};
