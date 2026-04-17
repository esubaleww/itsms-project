import API from "./api";

export const requestService = {
  getMyRequests: async () => {
    try {
      const response = await API.get("/requests/my");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch requests" };
    }
  },

  getStats: async () => {
    try {
      const response = await API.get("/requests/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch stats" };
    }
  },

  createRequest: async (requestData) => {
    try {
      const response = await API.post("/requests", requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create request" };
    }
  },

  getRequestById: async (id) => {
    try {
      const response = await API.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch request" };
    }
  },

  updateStatus: async (id, data) => {
    try {
      const response = await API.put(`/requests/${id}/status`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update request" };
    }
  },

  cancelRequest: async (id) => {
    try {
      const response = await API.put(`/requests/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to cancel request" };
    }
  },

  submitFeedback: async (id, feedback) => {
    try {
      const response = await API.post(`/requests/${id}/feedback`, feedback);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to submit feedback" };
    }
  },
};
