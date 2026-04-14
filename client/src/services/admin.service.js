// client/src/services/admin.service.js
import API from "./api";

export const adminService = {
  // ========================
  // REQUEST MANAGEMENT
  // ========================
  getPendingRequests: async () => {
    const response = await API.get("/admin/pending-requests");
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await API.get(`/admin/requests/${id}`);
    return response.data;
  },

  approveRequest: async (id, comments) => {
    const response = await API.post(`/admin/requests/${id}/approve`, {
      comments,
    });
    return response.data;
  },

  rejectRequest: async (id, reason) => {
    const response = await API.post(`/admin/requests/${id}/reject`, { reason });
    return response.data;
  },

  // ========================
  // STATS
  // ========================
  getStats: async () => {
    const response = await API.get("/admin/stats");
    return response.data;
  },

  // ========================
  // DIRECTORATE MANAGEMENT
  // ========================
  createDirectorate: async (data) => {
    const response = await API.post("/admin/directorates", data);
    return response.data;
  },

  getDirectorates: async () => {
    const response = await API.get("/admin/directorates");
    return response.data;
  },

  getDirectorateById: async (id) => {
    const response = await API.get(`/admin/directorates/${id}`);
    return response.data;
  },

  updateDirectorate: async (id, data) => {
    const response = await API.put(`/admin/directorates/${id}`, data);
    return response.data;
  },

  deleteDirectorate: async (id) => {
    const response = await API.delete(`/admin/directorates/${id}`);
    return response.data;
  },

  // ========================
  // STAFF MANAGEMENT
  // ========================
  createStaff: async (data) => {
    const response = await API.post("/admin/staff", data);
    return response.data;
  },

  getStaff: async () => {
    const response = await API.get("/admin/staff");
    return response.data;
  },

  updateStaff: async (id, data) => {
    const response = await API.put(`/admin/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id) => {
    const response = await API.delete(`/admin/staff/${id}`);
    return response.data;
  },

  resetStaffPassword: async (id) => {
    const response = await API.post(`/admin/staff/${id}/reset-password`);
    return response.data;
  },

  // ========================
  // REPORT MANAGEMENT
  // ========================
  getDirectorReports: async (filters = {}) => {
    let url = "/admin/director-reports";
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.directorateId)
      params.append("directorateId", filters.directorateId);
    if (Object.keys(params).length) url += `?${params.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  getDirectorReportById: async (id) => {
    const response = await API.get(`/admin/director-reports/${id}`);
    return response.data;
  },

  reviewDirectorReport: async (id, feedback, status) => {
    const response = await API.put(`/admin/director-reports/${id}/review`, {
      feedback,
      status,
    });
    return response.data;
  },

  approveDirectorReport: async (id, comments) => {
    const response = await API.put(`/admin/director-reports/${id}/approve`, {
      comments,
    });
    return response.data;
  },

  rejectDirectorReport: async (id, reason) => {
    const response = await API.put(`/admin/director-reports/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  // ========================
  // ANNOUNCEMENT MANAGEMENT
  // ========================
  createAnnouncement: async (data) => {
    const response = await API.post("/admin/announcements", data);
    return response.data;
  },

  getAnnouncements: async () => {
    const response = await API.get("/admin/announcements");
    return response.data;
  },

  updateAnnouncement: async (id, data) => {
    const response = await API.put(`/admin/announcements/${id}`, data);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await API.delete(`/admin/announcements/${id}`);
    return response.data;
  },

  // ========================
  // USER MANAGEMENT (NEW)
  // ========================
  getUsers: async (filters = {}) => {
    let url = "/admin/users";
    const params = new URLSearchParams();
    if (filters.role) params.append("role", filters.role);
    if (filters.verified) params.append("verified", filters.verified);
    if (filters.search) params.append("search", filters.search);
    if (Object.keys(params).length) url += `?${params.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await API.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await API.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  },

  resendVerification: async (userId) => {
    const response = await API.post(
      `/admin/users/${userId}/resend-verification`,
    );
    return response.data;
  },

  // ========================
  // AUDIT LOGS (NEW)
  // ========================
  getAuditLogs: async (filters = {}) => {
    let url = "/admin/audit-logs";
    const params = new URLSearchParams();
    if (filters.action) params.append("action", filters.action);
    if (filters.entity) params.append("entity", filters.entity);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.limit) params.append("limit", filters.limit);
    if (Object.keys(params).length) url += `?${params.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  // ========================
  // SYSTEM SETTINGS (NEW)
  // ========================
  getSettings: async () => {
    const response = await API.get("/admin/settings");
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await API.put("/admin/settings", settings);
    return response.data;
  },

  // ========================
  // EXPORT DATA (NEW)
  // ========================
  exportData: async ({ format, type, dateRange }) => {
    const response = await API.post(
      "/admin/export",
      { format, type, dateRange },
      { responseType: "blob" },
    );
    return response.data;
  },
};
