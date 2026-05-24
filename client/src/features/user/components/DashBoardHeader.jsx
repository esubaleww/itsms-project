import { RefreshCw, Menu, LayoutDashboard } from "lucide-react";
import NotificationBell from "../../../common/components/NotificationBell";

const DashboardHeader = ({
  user,
  onRefresh,
  refreshing,
  onLogout,
  onNavigate,
  onMenuClick,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>

            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            <div>
              <h1 className="text-sm sm:text-lg font-heading font-semibold text-text-primary">
                Dashboard
              </h1>
              <p className="text-xs text-text-muted hidden sm:block">
                {getGreeting()}, {user?.fullName?.split(" ")[0] || "User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 sm:w-5 sm:h-5 text-text-muted ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            <NotificationBell />

            <button
              onClick={() => onNavigate("/profile")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
