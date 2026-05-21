import { useState, useCallback } from "react";
import { requestService } from "../services/request.service";

export const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestService.getMyRequests();
      setRequests(response.requests || []);

      const reqs = response.requests || [];
      const newStats = {
        pending: reqs.filter((r) => r.status === "pending_approval").length,
        approved: reqs.filter((r) => r.status === "approved").length,
        inProgress: reqs.filter((r) => r.status === "in_progress").length,
        completed: reqs.filter((r) => r.status === "completed").length,
        rejected: reqs.filter((r) => r.status === "rejected").length,
        total: reqs.length,
      };
      setStats(newStats);

      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch requests");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRequestStats = async () => {
    setLoading(true);
    try {
      const response = await requestService.getStats();
      setStats(response.stats);
      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch stats");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestService.createRequest(requestData);
      await fetchMyRequests();
      return response;
    } catch (err) {
      setError(err.message || "Failed to create request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRequestById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestService.getRequestById(id);
      return response.request;
    } catch (err) {
      setError(err.message || "Failed to fetch request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, status, comments = "") => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestService.updateStatus(id, {
        status,
        comments,
      });
      await fetchMyRequests();
      return response;
    } catch (err) {
      setError(err.message || "Failed to update request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestService.cancelRequest(id);
      await fetchMyRequests();
      return response;
    } catch (err) {
      setError(err.message || "Failed to cancel request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (id, feedback) => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestService.submitFeedback(id, feedback);
      await fetchMyRequests();
      return response;
    } catch (err) {
      setError(err.message || "Failed to submit feedback");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    stats,
    loading,
    error,
    fetchMyRequests,
    getRequestStats,
    createRequest,
    getRequestById,
    updateRequestStatus,
    cancelRequest,
    submitFeedback,
  };
};
