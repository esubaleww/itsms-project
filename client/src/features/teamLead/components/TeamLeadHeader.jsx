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
  Menu,
  LayoutDashboard,
  X,
} from "lucide-react";
import ExportModal from "../../../common/components/ExportModal";

const TeamLeadHeader = ({
  onRefresh,
  refreshing = false,
  title = "Team Lead Dashboard",
  onExport,
  teamName,
  onMenuClick,
}) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-4 h-16">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-[#6b7280]" />
              </button>

              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#111827]" />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827]">
                  {title}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[#6b7280] hidden md:block">
                    {user?.fullName?.split(" ")[0] || "Team Lead"}
                  </p>
                  {teamName && (
                    <>
                      <span className="text-[#9ca3af] text-xs hidden md:inline">
                        •
                      </span>
                      <p className="text-xs text-[#2563eb] hidden md:block">
                        {teamName}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="sm:hidden">
                <h1 className="text-sm font-bold text-[#111827]">Team Lead</h1>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors duration-200 group"
                title="Refresh Dashboard"
              >
                <RefreshCw
                  className={`w-5 h-5 text-[#6b7280] group-hover:text-[#2563eb] transition-colors ${refreshing ? "animate-spin" : ""}`}
                />
              </button>

              <button
                onClick={() => navigate("/team-lead/analytics")}
                className="p-2 rounded-lg transition-colors text-[#6b7280] hover:bg-[#F3F4F6]"
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors duration-200 group"
                title="Export Data"
              >
                <Download className="w-5 h-5 text-[#6b7280] group-hover:text-[#2563eb] transition-colors" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors duration-200 relative group"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-[#6b7280] group-hover:text-[#2563eb] transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-[#111827] text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-20 animate-fadeIn">
                    <div className="p-3 border-b border-[#E5E7EB] flex justify-between items-center bg-white/90 backdrop-blur-sm">
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
                        <div className="p-8 text-center text-[#6b7280]">
                          <Bell className="w-10 h-10 mx-auto text-[#9ca3af] mb-2" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 border-b border-[#E5E7EB] hover:bg-[#F3F4F6] cursor-pointer transition-all duration-200 ${
                              !notif.isRead ? "bg-white" : ""
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
                    <div className="p-2 border-t border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
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
                  <div className="w-8 h-8 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#111827] text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#6b7280] group-hover:text-[#111827] transition-colors hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-20 animate-fadeIn">
                    <div className="p-3 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
                      <p className="text-[#111827] font-medium">{user?.fullName}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">
                        {user?.email}
                      </p>
                      <p className="text-xs text-[#2563eb] mt-1 capitalize">
                        Team Lead • {teamName || "No Team Assigned"}
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
      </header>
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={onExport}
        role="teamlead"
      />
    </>
  );
};

export default TeamLeadHeader;
