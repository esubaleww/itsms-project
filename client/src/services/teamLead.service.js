import API from "./api";

export const teamLeadApi = {
  // Team Management
  getMyTeam: async () => {
    const response = await API.get("/team-lead/team");
    return response.data;
  },

  getTeamMembers: async () => {
    const response = await API.get("/team-lead/members");
    return response.data;
  },

  // Task Management
  getTeamTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await API.get(
      `/team-lead/tasks${params ? `?${params}` : ""}`,
    );
    return response.data;
  },

  getTaskById: async (taskId) => {
    const response = await API.get(`/team-lead/tasks/${taskId}`);
    return response.data;
  },

  assignTask: async (taskId, memberId, instructions) => {
    const response = await API.post(`/team-lead/tasks/${taskId}/assign`, {
      memberId,
      instructions,
    });
    return response.data;
  },

  updateTaskStatus: async (taskId, taskIndex, status, notes) => {
    const response = await API.put(
      `/team-lead/tasks/${taskId}/${taskIndex}/status`,
      { status, notes },
    );
    return response.data;
  },

  // Progress
  getTeamProgress: async () => {
    const response = await API.get("/team-lead/progress");
    return response.data;
  },

  // Staff Request
  requestStaff: async (data) => {
    const response = await API.post("/team-lead/request-staff", data);
    return response.data;
  },

  getTeamReports: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await API.get(
      `/team-lead/reports${params ? `?${params}` : ""}`,
    );
    return response.data;
  },

  getMyReports: async () => {
    const response = await API.get("/team-lead/reports/my");
    return response.data;
  },

  getReportById: async (reportId) => {
    const response = await API.get(`/team-lead/reports/${reportId}`);
    return response.data;
  },

  submitTeamReport: async (data) => {
    const response = await API.post("/team-lead/reports", data);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await API.get("/team-lead/analytics");
    return response.data;
  },

  getWeeklyActivity: async () => {
    const response = await API.get("/team-lead/analytics/weekly");
    return response.data;
  },

  getTeamPerformance: async () => {
    const response = await API.get("/team-lead/analytics/performance");
    return response.data;
  },

  getMemberPerformance: async () => {
    const response = await API.get("/team-lead/analytics/members");
    return response.data;
  },
  exportData: async ({ format, type, dateRange }) => {
    const response = await API.post(
      "/team-lead/export",
      { format, type, dateRange },
      { responseType: "blob" },
    );
    return response.data;
  },
};
