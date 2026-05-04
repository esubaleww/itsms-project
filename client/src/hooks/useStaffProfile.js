import { useState, useCallback } from "react";
import API from "../services/api";
import { useToast } from "../common/ui/Toast";

export const useStaffProfile = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [staffProfile, setStaffProfile] = useState(null);

  const fetchStaffProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get("/staff/profile");
      setStaffProfile(response.data.profile);
      return response.data;
    } catch (error) {
      addToast(error.message || "Failed to fetch staff profile", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return {
    loading,
    staffProfile,
    fetchStaffProfile,
  };
};
