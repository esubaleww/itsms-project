// client/src/services/mentor.service.js
import API from "./api";

export const mentorService = {
  // Innovators
  getMyInnovators: async (params = {}) => {
    let url = "/staff/mentor/innovators";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },
  getInnovatorProgress: async (innovatorId) => {
    const response = await API.get(
      `/staff/mentor/innovators/${innovatorId}/progress`,
    );
    return response.data;
  },
  addInnovatorMilestone: async (innovatorId, milestoneData) => {
    const response = await API.post(
      `/staff/mentor/innovators/${innovatorId}/milestones`,
      milestoneData,
    );
    return response.data;
  },
  reviewInnovatorMilestone: async (
    innovatorId,
    milestoneId,
    status,
    feedback,
  ) => {
    const response = await API.put(
      `/staff/mentor/innovators/${innovatorId}/milestones/${milestoneId}`,
      {
        status,
        feedback,
      },
    );
    return response.data;
  },

  // Startups
  getMyStartups: async (params = {}) => {
    let url = "/staff/mentor/startups";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },
  getStartupProgress: async (startupId) => {
    const response = await API.get(
      `/staff/mentor/startups/${startupId}/progress`,
    );
    return response.data;
  },
  addStartupMilestone: async (startupId, milestoneData) => {
    const response = await API.post(
      `/staff/mentor/startups/${startupId}/milestones`,
      milestoneData,
    );
    return response.data;
  },
  reviewStartupMilestone: async (startupId, milestoneId, status, feedback) => {
    const response = await API.put(
      `/staff/mentor/startups/${startupId}/milestones/${milestoneId}`,
      {
        status,
        feedback,
      },
    );
    return response.data;
  },

  // Dashboard & Stats
  getDashboard: async () => {
    const response = await API.get("/staff/mentor/dashboard");
    return response.data;
  },
  getStats: async () => {
    const response = await API.get("/staff/mentor/stats");
    return response.data;
  },
};
