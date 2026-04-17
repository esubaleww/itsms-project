import API from "./api";

export const traineeService = {
  getSessions: async () => {
    const response = await API.get("/trainee/sessions");
    return response.data;
  },
  markAttendance: async (sessionId) => {
    const response = await API.post(
      `/trainee/sessions/${sessionId}/attendance`,
    );
    return response.data;
  },
  getCertificates: async () => {
    const response = await API.get("/trainee/certificates");
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get("/trainee/profile");
    return response.data;
  },
  getProgress: async () => {
    const response = await API.get("/trainee/progress");
    return response.data;
  },
  getTrainer: async () => {
    const response = await API.get("/trainee/trainer");
    return response.data;
  },

  getDashboard: async () => {
    const response = await API.get("/trainee/dashboard");
    return response.data;
  },
};
