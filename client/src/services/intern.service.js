import API from "./api";

export const internService = {
  getMyReports: async () => {
    const response = await API.get("/intern/reports");
    return response.data;
  },
  submitReport: async (data) => {
    const response = await API.post("/intern/reports", data);
    return response.data;
  },
  getReportByWeek: async (week) => {
    const response = await API.get(`/intern/reports/${week}`);
    return response.data;
  },
  updateReport: async (week, data) => {
    const response = await API.put(`/intern/reports/${week}`, data);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get("/intern/profile");
    return response.data;
  },
  getProgress: async () => {
    const response = await API.get("/intern/progress");
    return response.data;
  },
  getAdvisor: async () => {
    const response = await API.get("/intern/advisor");
    return response.data;
  },

  getDashboard: async () => {
    const response = await API.get("/intern/dashboard");
    return response.data;
  },
};
