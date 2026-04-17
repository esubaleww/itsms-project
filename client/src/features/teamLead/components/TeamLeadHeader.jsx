import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import {
  Bell,
  RefreshCw,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Download,
  BarChart3,
  Users,
} from "lucide-react";
import TeamLeadExportModal from "./TeamLeadExportModal";

const TeamLeadHeader = ({
  onRefresh,
  title = "Team Lead Dashboard",
  teamName,
  onToggleAnalytics,
  showAnalytics,
}) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setShowNotifications(false);
  };

  const handleViewAll = () => {
    setShowNotifications(false);
    navigate("/notifications");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/team-lead/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "TL";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-r from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">
                    {user?.fullName?.split(" ")[0] || "Team Lead"}
                  </p>
                  {teamName && (
                    <>
                      <span className="text-gray-600 text-xs">•</span>
                      <p className="text-xs text-emerald-400">{teamName}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search tasks, members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-64"
                  />
                </div>
              </form>

              {/* Analytics Toggle */}
              <button
                onClick={onToggleAnalytics}
                className={`p-2 rounded-lg transition ${
                  showAnalytics
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
                title="Toggle Analytics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>

              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition"
                title="Export Data"
              >
                <Download className="w-5 h-5" />
              </button>

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition"
                title="Refresh Dashboard"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-20 animate-fadeIn">
                    <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-gray-800/90">
                      <h3 className="font-semibold text-white">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition ${
                              !notif.isRead ? "bg-gray-700/50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {!notif.isRead && (
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                              )}
                              <div className="flex-1">
                                <p
                                  className={`text-sm ${!notif.isRead ? "text-white font-medium" : "text-gray-300"}`}
                                >
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-700 bg-gray-800/90">
                      <button
                        onClick={handleViewAll}
                        className="w-full text-center text-sm text-emerald-400 hover:text-emerald-300 py-1"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-700 rounded-lg transition group"
                >
                  <div className="w-8 h-8 bg-linear-to-r from-emerald-500 to-teal-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-20 animate-fadeIn">
                    <div className="p-3 border-b border-gray-700 bg-gray-800/90">
                      <p className="text-white font-medium">{user?.fullName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {user?.email}
                      </p>
                      <p className="text-xs text-emerald-400 mt-1 capitalize">
                        Team Lead • {teamName || "No Team Assigned"}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/profile");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/team-lead/settings");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Team Settings
                      </button>
                      <div className="border-t border-gray-700 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Export Modal */}
      <TeamLeadExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </>
  );
};

export default TeamLeadHeader;
