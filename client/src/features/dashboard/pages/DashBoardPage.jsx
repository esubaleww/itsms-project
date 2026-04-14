import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import UserDashboard from "../../user/pages/UserDashboard";
import StaffDashboard from "../../staff/pages/StaffDashboard";
import AdminDashboardPage from "../../admin/pages/AdminDashboardPage";
import DirectorDashboard from "../../director/pages/DirectorDashboard";
import TeamLeadDashboard from "../../teamLead/pages/TeamLeadDashboard";

const DashboardPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setAuthChecked(true);
      if (!isAuthenticated && !user) {
        navigate("/login", { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  // Role-based routing
  if (user.role === "user") {
    return <UserDashboard />;
  }

  if (user.role === "admin" || user.role === "super_admin") {
    return <AdminDashboardPage />;
  }

  if (user.role === "staff") {
    if (user.position === "director") {
      return <DirectorDashboard />;
    }
    if (user.position === "team_lead") {
      return <TeamLeadDashboard />;
    }
    return <StaffDashboard />;
  }

  return <UserDashboard />;
};

export default DashboardPage;
