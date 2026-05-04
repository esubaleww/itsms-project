import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
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
  Search,
  LogIn,
  LogOut,
  Route,
  Flag,
  Lightbulb,
  Rocket,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
} from "lucide-react";
import { useAdmin } from "../../../hooks/useAdmin";

const ITEMS_PER_PAGE = 25;

const ActivityLogsPage = () => {
  const navigate = useNavigate();
  const { auditLogs, loading, fetchAll } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntity, setFilterEntity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // New filter for success/failed
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAll();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedLog(null);
  }, [searchTerm, filterAction, filterEntity, filterStatus]);

  const getActionIcon = (action, success) => {
    const actionUpper = action?.toUpperCase() || "";

    // If it's a LOGIN action that failed
    if (actionUpper === "LOGIN" && success === false) {
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }

    switch (actionUpper) {
      case "CREATE":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "UPDATE":
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case "DELETE":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "APPROVE":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "REVIEW":
        return <Clock className="w-4 h-4 text-yellow-400" />;
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

  const getActionBadgeColor = (action, success) => {
    const actionUpper = action?.toUpperCase() || "";

    // If it's a LOGIN action that failed
    if (actionUpper === "LOGIN" && success === false) {
      return "bg-red-500/20 text-red-400";
    }

    switch (actionUpper) {
      case "CREATE":
        return "bg-green-500/20 text-green-400";
      case "UPDATE":
        return "bg-blue-500/20 text-blue-400";
      case "DELETE":
        return "bg-red-500/20 text-red-400";
      case "APPROVE":
        return "bg-emerald-500/20 text-emerald-400";
      case "REVIEW":
        return "bg-yellow-500/20 text-yellow-400";
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

  const getDisplayAction = (action, success) => {
    if (action?.toUpperCase() === "LOGIN" && success === false) {
      return "LOGIN_FAILED";
    }
    return action;
  };

  const getDescription = (log) => {
    // Handle failed login attempts (LOGIN action with success: false)
    if (
      log.action?.toUpperCase() === "LOGIN" &&
      log.metadata?.success === false
    ) {
      const email = log.metadata?.email || log.entityId || "Unknown email";
      const reason = log.metadata?.reason || "Invalid credentials";
      return `Failed login attempt for ${email} - Reason: ${reason}`;
    }

    // Handle successful login
    if (
      log.action?.toUpperCase() === "LOGIN" &&
      log.metadata?.success !== false
    ) {
      const email = log.user?.email || log.metadata?.email || "User";
      return `${email} logged in successfully`;
    }

    // Handle logout
    if (log.action?.toUpperCase() === "LOGOUT") {
      const email = log.user?.email || "User";
      return `${email} logged out`;
    }

    // Default description
    return log.metadata?.description || `${log.action} ${log.entity}`;
  };

  const getEntityDisplay = (log) => {
    // For failed login attempts, show "Authentication"
    if (
      log.action?.toUpperCase() === "LOGIN" &&
      log.metadata?.success === false
    ) {
      return "Authentication";
    }
    return log.entity || "System";
  };

  const actions = [
    { value: "all", label: "All Actions" },
    { value: "create", label: "Create" },
    { value: "update", label: "Update" },
    { value: "delete", label: "Delete" },
    { value: "approve", label: "Approve" },
    { value: "review", label: "Review" },
    { value: "reject", label: "Reject" },
    { value: "login", label: "Login" },
    { value: "logout", label: "Logout" },
    { value: "assign", label: "Assign" },
    { value: "complete", label: "Complete" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
  ];

  const entities = [
    { value: "all", label: "All Entities" },
    { value: "user", label: "Users" },
    { value: "request", label: "Requests" },
    { value: "directorate", label: "Directorates" },
    { value: "staff", label: "Staff" },
    { value: "report", label: "Reports" },
    { value: "service", label: "Services" },
    { value: "internprofile", label: "Interns" },
    { value: "innovatorprofile", label: "Innovators" },
    { value: "startupprofile", label: "Startups" },
    { value: "authentication", label: "Authentication" },
  ];

  const filteredLogs = auditLogs?.filter((log) => {
    // Filter by action
    if (filterAction !== "all") {
      const actionUpper = log.action?.toUpperCase();
      if (filterAction === "login_failed") {
        if (!(actionUpper === "LOGIN" && log.metadata?.success === false))
          return false;
      } else if (actionUpper !== filterAction.toUpperCase()) {
        return false;
      }
    }

    // Filter by entity
    if (filterEntity !== "all") {
      if (filterEntity === "authentication") {
        if (
          !(
            log.action?.toUpperCase() === "LOGIN" &&
            log.metadata?.success === false
          )
        )
          return false;
      } else if (!log.entity?.toLowerCase().includes(filterEntity)) {
        return false;
      }
    }

    // Filter by status (success/failed)
    if (filterStatus !== "all") {
      const isSuccess = log.metadata?.success !== false;
      if (filterStatus === "success" && !isSuccess) return false;
      if (filterStatus === "failed" && isSuccess) return false;
    }

    // Search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const description = getDescription(log).toLowerCase();
      return (
        log.action?.toLowerCase().includes(searchLower) ||
        getEntityDisplay(log).toLowerCase().includes(searchLower) ||
        log.user?.fullName?.toLowerCase().includes(searchLower) ||
        description.includes(searchLower) ||
        log.metadata?.email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalPages = Math.ceil((filteredLogs?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLogs = filteredLogs?.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedLog(null);
  };

  const totalLogs = auditLogs?.length || 0;
  const filteredTotal = filteredLogs?.length || 0;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sticky Header Section - Fixed at top */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-700" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Complete audit trail of all system activities
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                fetchAll();
                setCurrentPage(1);
              }}
              className="ml-auto p-2 hover:bg-gray-700 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white"
            >
              {actions.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
              <option value="login_failed">Login Failed</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white"
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white"
            >
              {entities.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Stats */}
          <div className="mt-4 flex justify-between items-center text-sm">
            <div className="text-gray-500">
              {filteredTotal > 0 ? (
                <>
                  Showing{" "}
                  <span className="text-white font-medium">
                    {currentLogs?.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-white font-medium">
                    {filteredTotal}
                  </span>{" "}
                  logs
                  {totalLogs !== filteredTotal && (
                    <span className="text-gray-600 ml-2">
                      (filtered from {totalLogs} total)
                    </span>
                  )}
                </>
              ) : (
                "No logs found"
              )}
            </div>
            {(filterAction !== "all" ||
              filterEntity !== "all" ||
              filterStatus !== "all" ||
              searchTerm) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterAction("all");
                  setFilterEntity("all");
                  setFilterStatus("all");
                }}
                className="text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Table Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Logs Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/90 border-b border-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Entity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    User / Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto" />
                    </td>
                  </tr>
                ) : currentLogs?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  currentLogs.map((log) => {
                    const isFailedLogin =
                      log.action?.toUpperCase() === "LOGIN" &&
                      log.metadata?.success === false;
                    const displayAction = getDisplayAction(
                      log.action,
                      log.metadata?.success,
                    );

                    return (
                      <Fragment key={log._id}>
                        <tr
                          className="hover:bg-gray-700/30 transition cursor-pointer"
                          onClick={() =>
                            setSelectedLog(
                              selectedLog?._id === log._id ? null : log,
                            )
                          }
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getActionIcon(log.action, log.metadata?.success)}
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(log.action, log.metadata?.success)}`}
                              >
                                {displayAction}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {getEntityDisplay(log)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400 max-w-md truncate">
                            {getDescription(log)}
                          </td>
                          <td className="px-4 py-3">
                            {isFailedLogin ? (
                              <div className="text-sm text-red-400">
                                {log.metadata?.email || "Unknown"}
                              </div>
                            ) : (
                              <>
                                <div className="text-sm text-white">
                                  {log.user?.fullName || "System"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {log.user?.email}
                                </div>
                              </>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {formatTimestamp(log.timestamp)}
                          </td>
                          <td className="px-4 py-3">
                            <ChevronRight
                              className={`w-4 h-4 text-gray-500 transition-transform ${
                                selectedLog?._id === log._id ? "rotate-90" : ""
                              }`}
                            />
                          </td>
                        </tr>
                        {selectedLog?._id === log._id && (
                          <tr className="bg-gray-700/20">
                            <td colSpan="6" className="px-4 py-4">
                              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                                {/* Show email and reason prominently for failed logins */}
                                {isFailedLogin && (
                                  <div className="space-y-2 mb-3 pb-3 border-b border-red-500/20">
                                    <div className="flex items-center gap-2 text-red-400">
                                      <AlertTriangle className="w-4 h-4" />
                                      <span className="text-sm font-semibold">
                                        Failed Login Attempt
                                      </span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-gray-400">
                                        Email:
                                      </span>{" "}
                                      <span className="text-red-300 font-mono ml-2">
                                        {log.metadata?.email ||
                                          log.entityId ||
                                          "Unknown"}
                                      </span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-gray-400">
                                        Reason:
                                      </span>{" "}
                                      <span className="text-red-300 ml-2">
                                        {log.metadata?.reason ||
                                          "Invalid credentials"}
                                      </span>
                                    </div>
                                    {log.ipAddress && (
                                      <div className="text-sm">
                                        <span className="text-gray-400">
                                          IP Address:
                                        </span>{" "}
                                        <span className="text-gray-300 ml-2">
                                          {log.ipAddress}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {log.entityId && !isFailedLogin && (
                                  <div className="text-sm">
                                    <span className="text-gray-400">
                                      Entity ID:
                                    </span>{" "}
                                    <span className="text-gray-300 font-mono ml-2">
                                      {log.entityId}
                                    </span>
                                  </div>
                                )}
                                {log.request && (
                                  <div className="text-sm">
                                    <span className="text-gray-400">
                                      Request ID:
                                    </span>{" "}
                                    <span className="text-gray-300 font-mono ml-2">
                                      {log.request}
                                    </span>
                                  </div>
                                )}
                                {log.oldValue && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">
                                      Old Value:
                                    </p>
                                    <pre className="text-xs text-gray-300 bg-gray-900/50 p-2 rounded max-h-40 overflow-auto">
                                      {JSON.stringify(log.oldValue, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.newValue && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">
                                      New Value:
                                    </p>
                                    <pre className="text-xs text-gray-300 bg-gray-900/50 p-2 rounded max-h-40 overflow-auto">
                                      {JSON.stringify(log.newValue, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.ipAddress && !isFailedLogin && (
                                  <div className="text-sm">
                                    <span className="text-gray-400">IP:</span>{" "}
                                    <span className="text-gray-300 ml-2">
                                      {log.ipAddress}
                                    </span>
                                  </div>
                                )}
                                {log.userAgent && (
                                  <div className="text-sm">
                                    <span className="text-gray-400">
                                      User Agent:
                                    </span>{" "}
                                    <span className="text-gray-300 text-xs break-all ml-2">
                                      {log.userAgent}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && filteredTotal > 0 && totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-3 py-2 text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page info */}
        {!loading && filteredTotal > 0 && totalPages > 1 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
