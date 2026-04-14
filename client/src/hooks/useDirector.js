// client/src/hooks/useDirector.js
import { useState, useCallback } from "react";
import { directorService } from "../services/director.service";
import { useToast } from "../components/ui/Toast";

export const useDirector = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [internSummaries, setInternSummaries] = useState([]);
  const [innovatorSummaries, setInnovatorSummaries] = useState([]);
  const [startupSummaries, setStartupSummaries] = useState([]);
  const [traineeSummaries, setTraineeSummaries] = useState([]);
  const [teamReports, setTeamReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);

  // ==================== STATS ====================
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await directorService.getStats();
      setStats(data.stats);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch stats", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ==================== REQUESTS ====================
  const fetchRequests = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const data = await directorService.getRequests(filters);
        setRequests(data.requests || {});
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch requests", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const assignRequestToTeam = useCallback(
    async (requestId, teamId, instructions) => {
      setLoading(true);
      try {
        const data = await directorService.assignToTeam(
          requestId,
          teamId,
          instructions,
        );
        addToast("Request assigned to team successfully!", "success");
        await fetchRequests();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to assign request", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchRequests],
  );

  // ==================== TEAMS ====================
  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await directorService.getTeams();
      setTeams(data.teams || []);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch teams", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const createTeam = useCallback(
    async (teamData) => {
      setLoading(true);
      try {
        const data = await directorService.createTeam(teamData);
        addToast("Team created successfully!", "success");
        await fetchTeams();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to create team", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTeams],
  );

  const deleteTeam = useCallback(
    async (teamId) => {
      setLoading(true);
      try {
        const data = await directorService.deleteTeam(teamId);
        addToast("Team deleted successfully!", "success");
        await fetchTeams();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to delete team", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTeams],
  );

  const assignTeamLead = useCallback(
    async (teamId, staffId) => {
      setLoading(true);
      try {
        const data = await directorService.assignTeamLead(teamId, staffId);
        addToast("Team lead assigned successfully!", "success");
        await fetchTeams();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to assign team lead", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTeams],
  );

  const assignToTeam = useCallback(
    async (teamId, staffId) => {
      setLoading(true);
      try {
        const data = await directorService.assignToTeamMember(teamId, staffId);
        addToast("Staff added to team successfully!", "success");
        await fetchTeams();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to add staff to team", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTeams],
  );

  const removeFromTeam = useCallback(
    async (teamId, staffId) => {
      setLoading(true);
      try {
        const data = await directorService.removeFromTeam(teamId, staffId);
        addToast("Staff removed from team successfully!", "success");
        await fetchTeams();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to remove staff from team", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTeams],
  );

  // ==================== INTERNS ====================
  const fetchInternSummaries = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const response = await directorService.getInternSummaries(params);
        setInternSummaries(response.data.data || []);
        return response;
      } catch (error) {
        addToast(error.message || "Failed to fetch interns", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const assignAdvisor = useCallback(
    async (internId, advisorId) => {
      setLoading(true);
      try {
        const data = await directorService.assignAdvisor(internId, advisorId);
        addToast("Advisor assigned successfully!", "success");
        await fetchInternSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to assign advisor", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchInternSummaries],
  );

  const getInternProgress = useCallback(
    async (internId) => {
      setLoading(true);
      try {
        const data = await directorService.getInternProgress(internId);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch intern progress", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const updateInternStatus = useCallback(
    async (internId, status) => {
      setLoading(true);
      try {
        const data = await directorService.updateInternStatus(internId, status);
        addToast(`Intern status updated to ${status}!`, "success");
        await fetchInternSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update intern status", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchInternSummaries],
  );

  // ==================== INNOVATORS ====================
  const fetchInnovatorSummaries = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const response = await directorService.getInnovatorSummaries(params);
        setInnovatorSummaries(response.data || []);
        return response;
      } catch (error) {
        addToast(error.message || "Failed to fetch innovators", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const assignMentor = useCallback(
    async (innovatorId, mentorId) => {
      setLoading(true);
      try {
        const data = await directorService.assignMentor(innovatorId, mentorId);
        addToast("Mentor assigned successfully!", "success");
        await fetchInnovatorSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to assign mentor", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchInnovatorSummaries],
  );

  const removeInnovatorMentor = useCallback(
    async (innovatorId) => {
      setLoading(true);
      try {
        const data = await directorService.removeInnovatorMentor(innovatorId);
        addToast("Mentor removed successfully!", "success");
        await fetchInnovatorSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to remove mentor", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchInnovatorSummaries],
  );

  const updateInnovatorStatus = useCallback(
    async (innovatorId, status) => {
      setLoading(true);
      try {
        const data = await directorService.updateInnovatorStatus(
          innovatorId,
          status,
        );
        addToast(`Innovator status updated to ${status}!`, "success");
        await fetchInnovatorSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update status", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchInnovatorSummaries],
  );

  const getInnovatorProgress = useCallback(
    async (innovatorId) => {
      setLoading(true);
      try {
        const data = await directorService.getInnovatorProgress(innovatorId);
        return data;
      } catch (error) {
        addToast(
          error.message || "Failed to fetch innovator progress",
          "error",
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  // ==================== STARTUPS ====================
  const fetchStartupSummaries = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const response = await directorService.getStartupSummaries(params);
        setStartupSummaries(response.data || []);
        return response;
      } catch (error) {
        addToast(error.message || "Failed to fetch startups", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const assignStartupMentor = useCallback(
    async (startupId, mentorId) => {
      setLoading(true);
      try {
        const data = await directorService.assignStartupMentor(
          startupId,
          mentorId,
        );
        addToast("Mentor assigned successfully!", "success");
        await fetchStartupSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to assign mentor", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchStartupSummaries],
  );

  const removeStartupMentor = useCallback(
    async (startupId) => {
      setLoading(true);
      try {
        const data = await directorService.removeStartupMentor(startupId);
        addToast("Mentor removed successfully!", "success");
        await fetchStartupSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to remove mentor", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchStartupSummaries],
  );

  const updateStartupStatus = useCallback(
    async (startupId, status) => {
      setLoading(true);
      try {
        const data = await directorService.updateStartupStatus(
          startupId,
          status,
        );
        addToast(`Startup status updated to ${status}!`, "success");
        await fetchStartupSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update status", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchStartupSummaries],
  );

  const getStartupProgress = useCallback(
    async (startupId) => {
      setLoading(true);
      try {
        const data = await directorService.getStartupProgress(startupId);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch startup progress", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  // ==================== TRAINEES ====================
  const fetchTraineeSummaries = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const response = await directorService.getTraineeSummaries(params);
        setTraineeSummaries(response.data || []);
        return response;
      } catch (error) {
        addToast(error.message || "Failed to fetch trainees", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const assignTrainer = useCallback(
    async (traineeId, trainerId) => {
      setLoading(true);
      try {
        const data = await directorService.assignTrainer(traineeId, trainerId);
        addToast("Trainer assigned successfully!", "success");
        await fetchTraineeSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to assign trainer", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTraineeSummaries],
  );

  const removeTrainer = useCallback(
    async (traineeId) => {
      setLoading(true);
      try {
        const data = await directorService.removeTrainer(traineeId);
        addToast("Trainer removed successfully!", "success");
        await fetchTraineeSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to remove trainer", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTraineeSummaries],
  );

  const updateTraineeStatus = useCallback(
    async (traineeId, status) => {
      setLoading(true);
      try {
        const data = await directorService.updateTraineeStatus(
          traineeId,
          status,
        );
        addToast(`Trainee status updated to ${status}!`, "success");
        await fetchTraineeSummaries();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to update status", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTraineeSummaries],
  );

  const getTraineeProgress = useCallback(
    async (traineeId) => {
      setLoading(true);
      try {
        const data = await directorService.getTraineeProgress(traineeId);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch trainee progress", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const getTraineeSessions = useCallback(
    async (traineeId) => {
      setLoading(true);
      try {
        const data = await directorService.getTraineeSessions(traineeId);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch trainee sessions", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  // ==================== REPORTS ====================
  const fetchTeamReports = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const data = await directorService.getTeamReports(filters);
        setTeamReports(data.reports || []);
        return data;
      } catch (error) {
        addToast(error.message || "Failed to fetch team reports", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const reviewReport = useCallback(
    async (reportId, feedback, status = "reviewed") => {
      setLoading(true);
      try {
        const data = await directorService.reviewTeamReport(
          reportId,
          feedback,
          status,
        );
        addToast("Report reviewed successfully!", "success");
        await fetchTeamReports();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to review report", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTeamReports],
  );

  const approveReport = useCallback(
    async (reportId, comments) => {
      setLoading(true);
      try {
        const data = await directorService.approveTeamReport(
          reportId,
          comments,
        );
        addToast("Report approved successfully!", "success");
        await fetchTeamReports();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to approve report", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTeamReports],
  );

  const rejectReport = useCallback(
    async (reportId, reason) => {
      setLoading(true);
      try {
        const data = await directorService.rejectTeamReport(reportId, reason);
        addToast("Report rejected", "warning");
        await fetchTeamReports();
        return data;
      } catch (error) {
        addToast(error.message || "Failed to reject report", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchTeamReports],
  );

  // ==================== DIRECTOR REPORTS ====================
  // Define fetchMyDirectorReports FIRST before using it in createDirectorReport
  const fetchMyDirectorReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await directorService.getMyDirectorReports();
      setMyReports(data.reports || []);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch reports", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Now createDirectorReport can safely reference fetchMyDirectorReports
  const createDirectorReport = useCallback(
    async (reportData) => {
      setLoading(true);
      try {
        const data = await directorService.createDirectorReport(reportData);
        addToast("Report submitted successfully!", "success");
        await fetchMyDirectorReports(); // This is now defined
        return data;
      } catch (error) {
        addToast(error.message || "Failed to submit report", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addToast, fetchMyDirectorReports], // fetchMyDirectorReports is now defined
  );

  // ==================== AVAILABLE STAFF ====================
  const fetchAvailableStaff = useCallback(async () => {
    setLoading(true);
    try {
      const data = await directorService.getAvailableStaff();
      setAvailableStaff(data.staff || []);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch staff", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ==================== INITIAL LOAD ====================
  const fetchAll = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchRequests(),
      fetchTeams(),
      fetchInternSummaries(),
      fetchInnovatorSummaries(),
      fetchStartupSummaries(),
      fetchTraineeSummaries(),
      fetchTeamReports(),
      fetchMyDirectorReports(),
      fetchAvailableStaff(),
    ]);
  }, [
    fetchStats,
    fetchRequests,
    fetchTeams,
    fetchInternSummaries,
    fetchInnovatorSummaries,
    fetchStartupSummaries,
    fetchTraineeSummaries,
    fetchTeamReports,
    fetchMyDirectorReports,
    fetchAvailableStaff,
  ]);

  return {
    // Data
    loading,
    stats,
    requests,
    teams,
    currentTeam,
    internSummaries,
    innovatorSummaries,
    startupSummaries,
    traineeSummaries,
    teamReports,
    myReports,
    availableStaff,

    // Actions
    fetchAll,
    fetchStats,
    fetchRequests,
    fetchTeams,
    fetchInternSummaries,
    fetchInnovatorSummaries,
    fetchStartupSummaries,
    fetchTraineeSummaries,
    fetchTeamReports,
    fetchMyDirectorReports,
    fetchAvailableStaff,

    // Team Management
    createTeam,
    deleteTeam,
    assignTeamLead,
    assignToTeam,
    removeFromTeam,

    // Request Management
    assignRequestToTeam,

    // Intern Management
    assignAdvisor,
    getInternProgress,
    updateInternStatus,

    // Innovator Management
    assignMentor,
    removeInnovatorMentor,
    updateInnovatorStatus,
    getInnovatorProgress,

    // Startup Management
    assignStartupMentor,
    removeStartupMentor,
    updateStartupStatus,
    getStartupProgress,

    // Trainee Management
    assignTrainer,
    removeTrainer,
    updateTraineeStatus,
    getTraineeProgress,
    getTraineeSessions,

    // Report Management
    reviewReport,
    approveReport,
    rejectReport,
    createDirectorReport,
  };
};
