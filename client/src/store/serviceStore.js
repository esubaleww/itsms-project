import { create } from "zustand";
import serviceApi from "../services/serviceApi";

const useServiceStore = create((set, get) => ({
  services: [],
  categories: [],
  popularServices: [],
  userRequests: [],
  currentRequest: null,
  stats: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },

  fetchServices: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await serviceApi.getAllServices(params);
      set({
        services: response.services,
        categories: response.categories,
        pagination: response.pagination,
        loading: false,
      });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchPopularServices: async (limit = 5) => {
    set({ loading: true, error: null });
    try {
      const response = await serviceApi.getPopularServices(limit);
      set({ popularServices: response.services, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchServiceStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await serviceApi.getServiceStats();
      set({ stats: response.stats, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchUserRequests: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await serviceApi.getUserServiceRequests(params);
      set({
        userRequests: response.requests,
        pagination: response.pagination,
        loading: false,
      });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createRequest: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await serviceApi.createServiceRequest(data);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  cancelRequest: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await serviceApi.cancelServiceRequest(id);
      set({ loading: false });
      await get().fetchUserRequests();
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  reset: () =>
    set({
      services: [],
      categories: [],
      popularServices: [],
      userRequests: [],
      currentRequest: null,
      stats: null,
      loading: false,
      error: null,
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }),
}));

export default useServiceStore;
