import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth.services";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.register(userData);
          localStorage.setItem("token", data.token);

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
          await get().getProfile();
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Registration failed",
          });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const data = await authService.login({ email, password });

          localStorage.setItem("token", data.token);

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
          await get().getProfile();
          return data;
        } catch (error) {
          console.error("❌ [authStore] Login failed:", {
            status: error.response?.status,
            message: error.response?.data?.message,
            error: error.message,
          });
          set({
            loading: false,
            error: error.response?.data?.message || "Login failed",
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      getProfile: async () => {
        set({ loading: true });
        try {
          const data = await authService.getProfile();
          set({
            user: data.user,
            isAuthenticated: true,
            loading: false,
          });
          return data;
        } catch (error) {
          // If token expired, logout
          if (error.response?.status === 401) {
            get().logout();
          }
          set({ loading: false, error: error.message });
          throw error;
        }
      },

      verifyEmail: async (token) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.verifyEmail(token);

          const profileData = await authService.getProfile();

          set({
            user: profileData.user,
            isAuthenticated: true,
            loading: false,
          });
          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Verification failed",
          });
          throw error;
        }
      },

      resendVerification: async (email) => {
        if (!email || typeof email !== "string") {
          throw new Error("Valid email is required");
        }
        set({ loading: true, error: null });
        try {
          const data = await authService.resendVerification(email);
          set({ loading: false });
          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Failed to resend",
          });
          throw error;
        }
      },

      // Update Profile
      updateProfile: async (updateData) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.updateProfile(updateData);
          // ✅ Update user with new profile data
          set({
            user: { ...get().user, ...data.user },
            loading: false,
          });
          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Update failed",
          });
          throw error;
        }
      },

      // Change Password
      changePassword: async (currentPassword, newPassword) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.changePassword(
            currentPassword,
            newPassword,
          );
          set({ loading: false });
          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Password change failed",
          });
          throw error;
        }
      },

      // Forgot Password
      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.forgotPassword(email);
          set({ loading: false });
          return data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Failed to send reset email";
          set({ loading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Reset Password
      resetPassword: async (token, newPassword) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.resetPassword(token, newPassword);
          set({ loading: false });
          return data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Failed to reset password";
          set({ loading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Clear Error
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
