// client/src/hooks/useStaff.js
import { useState, useEffect, useCallback } from "react";
import { staffService } from "../services/staff.service";
import { useToast } from "../components/ui/Toast";

export const useStaff = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, tasksData] = await Promise.all([
        staffService.getStats(),
        staffService.getTasks(),
      ]);
      setStats(statsData);
      setTasks(tasksData.tasks || []);
    } catch (err) {
      setError(err.message);
      addToast(err.message || "Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const updateTaskStatus = useCallback(
    async (taskId, taskIndex, status, notes = "") => {
      try {
        const result = await staffService.updateTaskStatus(
          taskId,
          taskIndex,
          status,
          notes,
        );
        addToast(`Task status updated to ${status}`, "success");
        await fetchAll();
        return result;
      } catch (err) {
        addToast(err.message || "Failed to update task", "error");
        throw err;
      }
    },
    [addToast, fetchAll],
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    stats,
    tasks,
    loading,
    error,
    fetchAll,
    updateTaskStatus,
  };
};
