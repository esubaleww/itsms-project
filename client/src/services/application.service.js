import API from "./api";

export const applicationService = {
  submitIntern: async (data) => {
    const response = await API.post("/applications/apply/internship", data);
    return response.data;
  },

  submitInnovator: async (data) => {
    const response = await API.post("/applications/apply/innovation", data);
    return response.data;
  },

  submitStartup: async (data) => {
    const response = await API.post("/applications/apply/startup", data);
    return response.data;
  },
  submitTraining: async (data) => {
    const response = await API.post("/applications/apply/training", data);
    return response.data;
  },
  applyForService: async (data) => {
    const response = await API.post("/applications/apply/service", data);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await API.get("/applications/my");
    return response.data;
  },

  getApplicationStatus: async () => {
    const response = await API.get("/applications/status");
    return response.data;
  },
};
