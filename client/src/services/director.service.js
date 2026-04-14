// client/src/services/director.service.js
import API from "./api";

export const directorService = {
  // ==================== STATS & REQUESTS ====================
  getStats: async () => {
    const response = await API.get("/director/stats");
    return response.data;
  },

  getRequests: async (filters = {}) => {
    let url = "/director/requests";
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.type) params.append("type", filters.type);
    if (Object.keys(params).length) url += `?${params.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await API.get(`/director/requests/${id}`);
    return response.data;
  },

  assignToTeam: async (requestId, teamId, instructions) => {
    const response = await API.post(
      `/director/requests/${requestId}/assign-team`,
      {
        teamId,
        instructions,
      },
    );
    return response.data;
  },

  // ==================== TEAMS ====================
  createTeam: async (data) => {
    const response = await API.post("/director/teams", data);
    return response.data;
  },

  getTeams: async () => {
    const response = await API.get("/director/teams");
    return response.data;
  },

  getTeamById: async (teamId) => {
    const response = await API.get(`/director/teams/${teamId}`);
    return response.data;
  },

  updateTeam: async (teamId, data) => {
    const response = await API.put(`/director/teams/${teamId}`, data);
    return response.data;
  },

  deleteTeam: async (teamId) => {
    const response = await API.delete(`/director/teams/${teamId}`);
    return response.data;
  },

  assignTeamLead: async (teamId, staffId) => {
    const response = await API.post(`/director/teams/${teamId}/lead`, {
      staffId,
    });
    return response.data;
  },

  assignToTeamMember: async (teamId, staffId) => {
    const response = await API.post(`/director/teams/${teamId}/members`, {
      staffId,
    });
    return response.data;
  },

  removeFromTeam: async (teamId, staffId) => {
    const response = await API.delete(
      `/director/teams/${teamId}/members/${staffId}`,
    );
    return response.data;
  },

  // ==================== AVAILABLE STAFF ====================
  getAvailableStaff: async () => {
    const response = await API.get("/director/staff/available");
    return response.data;
  },

  // ==================== INTERNS ====================
  getInternSummaries: async (params = {}) => {
    let url = "/director/interns";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  assignAdvisor: async (internId, advisorId) => {
    const response = await API.post(
      `/director/interns/${internId}/assign-advisor`,
      { advisorId },
    );
    return response.data;
  },

  getInternProgress: async (internId) => {
    const response = await API.get(`/director/interns/${internId}/progress`);
    return response.data;
  },

  updateInternStatus: async (internId, status) => {
    const response = await API.patch(`/director/interns/${internId}/status`, {
      status,
    });
    return response.data;
  },

  // ==================== INNOVATORS ====================
  getInnovatorSummaries: async (params = {}) => {
    let url = "/director/innovators";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  assignMentor: async (innovatorId, mentorId) => {
    const response = await API.post(
      `/director/innovators/${innovatorId}/mentor`,
      { mentorId },
    );
    return response.data;
  },

  getInnovatorProgress: async (innovatorId) => {
    const response = await API.get(
      `/director/innovators/${innovatorId}/progress`,
    );
    return response.data;
  },

  removeInnovatorMentor: async (innovatorId) => {
    const response = await API.delete(
      `/director/innovators/${innovatorId}/mentor`,
    );
    return response.data;
  },

  updateInnovatorStatus: async (innovatorId, status) => {
    const response = await API.patch(
      `/director/innovators/${innovatorId}/status`,
      { status },
    );
    return response.data;
  },

  // ==================== STARTUPS ====================
  getStartupSummaries: async (params = {}) => {
    let url = "/director/startups";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  getStartupProgress: async (startupId) => {
    const response = await API.get(`/director/startups/${startupId}/progress`);
    return response.data;
  },

  assignStartupMentor: async (startupId, mentorId) => {
    const response = await API.post(`/director/startups/${startupId}/mentor`, {
      mentorId,
    });
    return response.data;
  },

  removeStartupMentor: async (startupId) => {
    const response = await API.delete(`/director/startups/${startupId}/mentor`);
    return response.data;
  },

  updateStartupStatus: async (startupId, status) => {
    const response = await API.patch(`/director/startups/${startupId}/status`, {
      status,
    });
    return response.data;
  },

  // ==================== TRAINEES ====================
  getTraineeSummaries: async (params = {}) => {
    let url = "/director/trainees";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  getTraineeProgress: async (traineeId) => {
    const response = await API.get(`/director/trainees/${traineeId}/progress`);
    return response.data;
  },

  getTraineeSessions: async (traineeId) => {
    const response = await API.get(`/director/trainees/${traineeId}/sessions`);
    return response.data;
  },

  assignTrainer: async (traineeId, trainerId) => {
    const response = await API.post(`/director/trainees/${traineeId}/trainer`, {
      trainerId,
    });
    return response.data;
  },

  removeTrainer: async (traineeId) => {
    const response = await API.delete(
      `/director/trainees/${traineeId}/trainer`,
    );
    return response.data;
  },

  updateTraineeStatus: async (traineeId, status) => {
    const response = await API.patch(`/director/trainees/${traineeId}/status`, {
      status,
    });
    return response.data;
  },

  // ==================== REPORTS ====================
  getTeamReports: async (filters = {}) => {
    let url = "/director/team-reports";
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.teamId) params.append("teamId", filters.teamId);
    if (Object.keys(params).length) url += `?${params.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  getReportById: async (reportId) => {
    const response = await API.get(`/director/team-reports/${reportId}`);
    return response.data;
  },

  reviewTeamReport: async (reportId, feedback, status) => {
    const response = await API.put(
      `/director/team-reports/${reportId}/review`,
      {
        feedback,
        status,
      },
    );
    return response.data;
  },

  approveTeamReport: async (reportId, comments) => {
    const response = await API.put(
      `/director/team-reports/${reportId}/approve`,
      {
        comments,
      },
    );
    return response.data;
  },

  rejectTeamReport: async (reportId, reason) => {
    const response = await API.put(
      `/director/team-reports/${reportId}/reject`,
      {
        reason,
      },
    );
    return response.data;
  },

  createDirectorReport: async (data) => {
    const response = await API.post("/director/my-reports", data);
    return response.data;
  },

  getMyDirectorReports: async () => {
    const response = await API.get("/director/my-reports");
    return response.data;
  },

  // ==================== ANALYTICS ====================
  getAnalytics: async () => {
    const response = await API.get("/director/analytics");
    return response.data;
  },

  getWeeklyActivity: async () => {
    const response = await API.get("/director/analytics/weekly");
    return response.data;
  },

  getRequestDistribution: async () => {
    const response = await API.get("/director/analytics/request-distribution");
    return response.data;
  },

  getStatusDistribution: async () => {
    const response = await API.get("/director/analytics/status-distribution");
    return response.data;
  },

  getTeamPerformance: async () => {
    const response = await API.get("/director/analytics/teams");
    return response.data;
  },

  // ==================== EXPORT ====================
  exportData: async ({ format, type, dateRange, directorId }) => {
    const response = await API.post(
      "/director/export",
      { format, type, dateRange, directorId },
      { responseType: "blob" },
    );
    return response.data;
  },
};
