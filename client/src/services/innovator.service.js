// client/src/services/innovator.service.js
import API from "./api";

export const innovatorService = {
  // Milestones
  getMilestones: async () => {
    const response = await API.get("/innovator/milestones");
    return response.data;
  },
  updateMilestoneStatus: async (milestoneId, status) => {
    const response = await API.put(
      `/innovator/milestones/${milestoneId}/status`,
      { status },
    );
    return response.data;
  },

  // Profile & Progress
  getProfile: async () => {
    const response = await API.get("/innovator/profile");
    return response.data;
  },
  getProgress: async () => {
    const response = await API.get("/innovator/progress");
    return response.data;
  },
  getMentor: async () => {
    const response = await API.get("/innovator/mentor");
    return response.data;
  },
  getDocuments: async () => {
    const response = await API.get("/innovator/documents");
    return response.data;
  },

  // Dashboard
  getDashboard: async () => {
    const response = await API.get("/innovator/dashboard");
    return response.data;
  },
};
