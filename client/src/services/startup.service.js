// client/src/services/startup.service.js
import API from "./api";

export const startupService = {
  // Milestones
  getMilestones: async () => {
    const response = await API.get("/startup/milestones");
    return response.data;
  },
  updateMilestoneStatus: async (milestoneId, status) => {
    const response = await API.put(
      `/startup/milestones/${milestoneId}/status`,
      { status },
    );
    return response.data;
  },

  // Profile & Progress
  getProfile: async () => {
    const response = await API.get("/startup/profile");
    return response.data;
  },
  getProgress: async () => {
    const response = await API.get("/startup/progress");
    return response.data;
  },
  getMentor: async () => {
    const response = await API.get("/startup/mentor");
    return response.data;
  },
  getDocuments: async () => {
    const response = await API.get("/startup/documents");
    return response.data;
  },

  // Founders
  updateFounders: async (founders) => {
    const response = await API.put("/startup/founders", { founders });
    return response.data;
  },
  addFounder: async (founderData) => {
    const response = await API.post("/startup/founders", founderData);
    return response.data;
  },
  removeFounder: async (founderId) => {
    const response = await API.delete(`/startup/founders/${founderId}`);
    return response.data;
  },

  // Dashboard
  getDashboard: async () => {
    const response = await API.get("/startup/dashboard");
    return response.data;
  },
};
