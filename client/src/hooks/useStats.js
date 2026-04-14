import { useState, useEffect } from "react";
import API from "../services/api";

export const useStats = () => {
  const [displayStats, setDisplayStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/get/stats");
      if (response.data.success) {
        setDisplayStats(response.data.stats || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stats");
      setDisplayStats([
        { value: "500+", label: "Active Users", icon: "Users" },
        { value: "50+", label: "Active Startups", icon: "Rocket" },
        { value: "100+", label: "Active Trainees", icon: "School" },
        { value: "100+", label: "Active Interns", icon: "Briefcase" },
        { value: "50+", label: "Active Innovators", icon: "Lightbulb" },
        { value: "95%", label: "Success Rate", icon: "TrendingUp" },
        { value: "100+", label: "Completed Projects", icon: "Code" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats: displayStats, loading, error, fetchStats };
};
