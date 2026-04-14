// client/src/hooks/useAnnouncements.js
import { useState, useCallback } from "react";
import API from "../services/api";

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/public/announcements");
      if (response.data.success) {
        setAnnouncements(response.data.announcements);
      } else {
        setError(response.data.message || "Failed to fetch announcements");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
  };
};
