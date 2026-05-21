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
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedLog(null);
  }, [searchTerm, filterAction, filterEntity, filterStatus]);

  const getActionIcon = (action, success) => {
    const actionUpper = action?.toUpperCase() || "";

    if (actionUpper === "LOGIN" && success === false) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }

    switch (actionUpper) {
      case "CREATE":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "UPDATE":
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case "DELETE":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "APPROVE":
        return <CheckCircle className="w-4 h-4 text-[#2563eb]" />;
      case "REVIEW":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "REJECT":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "LOGIN":
        return <LogIn className="w-4 h-4 text-[#2563eb]" />;
      case "LOGOUT":
        return <LogOut className="w-4 h-4 text-[#6b7280]" />;
      case "ASSIGN":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "ROUTE":
        return <Route className="w-4 h-4 text-yellow-500" />;
      case "COMPLETE":
        return <Flag className="w-4 h-4 text-blue-500" />;
      default:
        return <History className="w-4 h-4 text-[#6b7280]" />;
    }
  };

  const getActionBadgeColor = (action, success) => {
    const actionUpper = action?.toUpperCase() || "";

    if (actionUpper === "LOGIN" && success === false) {
      return "bg-red-100 text-red-700";
    }

    switch (actionUpper) {
      case "CREATE":
        return "bg-green-100 text-green-700";
      case "UPDATE":
        return "bg-blue-100 text-blue-700";
      case "DELETE":
        return "bg-red-100 text-red-700";
      case "APPROVE":
        return "bg-[#EEF2FF] text-[#1d4ed8]";
      case "REVIEW":
        return "bg-yellow-100 text-yellow-700";
      case "REJECT":
        return "bg-red-100 text-red-700";
      case "LOGIN":
        return "bg-[#EEF2FF] text-[#1d4ed8]";
      case "LOGOUT":
        return "bg-gray-100 text-[#6b7280]";
      case "ASSIGN":
        return "bg-purple-100 text-purple-700";
      case "ROUTE":
        return "bg-yellow-100 text-yellow-700";
      case "COMPLETE":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-[#6b7280]";
    }
  };

  const getDisplayAction = (action, success) => {
    if (action?.toUpperCase() === "LOGIN" && success === false) {
      return "LOGIN_FAILED";
    }
    return action;
  };

  const getDescription = (log) => {
    if (
      log.action?.toUpperCase() === "LOGIN" &&
      log.metadata?.success === false
    ) {
      const email = log.metadata?.email || log.entityId || "Unknown email";
      const reason = log.metadata?.reason || "Invalid credentials";
      return `Failed login attempt for ${email} - Reason: ${reason}`;
    }

    if (
      log.action?.toUpperCase() === "LOGIN" &&
      log.metadata?.success !== false
    ) {
      const email = log.user?.email || log.metadata?.email || "User";
      return `${email} logged in successfully`;
    }

    if (log.action?.toUpperCase() === "LOGOUT") {
      const email = log.user?.email || "User";
      return `${email} logged out`;
    }

    return log.metadata?.description || `${log.action} ${log.entity}`;
  };

  const getEntityDisplay = (log) => {
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
    if (filterAction !== "all") {
      const actionUpper = log.action?.toUpperCase();
      if (filterAction === "login_failed") {
        if (!(actionUpper === "LOGIN" && log.metadata?.success === false))
          return false;
      } else if (actionUpper !== filterAction.toUpperCase()) {
        return false;
      }
    }

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

    if (filterStatus !== "all") {
      const isSuccess = log.metadata?.success !== false;
      if (filterStatus === "success" && !isSuccess) return false;
      if (filterStatus === "failed" && isSuccess) return false;
    }

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
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-[#6b7280] hover:text-[#2563eb] transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-[#E5E7EB]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center shadow-lg">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">Activity Logs</h1>
                <p className="text-sm text-[#6b7280] mt-0.5">
                  Complete audit trail of all system activities
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                fetchAll();
                setCurrentPage(1);
              }}
              className="ml-auto p-2 hover:bg-[#F3F4F6] rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-[#6b7280] hover:text-[#2563eb]" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-shadow shadow-sm"
              />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent shadow-sm"
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
              className="px-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent shadow-sm"
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
              className="px-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent shadow-sm"
            >
              {entities.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm">
            <div className="text-[#6b7280]">
              {filteredTotal > 0 ? (
                <>
                  Showing{" "}
                  <span className="text-[#111827] font-medium">
                    {currentLogs?.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-[#111827] font-medium">
                    {filteredTotal}
                  </span>{" "}
                  logs
                  {totalLogs !== filteredTotal && (
                    <span className="text-[#6b7280] ml-2">
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
                className="text-[#2563eb] hover:text-[#1d4ed8] text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    User / Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb] mx-auto" />
                    </td>
                  </tr>
                ) : currentLogs?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center text-[#6b7280]"
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
                          className="hover:bg-[#F9FAFB] transition cursor-pointer"
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
                          <td className="px-4 py-3 text-sm text-[#374151]">
                            {getEntityDisplay(log)}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#4b5563] max-w-md truncate">
                            {getDescription(log)}
                          </td>
                          <td className="px-4 py-3">
                            {isFailedLogin ? (
                              <div className="text-sm text-red-600 font-medium">
                                {log.metadata?.email || "Unknown"}
                              </div>
                            ) : (
                              <>
                                <div className="text-sm font-medium text-[#111827]">
                                  {log.user?.fullName || "System"}
                                </div>
                                <div className="text-xs text-[#6b7280]">
                                  {log.user?.email}
                                </div>
                              </>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#6b7280]">
                            {formatTimestamp(log.timestamp)}
                          </td>
                          <td className="px-4 py-3">
                            <ChevronRight
                              className={`w-4 h-4 text-[#9ca3af] transition-transform ${
                                selectedLog?._id === log._id ? "rotate-90" : ""
                              }`}
                            />
                          </td>
                        </tr>
                        {selectedLog?._id === log._id && (
                          <tr className="bg-[#F9FAFB]">
                            <td colSpan="6" className="px-4 py-4">
                              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-2 shadow-sm">
                                {isFailedLogin && (
                                  <div className="space-y-2 mb-3 pb-3 border-b border-red-100">
                                    <div className="flex items-center gap-2 text-red-600">
                                      <AlertTriangle className="w-4 h-4" />
                                      <span className="text-sm font-semibold">
                                        Failed Login Attempt
                                      </span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-[#6b7280]">
                                        Email:
                                      </span>{" "}
                                      <span className="text-red-600 font-mono ml-2">
                                        {log.metadata?.email ||
                                          log.entityId ||
                                          "Unknown"}
                                      </span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-[#6b7280]">
                                        Reason:
                                      </span>{" "}
                                      <span className="text-red-600 ml-2">
                                        {log.metadata?.reason ||
                                          "Invalid credentials"}
                                      </span>
                                    </div>
                                    {log.ipAddress && (
                                      <div className="text-sm">
                                        <span className="text-[#6b7280]">
                                          IP Address:
                                        </span>{" "}
                                        <span className="text-[#374151] ml-2">
                                          {log.ipAddress}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {log.entityId && !isFailedLogin && (
                                  <div className="text-sm">
                                    <span className="text-[#6b7280]">
                                      Entity ID:
                                    </span>{" "}
                                    <span className="text-[#374151] font-mono ml-2 bg-[#F3F4F6] px-1 py-0.5 rounded">
                                      {log.entityId}
                                    </span>
                                  </div>
                                )}
                                {log.request && (
                                  <div className="text-sm">
                                    <span className="text-[#6b7280]">
                                      Request ID:
                                    </span>{" "}
                                    <span className="text-[#374151] font-mono ml-2 bg-[#F3F4F6] px-1 py-0.5 rounded">
                                      {log.request}
                                    </span>
                                  </div>
                                )}
                                {log.oldValue && (
                                  <div>
                                    <p className="text-sm font-medium text-[#6b7280] mb-1">
                                      Old Value:
                                    </p>
                                    <pre className="text-xs text-[#374151] bg-[#F3F4F6] border border-[#E5E7EB] p-3 rounded-lg max-h-40 overflow-auto whitespace-pre-wrap">
                                      {JSON.stringify(log.oldValue, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.newValue && (
                                  <div>
                                    <p className="text-sm font-medium text-[#6b7280] mb-1">
                                      New Value:
                                    </p>
                                    <pre className="text-xs text-[#374151] bg-[#F3F4F6] border border-[#E5E7EB] p-3 rounded-lg max-h-40 overflow-auto whitespace-pre-wrap">
                                      {JSON.stringify(log.newValue, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.ipAddress && !isFailedLogin && (
                                  <div className="text-sm">
                                    <span className="text-[#6b7280]">IP:</span>{" "}
                                    <span className="text-[#374151] ml-2 font-mono text-xs bg-[#F3F4F6] px-1 py-0.5 rounded">
                                      {log.ipAddress}
                                    </span>
                                  </div>
                                )}
                                {log.userAgent && (
                                  <div className="text-sm">
                                    <span className="text-[#6b7280]">
                                      User Agent:
                                    </span>{" "}
                                    <span className="text-[#374151] text-xs break-all ml-2">
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

        {!loading && filteredTotal > 0 && totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4b5563] hover:bg-[#F9FAFB] hover:text-[#111827] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4b5563] hover:bg-[#F9FAFB] hover:text-[#111827] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-3 py-2 text-[#6b7280]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
                      currentPage === page
                        ? "bg-[#2563eb] text-white border border-[#2563eb]"
                        : "bg-white border border-[#E5E7EB] text-[#4b5563] hover:bg-[#F9FAFB] hover:text-[#111827]"
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
              className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4b5563] hover:bg-[#F9FAFB] hover:text-[#111827] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4b5563] hover:bg-[#F9FAFB] hover:text-[#111827] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {!loading && filteredTotal > 0 && totalPages > 1 && (
          <div className="mt-4 text-center text-sm text-[#6b7280]">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
