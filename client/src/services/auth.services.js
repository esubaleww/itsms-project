import API from "./api";

export const authService = {
  register: async (data) => {
    const response = await API.post("/auth/register", data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await API.post("/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get("/auth/profile");
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await API.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await API.post("/auth/resend-verification", { email });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await API.put("/auth/profile", data);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await API.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await API.post(`/auth/reset-password/${token}`, {
      password: newPassword,
    });
    return response.data;
  },
};
