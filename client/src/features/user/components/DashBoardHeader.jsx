import { RefreshCw, Menu, LayoutDashboard, LogOut } from "lucide-react";
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
    <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex justify-between items-center">
          {/* Left section */}
          <div className="flex items-center gap-2">
            {/* Menu button - mobile only */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-300" />
            </button>

            {/* Logo */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-sm sm:text-lg font-bold text-white">
                Dashboard
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {getGreeting()}, {user?.fullName?.split(" ")[0] || "User"}
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            <NotificationBell />

            <button
              onClick={() => onNavigate("/profile")}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
