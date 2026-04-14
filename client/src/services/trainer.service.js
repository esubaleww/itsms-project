// client/src/services/trainer.service.js
import API from "./api";

export const trainerService = {
  // Trainees Management
  getMyTrainees: async (params = {}) => {
    let url = "/staff/trainer/trainees";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },
  getTraineeProgress: async (traineeId) => {
    const response = await API.get(
      `/staff/trainer/trainees/${traineeId}/progress`,
    );
    return response.data;
  },
  createSession: async (traineeId, sessionData) => {
    const response = await API.post(
      `/staff/trainer/trainees/${traineeId}/sessions`,
      sessionData,
    );
    return response.data;
  },
  recordAttendance: async (sessionId, traineeId) => {
    const response = await API.post(
      `/staff/trainer/sessions/${sessionId}/attendance`,
      { traineeId },
    );
    return response.data;
  },
  generateCertificate: async (traineeId, sessionId) => {
    const response = await API.post(
      `/staff/trainer/trainees/${traineeId}/sessions/${sessionId}/certificate`,
    );
    return response.data;
  },

  // Dashboard & Stats
  getDashboard: async () => {
    const response = await API.get("/staff/trainer/dashboard");
    return response.data;
  },
  getStats: async () => {
    const response = await API.get("/staff/trainer/stats");
    return response.data;
  },
};
