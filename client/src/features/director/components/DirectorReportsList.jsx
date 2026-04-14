import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Users,
  Clock,
  MessageSquare,
  ChevronRight,
  Building2,
  BookOpen,
} from "lucide-react";

const DirectorReportsList = ({
  reports = [],
  onViewDetails,
  onReview,
  onApprove,
  onReject,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewModal, setReviewModal] = useState({
    show: false,
    reportId: null,
  });
  const [reviewFeedback, setReviewFeedback] = useState("");

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
          border: "border-emerald-500/30",
          icon: CheckCircle,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          icon: XCircle,
          label: "Rejected",
        };
      case "reviewed":
        return {
          color: "text-blue-400",
          bg: "bg-blue-500/20",
          border: "border-blue-500/30",
          icon: BookOpen,
          label: "Reviewed",
        };
      default:
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReview = async (reportId) => {
    if (!onReview) return;
    setReviewModal({ show: true, reportId });
  };

  const submitReview = async () => {
    if (!reviewFeedback.trim()) {
      alert("Please provide feedback before reviewing");
      return;
    }
    setActionLoading(reviewModal.reportId);
    try {
      await onReview(reviewModal.reportId, reviewFeedback, "reviewed");
      setReviewModal({ show: false, reportId: null });
      setReviewFeedback("");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (reportId) => {
    if (!onApprove) return;
    const comments = prompt("Enter approval comments (optional):");
    setActionLoading(reportId);
    try {
      await onApprove(reportId, comments);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reportId) => {
    if (!onReject) return;
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      setActionLoading(reportId);
      try {
        await onReject(reportId, reason);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleViewDetails = (reportId) => {
    if (onViewDetails) {
      onViewDetails(reportId);
    } else {
      setExpandedId(expandedId === reportId ? null : reportId);
    }
  };

  // Loading state
  if (reports === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl border border-gray-700 p-5 animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-700 rounded"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4 border border-gray-700">
          <FileText className="w-10 h-10 text-gray-600" />
        </div>
        <p className="text-gray-400 text-lg">No reports submitted</p>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Director reports will appear here once submitted. Reports help track
          progress and performance metrics.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report, index) => {
          const statusConfig = getStatusConfig(report.status);
          const StatusIcon = statusConfig.icon;
          const isExpanded = expandedId === report._id;
          const isPending = report.status === "submitted";
          const isReviewed = report.status === "reviewed";
          const isLoading = actionLoading === report._id;
          const hasMetrics =
            report.metrics && Object.keys(report.metrics).length > 0;
          const hasFeedback =
            report.feedback && report.feedback.trim().length > 0;

          return (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
            >
              {/* Main Content */}
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Side - Report Info */}
                  <div className="flex-1">
                    {/* Status and Date Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDateTime(report.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {report.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                      {report.team && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Team: {report.team?.name}
                        </span>
                      )}
                      {report.submittedBy && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          By: {report.submittedBy?.fullName}
                        </span>
                      )}
                      {report.directorate && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {report.directorate?.name}
                        </span>
                      )}
                    </div>

                    {/* Period */}
                    {report.period && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(report.period?.startDate)} -{" "}
                          {formatDate(report.period?.endDate)}
                        </span>
                      </div>
                    )}

                    {/* Summary Preview */}
                    {report.summary && (
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                        {report.summary}
                      </p>
                    )}

                    {/* Quick Metrics */}
                    {hasMetrics && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {report.metrics.applicationsProcessed !== undefined && (
                          <div className="flex items-center gap-1 text-xs bg-gray-700/50 px-2 py-1 rounded-lg">
                            <FileText className="w-3 h-3 text-blue-400" />
                            <span className="text-gray-300">
                              {report.metrics.applicationsProcessed} processed
                            </span>
                          </div>
                        )}
                        {report.metrics.approvedApplications !== undefined && (
                          <div className="flex items-center gap-1 text-xs bg-gray-700/50 px-2 py-1 rounded-lg">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span className="text-gray-300">
                              {report.metrics.approvedApplications} approved
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Feedback Preview */}
                    {hasFeedback && !isExpanded && (
                      <div className="mt-3 flex items-start gap-2 text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                        <MessageSquare className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                        <span className="text-gray-400 line-clamp-1">
                          Feedback: {report.feedback}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex items-center gap-1">
                    {/* Review Button - Only for pending reports */}
                    {isPending && onReview && (
                      <button
                        onClick={() => handleReview(report._id)}
                        disabled={isLoading}
                        className={`p-2 rounded-lg transition ${
                          isLoading
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-blue-400 hover:bg-blue-500/20"
                        }`}
                        title="Review Report"
                      >
                        {isLoading && actionLoading === report._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                        ) : (
                          <BookOpen className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    {/* Approve/Reject Buttons - Only for reviewed reports */}
                    {isReviewed && onApprove && onReject && (
                      <>
                        <button
                          onClick={() => handleApprove(report._id)}
                          disabled={isLoading}
                          className={`p-2 rounded-lg transition ${
                            isLoading
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                          title="Approve Report"
                        >
                          {isLoading && actionLoading === report._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent"></div>
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(report._id)}
                          disabled={isLoading}
                          className={`p-2 rounded-lg transition ${
                            isLoading
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-red-400 hover:bg-red-500/20"
                          }`}
                          title="Reject Report"
                        >
                          {isLoading && actionLoading === report._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div>
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleViewDetails(report._id)}
                      className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : report._id)
                      }
                      className={`p-2 rounded-lg transition ${
                        isExpanded
                          ? "text-emerald-400 bg-emerald-500/20"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-700 overflow-hidden"
                  >
                    <div className="p-5 bg-gray-800/50 space-y-5">
                      {/* ... rest of expanded section remains the same ... */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Review Modal */}
      {reviewModal.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700"
          >
            <div className="p-5 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Review Report
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Provide feedback before marking as reviewed
              </p>
            </div>
            <div className="p-5">
              <textarea
                rows={4}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder="Enter your feedback and comments..."
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button
                onClick={() => setReviewModal({ show: false, reportId: null })}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={!reviewFeedback.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Submit Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DirectorReportsList;
