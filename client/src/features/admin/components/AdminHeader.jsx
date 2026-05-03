import {
  Bell,
  RefreshCw,
  User,
  LogOut,
  ChevronDown,
  Download,
  BarChart3,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import { useAdmin } from "../../../hooks/useAdmin";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExportModal from "./ExportModal";
import ActivityLogs from "./ActivityLogs";

const AdminHeader = ({
  onRefresh,
  title = "Admin Dashboard",
  onExport,
  showAnalytics,
  setShowAnalytics,
  onMenuClick,
}) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { auditLogs, loading: logsLoading } = useAdmin();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowMobileSearch(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "A";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-b border-[#E5E7EB] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-white rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-[#4b5563]" />
              </button>

              {/* Circular logo */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2563eb] rounded-full flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              {/* Title - hide on mobile, show on sm and up */}
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827]">
                  {title}
                </h1>
                <p className="text-xs text-[#374151] hidden md:block">
                  Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}
                </p>
              </div>

              {/* Mobile title only */}
              <div className="sm:hidden">
                <h1 className="text-sm font-bold text-[#111827]">Admin</h1>
              </div>
            </div>

            {/* Right Section - All buttons visible on mobile */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 hover:bg-white rounded-lg transition-colors duration-200 group"
                title="Export Data"
              >
                <Download className="w-5 h-5 text-[#4b5563] group-hover:text-[#2563eb] transition-colors" />
              </button>

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                className="p-2 hover:bg-white rounded-lg transition-colors duration-200 group"
                title="Refresh Dashboard"
              >
                <RefreshCw className="w-5 h-5 text-[#4b5563] group-hover:text-[#2563eb] transition-colors" />
              </button>

              {/* Analytics Button */}
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`p-2 rounded-lg transition ${
                  showAnalytics
                    ? "bg-[#EEF2FF] text-[#2563eb]"
                    : "text-[#374151] hover:bg-[#F3F4F6]"
                }`}
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>

              {/* Activity Logs Button - Desktop only */}
              <div className="hidden md:block">
                <ActivityLogs
                  logs={auditLogs}
                  loading={logsLoading}
                  onRefresh={onRefresh}
                />
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-white rounded-lg transition-colors duration-200 relative group"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-[#4b5563] group-hover:text-[#2563eb] transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-20 animate-fadeIn">
                    <div className="p-3 border-b border-[#E5E7EB] flex justify-between items-center bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                      <h3 className="font-semibold text-[#111827]">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-[#64748b]">
                          <Bell className="w-10 h-10 mx-auto text-[#64748b] mb-2" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 border-b border-[#E5E7EB] hover:bg-white cursor-pointer transition-all duration-200 ${
                              !notif.isRead ? "bg-gray-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {!notif.isRead && (
                                <div className="w-2 h-2 bg-[#2563eb] rounded-full mt-1.5 shrink-0" />
                              )}
                              <div className="flex-1">
                                <p
                                  className={`text-sm ${!notif.isRead ? "text-[#111827] font-medium" : "text-[#374151]"}`}
                                >
                                  {notif.title}
                                </p>
                                <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-[#6b7280] mt-1">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                      <button
                        onClick={handleViewAll}
                        className="w-full text-center text-sm text-[#2563eb] hover:text-[#1d4ed8] py-1 transition-colors"
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
                  className="flex items-center gap-2 p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#374151] group-hover:text-[#111827] transition-colors hidden sm:block" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E7EB] overflow-hidden z-20 animate-fadeIn">
                    <div className="p-3 border-b border-[#E5E7EB] bg-white">
                      <p className="text-[#111827] font-medium">{user?.fullName}</p>
                      <p className="text-xs text-[#374151] mt-0.5">
                        {user?.email}
                      </p>
                      <p className="text-xs text-[#2563eb] mt-1 capitalize">
                        {user?.role}{" "}
                        {user?.position ? `• ${user.position}` : ""}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/profile");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <div className="border-t border-[#E5E7EB] my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#F3F4F6] transition-colors flex items-center gap-2"
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
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={onExport}
      />
    </>
  );
};

export default AdminHeader;
