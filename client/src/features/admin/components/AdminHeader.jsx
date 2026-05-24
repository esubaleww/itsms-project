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
  History,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import { useAdmin } from "../../../hooks/useAdmin";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExportModal from "../../../common/components/ExportModal";

const AdminHeader = ({
  onRefresh,
  title = "Admin Dashboard",
  onExport,
  onMenuClick,
}) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { auditLogs, loading: logsLoading } = useAdmin();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-4">
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-text-muted" />
              </button>

              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center shadow-md">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl md:text-2xl font-heading font-medium text-text-primary">
                  {title}
                </h1>
                <p className="text-xs text-text-secondary hidden md:block">
                  Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}
                </p>
              </div>

              <div className="sm:hidden">
                <h1 className="text-sm font-heading font-medium text-text-primary">
                  Admin
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                title="Export Data"
              >
                <Download className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </button>

              <button
                onClick={onRefresh}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                title="Refresh Dashboard"
              >
                <RefreshCw className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </button>

              <button
                onClick={() => navigate("/admin/analytics")}
                className="p-2 rounded-lg transition text-text-muted hover:bg-gray-50 hover:text-accent"
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate("/admin/activity-logs")}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                title="Activity Logs"
              >
                <History className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </button>

              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 relative group"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20 animate-fadeIn">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
                      <h3 className="font-heading font-medium text-text-primary">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-accent hover:text-blue-700 transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">
                          <Bell className="w-10 h-10 mx-auto text-text-muted mb-2" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                              !notif.isRead ? "bg-gray-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {!notif.isRead && (
                                <div className="w-2 h-2 bg-accent rounded-full mt-1.5 shrink-0" />
                              )}
                              <div className="flex-1">
                                <p
                                  className={`text-sm ${!notif.isRead ? "text-text-primary font-medium" : "text-text-secondary"}`}
                                >
                                  {notif.title}
                                </p>
                                <p className="text-xs text-text-muted mt-1 line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-text-muted mt-1">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={handleViewAll}
                        className="w-full text-center text-sm text-accent hover:text-blue-700 py-1 transition-colors"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                title="Profile"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUserInitials()}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={onExport}
        role="admin"
      />
    </>
  );
};

export default AdminHeader;
