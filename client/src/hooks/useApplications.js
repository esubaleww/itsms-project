import { useState } from "react";
import { applicationService } from "../services/application.service";
import { useToast } from "../common/ui/Toast";

export const useApplications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState(null);
  const { addToast } = useToast();

  const submitInternApplication = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationService.submitIntern(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Application failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitInnovatorApplication = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationService.submitInnovator(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Application failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitStartupApplication = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationService.submitStartup(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Application failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitTrainingApplication = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationService.submitTraining(data);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  const applyForService = async (data) => {
    setLoading(true);
    try {
      const response = await applicationService.applyForService(data);
      addToast("Service request submitted successfully!", "success");
      await getMyApplications();
      return response;
    } catch (error) {
      addToast(error.message || "Failed to submit service request", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMyApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationService.getMyApplications();
      setApplications(response.applications);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationService.getApplicationStatus();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    applications,
    submitInternApplication,
    submitInnovatorApplication,
    submitStartupApplication,
    submitTrainingApplication,
    getMyApplications,
    getApplicationStatus,
    applyForService,
  };
};
