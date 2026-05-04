import API from "./api";

export const trainerService = {
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

  createSession: async (sessionData) => {
    const response = await API.post("/staff/trainer/sessions", sessionData);
    return response.data;
  },

  submitTrainerSummary: async (traineeId, summaryData) => {
    const response = await API.post(
      `/staff/trainer/trainees/${traineeId}/summary`,
      summaryData,
    );
    return response.data;
  },

  updateTraineeStatus: async (traineeId, status) => {
    const response = await API.patch(
      `/staff/trainer/trainees/${traineeId}/status`,
      { status },
    );
    return response.data;
  },

  getDashboard: async () => {
    const response = await API.get("/staff/trainer/dashboard");
    return response.data;
  },

  getStats: async () => {
    const response = await API.get("/staff/trainer/stats");
    return response.data;
  },

  getSessions: async () => {
    const response = await API.get("/staff/trainer/sessions");
    return response.data;
  },

  getSessionAttendance: async (sessionId) => {
    const response = await API.get(
      `/staff/trainer/sessions/${sessionId}/attendance`,
    );
    return response.data;
  },
};
