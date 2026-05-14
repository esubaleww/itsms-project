import { useState, useCallback } from "react";
import { serviceCatalogApi } from "../services/serviceCatalog.service";
import { useToast } from "../common/ui/Toast";

export const useServiceCatalog = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await serviceCatalogApi.getAllServices(params);
      setServices(data.services);
      setCategories(data.categories);
      setPagination(data.pagination);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch services", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchServiceById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await serviceCatalogApi.getServiceById(id);
      setSelectedService(data.service);
      return data;
    } catch (error) {
      addToast(error.message || "Failed to fetch service", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchServiceStats = useCallback(async () => {
    try {
      const data = await serviceCatalogApi.getServiceStats();
      setStats(data.stats);
      return data;
    } catch (error) {
      console.error("Failed to fetch service stats:", error);
    }
  }, []);

  const createService = async (data) => {
    setLoading(true);
    try {
      const response = await serviceCatalogApi.createService(data);
      addToast("Service created successfully!", "success");
      await fetchServices();
      return response;
    } catch (error) {
      addToast(error.message || "Failed to create service", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, data) => {
    setLoading(true);
    try {
      const response = await serviceCatalogApi.updateService(id, data);
      addToast("Service updated successfully!", "success");
      await fetchServices();
      return response;
    } catch (error) {
      addToast(error.message || "Failed to update service", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    setLoading(true);
    try {
      const response = await serviceCatalogApi.deleteService(id);
      addToast("Service deleted successfully!", "success");
      await fetchServices();
      return response;
    } catch (error) {
      addToast(error.message || "Failed to delete service", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    services,
    categories,
    stats,
    pagination,
    selectedService,
    fetchServices,
    fetchServiceById,
    fetchServiceStats,
    createService,
    updateService,
    deleteService,
  };
};
