// client/src/services/staff.service.js
import API from "./api";

export const staffService = {
  getStats: async () => {
    const response = await API.get("/staff/stats");
    return response.data;
  },

  getTasks: async () => {
    const response = await API.get("/staff/tasks");
    return response.data;
  },

  updateTaskStatus: async (taskId, taskIndex, status, notes) => {
    const response = await API.patch(`/staff/tasks/${taskId}/status`, {
      taskIndex,
      status,
      notes,
    });
    return response.data;
  },
};
