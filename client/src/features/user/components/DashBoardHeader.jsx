import { User, Settings, LogOut, RefreshCw } from "lucide-react";
import NotificationBell from "../../../components/common/NotificationBell";

const DashboardHeader = ({
  user,
  onRefresh,
  refreshing,
  onLogout,
  onNavigate,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="sticky top-0 z-20 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-r from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-xs text-gray-400">
                {getGreeting()}, {user?.fullName?.split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
            <NotificationBell />
            <button
              onClick={() => onNavigate("/profile")}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
