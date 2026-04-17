import {
  Bell,
  RefreshCw,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Download,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExportModal from "../../admin/components/ExportModal";

const StaffHeader = ({ onRefresh, title = "Staff Dashboard", onExport }) => {
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

  // Close dropdowns when clicking outside
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
      navigate(`/staff/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.fullName) return "S";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (user?.position) {
      return user.position.replace("_", " ").toUpperCase();
    }
    return user?.role?.toUpperCase() || "STAFF";
  };

  return (
    <>
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{title}</h1>
                  <p className="text-xs text-gray-400">
                    Welcome back, {user?.fullName?.split(" ")[0] || "Staff"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search tasks, reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-64"
                  />
                </div>
              </form>

              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group relative"
                title="Export Data"
              >
                <Download className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              </button>

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
                title="Refresh Dashboard"
              >
                <RefreshCw className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 relative group"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
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
                          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
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
                            className={`p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-all duration-200 ${
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
                        className="w-full text-center text-sm text-emerald-400 hover:text-emerald-300 py-1 transition-colors"
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
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
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
                        {getRoleDisplay()}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/profile");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/staff/tasks");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Briefcase className="w-4 h-4" />
                        My Tasks
                      </button>
                      <div className="border-t border-gray-700 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
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
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={onExport}
      />
    </>
  );
};

export default StaffHeader;
