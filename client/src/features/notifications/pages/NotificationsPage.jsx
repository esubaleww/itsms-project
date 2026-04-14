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
  const [showFilters, setShowFilters] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeGradient = (type) => {
    switch (type) {
      case "success":
        return "from-emerald-500/20 to-teal-500/10";
      case "warning":
        return "from-yellow-500/20 to-amber-500/10";
      case "error":
        return "from-red-500/20 to-rose-500/10";
      default:
        return "from-blue-500/20 to-indigo-500/10";
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n._id));
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

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-r from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Notifications
                  </h1>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Stay updated with your activity
                  </p>
                </div>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition border border-emerald-500/30"
              >
                <Check className="w-4 h-4" /> Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
            <p className="text-2xl font-bold text-emerald-400">{stats.total}</p>
            <p className="text-sm text-gray-400">Total</p>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
            <p className="text-2xl font-bold text-yellow-400">{stats.unread}</p>
            <p className="text-sm text-gray-400">Unread</p>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
            <p className="text-2xl font-bold text-blue-400">{stats.read}</p>
            <p className="text-sm text-gray-400">Read</p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 mb-4 overflow-hidden">
          <div className="p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  filter === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Inbox className="w-3 h-3" />
                  <span>All</span>
                </div>
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  filter === "unread"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>Unread</span>
                  {stats.unread > 0 && (
                    <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-400 px-1 rounded">
                      {stats.unread}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  filter === "read"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
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
                <span className="text-xs text-gray-400">
                  {selectedNotifications.length} selected
                </span>
                <button
                  onClick={handleMarkSelectedAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                >
                  <Check className="w-4 h-4" /> Mark read
                </button>
                <button
                  onClick={handleClearSelection}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              </div>
            )}
          </div>

          {/* Bulk Actions Bar when items selected */}
          {selectedNotifications.length > 0 && (
            <div className="border-t border-gray-700 p-3 bg-gray-800/40 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={
                    selectedNotifications.length ===
                    filteredNotifications.length
                  }
                  onChange={handleSelectAll}
                  className="mr-2 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
                />
                Select all ({filteredNotifications.length})
              </span>
              <button
                onClick={handleMarkSelectedAsRead}
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Mark selected as read
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-12 text-center"
            >
              <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-400">
                No notifications
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                You're all caught up!
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gray-800/60 backdrop-blur-sm rounded-xl border ${
                  !notif.isRead
                    ? "border-emerald-500/30 bg-linear-to-r " +
                      getTypeGradient(notif.type)
                    : "border-gray-700"
                } hover:shadow-lg transition-all cursor-pointer group`}
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
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                  </div>

                  <div className="shrink-0">{getIcon(notif.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <h3
                        className={`font-semibold ${
                          !notif.isRead ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <span className="text-xs text-gray-500 shrink-0">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {notif.message}
                    </p>
                    {notif.actionUrl && (
                      <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                        Click to view details →
                      </div>
                    )}
                  </div>

                  {!notif.isRead && (
                    <div className="shrink-0">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer with pagination placeholder */}
        {filteredNotifications.length > 10 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-400 hover:bg-gray-700 transition text-sm">
                Previous
              </button>
              <span className="px-3 py-1.5 text-gray-400 text-sm">1 / 2</span>
              <button className="px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-400 hover:bg-gray-700 transition text-sm">
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
