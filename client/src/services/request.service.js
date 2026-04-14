import API from "./api";

export const requestService = {
  // Get all requests for current user
  getMyRequests: async () => {
    try {
      const response = await API.get("/requests/my");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch requests" };
    }
  },

  // Get request statistics
  getStats: async () => {
    try {
      const response = await API.get("/requests/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch stats" };
    }
  },

  // Create a new request
  createRequest: async (requestData) => {
    try {
      const response = await API.post("/requests", requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create request" };
    }
  },

  // Get single request by ID
  getRequestById: async (id) => {
    try {
      const response = await API.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch request" };
    }
  },

  // Update request status
  updateStatus: async (id, data) => {
    try {
      const response = await API.put(`/requests/${id}/status`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update request" };
    }
  },

  // Cancel request
  cancelRequest: async (id) => {
    try {
      const response = await API.put(`/requests/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to cancel request" };
    }
  },

  // Submit feedback
  submitFeedback: async (id, feedback) => {
    try {
      const response = await API.post(`/requests/${id}/feedback`, feedback);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to submit feedback" };
    }
  },
};
