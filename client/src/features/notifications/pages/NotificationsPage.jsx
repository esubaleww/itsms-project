import { useState } from "react";
import { useNotifications } from "../../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Check,
  ChevronLeft,
  Mail,
  MailOpen,
  Inbox,
  X,
} from "lucide-react";

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeGradient = (type) => {
    switch (type) {
      case "success":
        return "from-blue-50/40 to-blue-100/40";
      case "warning":
        return "from-yellow-50/40 to-amber-50/40";
      case "error":
        return "from-red-50/40 to-rose-50/40";
      default:
        return "from-blue-50/40 to-indigo-50/40";
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    endIndex,
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === currentNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(currentNotifications.map((n) => n._id));
    }
  };

  const handleMarkSelectedAsRead = async () => {
    for (const id of selectedNotifications) {
      await markAsRead(id);
    }
    setSelectedNotifications([]);
    await fetchNotifications();
  };

  const handleClearSelection = () => {
    setSelectedNotifications([]);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    await fetchNotifications();
  };

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 font-body py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 transition group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-blue-200 border border-blue-300 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-medium text-text-primary">
                    Notifications
                  </h1>
                  <p className="text-text-muted text-sm mt-0.5">
                    Stay updated with your activity
                  </p>
                </div>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition border border-accent/30"
              >
                <Check className="w-4 h-4" /> Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow-sm rounded-xl p-4 text-center border border-gray-200">
            <p className="text-2xl font-bold text-accent">{stats.total}</p>
            <p className="text-sm text-text-muted">Total</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-4 text-center border border-gray-200">
            <p className="text-2xl font-bold text-yellow-500">{stats.unread}</p>
            <p className="text-sm text-text-muted">Unread</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-4 text-center border border-gray-200">
            <p className="text-2xl font-bold text-blue-500">{stats.read}</p>
            <p className="text-sm text-text-muted">Read</p>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-200 mb-4 overflow-hidden">
          <div className="p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilter("all");
                  setCurrentPage(1);
                  setSelectedNotifications([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  filter === "all"
                    ? "bg-accent text-white"
                    : "bg-white text-text-secondary hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Inbox className="w-3 h-3" />
                  <span>All</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setFilter("unread");
                  setCurrentPage(1);
                  setSelectedNotifications([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  filter === "unread"
                    ? "bg-accent text-white"
                    : "bg-white text-text-secondary hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>Unread</span>
                  {stats.unread > 0 && (
                    <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-600 px-1 rounded">
                      {stats.unread}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => {
                  setFilter("read");
                  setCurrentPage(1);
                  setSelectedNotifications([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  filter === "read"
                    ? "bg-accent text-white"
                    : "bg-white text-text-secondary hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1">
                  <MailOpen className="w-3 h-3" />
                  <span>Read</span>
                </div>
              </button>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">
                  {selectedNotifications.length} selected
                </span>
                <button
                  onClick={handleMarkSelectedAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-accent hover:bg-blue-50 rounded-lg transition"
                >
                  <Check className="w-4 h-4" /> Mark read
                </button>
                <button
                  onClick={handleClearSelection}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-muted hover:bg-gray-50 rounded-lg transition"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              </div>
            )}
          </div>

          {selectedNotifications.length > 0 && (
            <div className="border-t border-gray-200 p-3 bg-gray-50 flex justify-between items-center">
              <span className="text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={
                    selectedNotifications.length ===
                      currentNotifications.length &&
                    currentNotifications.length > 0
                  }
                  onChange={handleSelectAll}
                  className="mr-2 rounded border-gray-300 bg-white text-accent focus:ring-accent"
                />
                Select all ({currentNotifications.length})
              </span>
              <button
                onClick={handleMarkSelectedAsRead}
                className="text-sm text-accent hover:text-blue-700"
              >
                Mark selected as read
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {currentNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-sm rounded-2xl border border-gray-200 p-12 text-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-secondary">
                No notifications
              </h3>
              <p className="text-text-muted text-sm mt-1">
                You're all caught up!
              </p>
            </motion.div>
          ) : (
            currentNotifications.map((notif, index) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white shadow-sm rounded-xl border ${
                  !notif.isRead
                    ? "border-accent/30 bg-linear-to-r " +
                      getTypeGradient(notif.type)
                    : "border-gray-200"
                } hover:shadow-md transition-all cursor-pointer group`}
                onClick={() => {
                  if (!notif.isRead) markAsRead(notif._id);
                  if (notif.actionUrl) navigate(notif.actionUrl);
                }}
              >
                <div className="p-4 flex items-start gap-4">
                  <div className="shrink-0 pt-0.5">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notif._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedNotifications([
                            ...selectedNotifications,
                            notif._id,
                          ]);
                        } else {
                          setSelectedNotifications(
                            selectedNotifications.filter(
                              (id) => id !== notif._id,
                            ),
                          );
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 bg-white text-accent focus:ring-accent focus:ring-offset-0"
                    />
                  </div>

                  <div className="shrink-0">{getIcon(notif.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <h3
                        className={`font-heading font-medium ${
                          !notif.isRead
                            ? "text-text-primary"
                            : "text-text-secondary"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <span className="text-xs text-text-muted shrink-0">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted mt-1">
                      {notif.message}
                    </p>
                    {notif.actionUrl && (
                      <div className="mt-2 text-xs text-accent flex items-center gap-1">
                        Click to view details →
                      </div>
                    )}
                  </div>

                  {!notif.isRead && (
                    <div className="shrink-0">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-sm transition ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed text-text-muted"
                    : "text-text-secondary hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-text-muted text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-sm transition ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed text-text-muted"
                    : "text-text-secondary hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
