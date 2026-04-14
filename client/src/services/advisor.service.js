// client/src/services/advisor.service.js
import API from "./api";

export const advisorService = {
  // Interns Management
  getMyInterns: async (params = {}) => {
    let url = "/staff/advisor/interns";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },
  getInternReports: async (internId, params = {}) => {
    let url = `/staff/advisor/interns/${internId}/reports`;
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },
  getInternProgress: async (internId) => {
    const response = await API.get(
      `/staff/advisor/interns/${internId}/progress`,
    );
    return response.data;
  },
  reviewReport: async (internId, week, feedback, rating) => {
    const response = await API.put(
      `/staff/advisor/interns/${internId}/reports/${week}/review`,
      {
        feedback,
        rating,
      },
    );
    return response.data;
  },
  submitSummary: async (internId, data) => {
    const response = await API.post(
      `/staff/advisor/interns/${internId}/summary`,
      data,
    );
    return response.data;
  },

  // Dashboard & Stats
  getDashboard: async () => {
    const response = await API.get("/staff/advisor/dashboard");
    return response.data;
  },
  getStats: async () => {
    const response = await API.get("/staff/advisor/stats");
    return response.data;
  },
};
