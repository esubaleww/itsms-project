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
    <header className="bg-white/80 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-[60]">
      <div className="max-w-7xl mx-auto px-4 h-16">
        <div className="flex justify-between items-center h-full">
          {/* Left section */}
          <div className="flex items-center gap-2">
            {/* Menu button - mobile only */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-[#374151]" />
            </button>

            {/* Logo */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2563eb] rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#111827]" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-sm sm:text-lg font-bold text-[#111827]">
                Dashboard
              </h1>
              <p className="text-xs text-[#6b7280] hidden sm:block">
                {getGreeting()}, {user?.fullName?.split(" ")[0] || "User"}
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280] ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            <NotificationBell />

            <button
              onClick={() => onNavigate("/profile")}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#2563eb] rounded-full flex items-center justify-center">
                <span className="text-[#111827] text-xs font-medium">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280] hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
