// client/src/features/admin/components/ActivityLogs.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Clock,
  User,
  FileText,
  Building2,
  Users,
  Award,
  Briefcase,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  Search,
  LogIn,
  LogOut,
  Route,
  Flag,
} from "lucide-react";

const ActivityLogs = ({ logs, loading, onRefresh }) => {
  const [showLogsPanel, setShowLogsPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowLogsPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getActionIcon = (action) => {
    const actionUpper = action?.toUpperCase() || "";

    switch (actionUpper) {
      case "CREATE":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "UPDATE":
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case "DELETE":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "APPROVE":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "REJECT":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "LOGIN":
        return <LogIn className="w-4 h-4 text-emerald-400" />;
      case "LOGOUT":
        return <LogOut className="w-4 h-4 text-gray-400" />;
      case "ASSIGN":
        return <Users className="w-4 h-4 text-purple-400" />;
      case "ROUTE":
        return <Route className="w-4 h-4 text-yellow-400" />;
      case "COMPLETE":
        return <Flag className="w-4 h-4 text-blue-400" />;
      default:
        return <History className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionBadgeColor = (action) => {
    const actionUpper = action?.toUpperCase() || "";

    switch (actionUpper) {
      case "CREATE":
        return "bg-green-500/20 text-green-400";
      case "UPDATE":
        return "bg-blue-500/20 text-blue-400";
      case "DELETE":
        return "bg-red-500/20 text-red-400";
      case "APPROVE":
        return "bg-emerald-500/20 text-emerald-400";
      case "REJECT":
        return "bg-red-500/20 text-red-400";
      case "LOGIN":
        return "bg-emerald-500/20 text-emerald-400";
      case "LOGOUT":
        return "bg-gray-500/20 text-gray-400";
      case "ASSIGN":
        return "bg-purple-500/20 text-purple-400";
      case "ROUTE":
        return "bg-yellow-500/20 text-yellow-400";
      case "COMPLETE":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getEntityIcon = (entity) => {
    const entityLower = entity?.toLowerCase() || "";

    if (entityLower.includes("user")) {
      return <User className="w-3 h-3" />;
    }
    if (entityLower.includes("request")) {
      return <FileText className="w-3 h-3" />;
    }
    if (entityLower.includes("directorate")) {
      return <Building2 className="w-3 h-3" />;
    }
    if (entityLower.includes("staff") || entityLower.includes("staffprofile")) {
      return <Users className="w-3 h-3" />;
    }
    if (entityLower.includes("report")) {
      return <Award className="w-3 h-3" />;
    }
    if (entityLower.includes("service")) {
      return <Briefcase className="w-3 h-3" />;
    }
    if (entityLower.includes("internprofile")) {
      return <Users className="w-3 h-3" />;
    }
    if (entityLower.includes("innovatorprofile")) {
      return <Lightbulb className="w-3 h-3" />;
    }
    if (entityLower.includes("startupprofile")) {
      return <Rocket className="w-3 h-3" />;
    }
    return <History className="w-3 h-3" />;
  };

  const filteredLogs = logs?.filter((log) => {
    if (filter !== "all" && log.action?.toLowerCase() !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.action?.toLowerCase().includes(searchLower) ||
        log.entity?.toLowerCase().includes(searchLower) ||
        log.user?.fullName?.toLowerCase().includes(searchLower) ||
        log.metadata?.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const logCounts = {
    all: logs?.length || 0,
    create: logs?.filter((l) => l.action === "CREATE").length || 0,
    update: logs?.filter((l) => l.action === "UPDATE").length || 0,
    delete: logs?.filter((l) => l.action === "DELETE").length || 0,
    approve: logs?.filter((l) => l.action === "APPROVE").length || 0,
    reject: logs?.filter((l) => l.action === "REJECT").length || 0,
    login: logs?.filter((l) => l.action === "LOGIN").length || 0,
    assign: logs?.filter((l) => l.action === "ASSIGN").length || 0,
  };

  const filters = [
    { value: "all", label: "All", count: logCounts.all },
    { value: "create", label: "Create", count: logCounts.create },
    { value: "update", label: "Update", count: logCounts.update },
    { value: "delete", label: "Delete", count: logCounts.delete },
    { value: "approve", label: "Approve", count: logCounts.approve },
    { value: "reject", label: "Reject", count: logCounts.reject },
    { value: "login", label: "Login", count: logCounts.login },
    { value: "assign", label: "Assign", count: logCounts.assign },
  ];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Activity Logs Button */}
      <button
        onClick={() => setShowLogsPanel(!showLogsPanel)}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group relative"
        title="Activity Logs"
      >
        <History className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
        {logs?.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
            {logs.length > 9 ? "9+" : logs.length}
          </span>
        )}
      </button>

      {/* Activity Logs Panel */}
      <AnimatePresence>
        {showLogsPanel && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 top-full mt-2 w-137.5 max-w-[calc(100vw-2rem)] bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-30"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800/90">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">Activity Logs</h3>
                </div>
                <button
                  onClick={onRefresh}
                  className="p-1 hover:bg-gray-700 rounded-lg transition"
                  title="Refresh logs"
                >
                  <RefreshCw className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search logs by action, entity, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-2 py-1 rounded-lg text-xs whitespace-nowrap transition ${
                      filter === f.value
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    {f.label}
                    <span className="ml-1 text-gray-500">({f.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logs List */}
            <div className="max-h-125 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                  <p className="mt-2 text-gray-400 text-sm">Loading logs...</p>
                </div>
              ) : filteredLogs?.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <History className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                  <p className="text-sm">No activity logs found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredLogs.map((log) => (
                    <div
                      key={log._id}
                      className="p-4 hover:bg-gray-700/50 cursor-pointer transition-all"
                      onClick={() =>
                        setSelectedLog(
                          selectedLog?._id === log._id ? null : log,
                        )
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getActionIcon(log.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}
                            >
                              {log.action}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              {getEntityIcon(log.entity)}
                              <span>{log.entity}</span>
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {log.metadata?.description ||
                              `${log.action} ${log.entity}`}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {log.user?.fullName || "System"}
                              {log.role && (
                                <span className="text-gray-600">
                                  ({log.role})
                                </span>
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>

                          {/* Expanded Details */}
                          {selectedLog?._id === log._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-gray-600"
                            >
                              <div className="bg-gray-700/30 rounded-lg p-3 space-y-2">
                                {/* Entity ID */}
                                {log.entityId && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-400">
                                      Entity ID:
                                    </span>
                                    <span className="text-gray-300 font-mono text-xs">
                                      {log.entityId}
                                    </span>
                                  </div>
                                )}

                                {/* Request ID */}
                                {log.request && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-400">
                                      Request ID:
                                    </span>
                                    <span className="text-gray-300 font-mono text-xs">
                                      {log.request}
                                    </span>
                                  </div>
                                )}

                                {/* Old/New Values */}
                                {log.oldValue && (
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">
                                      Old Value:
                                    </p>
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-gray-800/50 p-2 rounded">
                                      {JSON.stringify(log.oldValue, null, 2)}
                                    </pre>
                                  </div>
                                )}

                                {log.newValue && (
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">
                                      New Value:
                                    </p>
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-gray-800/50 p-2 rounded">
                                      {JSON.stringify(log.newValue, null, 2)}
                                    </pre>
                                  </div>
                                )}

                                {/* Metadata */}
                                {log.metadata &&
                                  Object.keys(log.metadata).length > 0 && (
                                    <div>
                                      <p className="text-xs text-gray-400 mb-1">
                                        Metadata:
                                      </p>
                                      <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                                        {JSON.stringify(log.metadata, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                {/* IP and User Agent */}
                                {log.ipAddress && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-400">IP:</span>
                                    <span className="text-gray-300">
                                      {log.ipAddress}
                                    </span>
                                  </div>
                                )}
                                {log.userAgent && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-400">
                                      User Agent:
                                    </span>
                                    <span className="text-gray-300 text-xs truncate">
                                      {log.userAgent}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(
                              selectedLog?._id === log._id ? null : log,
                            );
                          }}
                          className="text-gray-500 hover:text-gray-300"
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              selectedLog?._id === log._id ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-700 bg-gray-800/90">
              <button
                onClick={() => {
                  setShowLogsPanel(false);
                  // Trigger tab change to logs in parent
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("switchToLogsTab"));
                  }
                }}
                className="w-full text-center text-sm text-emerald-400 hover:text-emerald-300 py-1 transition-colors"
              >
                View all activity logs →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActivityLogs;
