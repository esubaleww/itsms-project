import { useAuthStore } from "../../../store/authStore";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../../auth/components/LoadingScreen";

export const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuthStore();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
