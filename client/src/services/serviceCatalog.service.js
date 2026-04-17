import API from "./api";

export const serviceCatalogApi = {
  getAllServices: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await API.get(
      `/service-catalog${queryParams ? `?${queryParams}` : ""}`,
    );
    return response.data;
  },

  getServiceById: async (id) => {
    const response = await API.get(`/service-catalog/${id}`);
    return response.data;
  },

  createService: async (data) => {
    const response = await API.post("/service-catalog", data);
    return response.data;
  },

  updateService: async (id, data) => {
    const response = await API.put(`/service-catalog/${id}`, data);
    return response.data;
  },

  deleteService: async (id) => {
    const response = await API.delete(`/service-catalog/${id}`);
    return response.data;
  },

  getPopularServices: async (limit = 5) => {
    const response = await API.get(`/service-catalog/popular?limit=${limit}`);
    return response.data;
  },

  getServiceStats: async () => {
    const response = await API.get("/service-catalog/stats");
    return response.data;
  },
};
