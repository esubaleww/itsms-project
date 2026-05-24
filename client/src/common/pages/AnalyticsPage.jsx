import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AdminAnalytics from "../../features/admin/components/AdminAnalytics";
import DirectorAnalytics from "../../features/director/components/DirectorAnalytics";
import TeamLeadAnalytics from "../../features/teamLead/components/TeamLeadAnalytics";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const renderAnalyticsComponent = () => {
    if (user?.role === "admin") {
      return <AdminAnalytics />;
    }
    if (user?.role === "staff" && user?.position === "director") {
      return <DirectorAnalytics />;
    }
    if (user?.role === "staff" && user?.position === "team_lead") {
      return <TeamLeadAnalytics />;
    }
    return null;
  };

  return (
    <div className="bg-linear-to-b from-gray-50 to-gray-100 min-h-screen font-body">
      <div className="space-y-6 p-5 sm:p-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {renderAnalyticsComponent()}
      </div>
    </div>
  );
};

export default AnalyticsPage;
