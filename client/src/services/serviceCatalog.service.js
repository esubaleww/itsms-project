import API from "./api";

export const serviceCatalogApi = {
  // Get all services
  getAllServices: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await API.get(
      `/service-catalog${queryParams ? `?${queryParams}` : ""}`,
    );
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await API.get(`/service-catalog/${id}`);
    return response.data;
  },

  // Create service (admin only)
  createService: async (data) => {
    const response = await API.post("/service-catalog", data);
    return response.data;
  },

  // Update service (admin only)
  updateService: async (id, data) => {
    const response = await API.put(`/service-catalog/${id}`, data);
    return response.data;
  },

  // Delete service (admin only)
  deleteService: async (id) => {
    const response = await API.delete(`/service-catalog/${id}`);
    return response.data;
  },

  // Get popular services
  getPopularServices: async (limit = 5) => {
    const response = await API.get(`/service-catalog/popular?limit=${limit}`);
    return response.data;
  },

  // Get service stats
  getServiceStats: async () => {
    const response = await API.get("/service-catalog/stats");
    return response.data;
  },
};
