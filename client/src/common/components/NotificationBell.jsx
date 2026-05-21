import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setIsOpen(false);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-[#6b7280] hover:bg-[#F3F4F6] transition relative"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-[#111827] text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-20 animate-fadeIn">
          <div className="p-3 border-b border-[#E5E7EB] flex justify-between items-center bg-white/90 backdrop-blur-sm">
            <h3 className="font-semibold text-[#111827]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#2563eb] hover:text-[#1d4ed8]"
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
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 border-b border-[#E5E7EB] hover:bg-[#F3F4F6] cursor-pointer transition ${
                    !notif.isRead ? "bg-white" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-[#2563eb] rounded-full mt-1.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getIcon(notif.type)}
                        <p
                          className={`text-sm ${
                            !notif.isRead
                              ? "text-[#111827] font-medium"
                              : "text-[#374151]"
                          }`}
                        >
                          {notif.title}
                        </p>
                      </div>
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
              className="w-full text-center text-sm text-[#2563eb] hover:text-[#1d4ed8] py-1"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
