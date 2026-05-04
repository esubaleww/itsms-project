import API from "./api";

export const mentorService = {
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

  reviewInnovatorMilestone: async (innovatorId, milestoneId, feedback) => {
    const response = await API.put(
      `/staff/mentor/innovators/${innovatorId}/milestones/${milestoneId}/review`,
      { feedback },
    );
    return response.data;
  },

  submitInnovatorFinalReview: async (innovatorId, reviewData) => {
    const response = await API.post(
      `/staff/mentor/innovators/${innovatorId}/final-review`,
      reviewData,
    );
    return response.data;
  },

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

  reviewStartupMilestone: async (startupId, milestoneId, feedback) => {
    const response = await API.put(
      `/staff/mentor/startups/${startupId}/milestones/${milestoneId}/review`,
      { feedback },
    );
    return response.data;
  },

  submitStartupFinalReview: async (startupId, reviewData) => {
    const response = await API.post(
      `/staff/mentor/startups/${startupId}/final-review`,
      reviewData,
    );
    return response.data;
  },

  getDashboard: async () => {
    const response = await API.get("/staff/mentor/dashboard");
    return response.data;
  },

  getStats: async () => {
    const response = await API.get("/staff/mentor/stats");
    return response.data;
  },

  updateMenteeStatus: async (menteeId, type, status) => {
    const response = await API.put(
      `/staff/mentor/${type}s/${menteeId}/status`,
      { status },
    );
    return response.data;
  },
};
