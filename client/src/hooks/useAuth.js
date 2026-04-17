import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    verifyEmail,
    resendVerification,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    verifyEmail,
    resendVerification,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
  };
};
