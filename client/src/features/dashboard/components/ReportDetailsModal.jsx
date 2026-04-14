import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Building2,
  TrendingUp,
  MessageSquare,
  Users,
} from "lucide-react";

const ReportDetailsModal = ({ report, onClose, onApprove, onReject }) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    achievements: true,
    challenges: true,
    nextSteps: true,
    metrics: true,
  });
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
          icon: Eye,
          label: "Under Review",
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
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApprove = async () => {
    if (onApprove) {
      setActionLoading(true);
      try {
        await onApprove(report._id);
        onClose();
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (onReject && rejectReason.trim()) {
      setActionLoading(true);
      try {
        await onReject(report._id, rejectReason);
        setShowRejectInput(false);
        setRejectReason("");
        onClose();
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (!report) return null;

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;
  const isPending =
    report.status === "pending" || report.status === "submitted";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800/90 border-b border-gray-700 p-6 flex justify-between items-center z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {report.title || "Report Details"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
                <span className="text-xs text-gray-500">
                  ID: {report._id?.slice(-8) || "N/A"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Report Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                <span>Period</span>
              </div>
              <p className="font-medium text-white">
                {formatDate(report.periodStart)} -{" "}
                {formatDate(report.periodEnd)}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <User className="w-4 h-4" />
                <span>Submitted By</span>
              </div>
              <p className="font-medium text-white">
                {report.submittedBy?.fullName || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {report.submittedBy?.position || "Team Lead"}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Building2 className="w-4 h-4" />
                <span>Team / Directorate</span>
              </div>
              <p className="font-medium text-white">
                {report.team?.name || report.directorate?.name || "N/A"}
              </p>
              {report.team?.members?.length > 0 && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {report.team.members.length} members
                </p>
              )}
            </div>
          </div>

          {/* Metrics Section */}
          {report.metrics && Object.keys(report.metrics).length > 0 && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("metrics")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">
                    Performance Metrics
                  </span>
                </div>
                {expandedSections.metrics ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.metrics && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {report.metrics.applicationsProcessed !== undefined && (
                          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-blue-400">
                              {report.metrics.applicationsProcessed}
                            </p>
                            <p className="text-xs text-gray-400">
                              Applications Processed
                            </p>
                          </div>
                        )}
                        {report.metrics.approvedApplications !== undefined && (
                          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-emerald-400">
                              {report.metrics.approvedApplications}
                            </p>
                            <p className="text-xs text-gray-400">Approved</p>
                          </div>
                        )}
                        {report.metrics.completedRequests !== undefined && (
                          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-purple-400">
                              {report.metrics.completedRequests}
                            </p>
                            <p className="text-xs text-gray-400">Completed</p>
                          </div>
                        )}
                        {report.metrics.completionRate !== undefined && (
                          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-orange-400">
                              {report.metrics.completionRate}%
                            </p>
                            <p className="text-xs text-gray-400">
                              Completion Rate
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Summary Section */}
          <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection("summary")}
              className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">
                  Executive Summary
                </span>
              </div>
              {expandedSections.summary ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.summary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-700"
                >
                  <div className="p-4">
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {report.summary || "No summary provided"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Achievements Section */}
          {report.achievements && report.achievements.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("achievements")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">
                    Key Achievements
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    {report.achievements.length}
                  </span>
                </div>
                {expandedSections.achievements ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.achievements && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4">
                      <ul className="space-y-2">
                        {report.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span className="text-gray-300">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Challenges Section */}
          {report.challenges && report.challenges.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("challenges")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="font-semibold text-white">
                    Challenges & Issues
                  </span>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                    {report.challenges.length}
                  </span>
                </div>
                {expandedSections.challenges ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.challenges && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4">
                      <ul className="space-y-2">
                        {report.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            <span className="text-gray-300">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Next Steps Section */}
          {report.nextSteps && report.nextSteps.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("nextSteps")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">
                    Next Steps / Action Items
                  </span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    {report.nextSteps.length}
                  </span>
                </div>
                {expandedSections.nextSteps ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.nextSteps && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4">
                      <ul className="space-y-2">
                        {report.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-400 font-medium min-w-6">
                              {index + 1}.
                            </span>
                            <span className="text-gray-300">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Review History */}
          {report.reviewHistory && report.reviewHistory.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 p-4">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Review History
              </h3>
              <div className="space-y-3">
                {report.reviewHistory.map((review, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-emerald-500 pl-3"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-white">
                        {review.reviewer?.fullName}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 text-xs">
                        {formatDateTime(review.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {review.comment}
                    </p>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                        review.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Review Comments */}
          {report.adminReview && (
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-4">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Admin Review
              </h3>
              <p className="text-sm text-gray-300">
                {report.adminReview.comment || "No comments"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Reviewed by: {report.adminReview.by?.fullName || "Admin"} on{" "}
                {formatDateTime(report.adminReview.date)}
              </p>
            </div>
          )}

          {/* Timeline */}
          {report.timeline && report.timeline.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 p-4">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Activity Timeline
              </h3>
              <div className="space-y-3">
                {report.timeline.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5"></div>
                      {index < report.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-700 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-medium text-white">
                        {event.action}
                      </p>
                      {event.details && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {event.details}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {event.by?.fullName || "System"} •{" "}
                        {formatDateTime(event.timestamp || event.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons (for pending reports) */}
          {isPending && onApprove && onReject && (
            <div className="sticky bottom-0 bg-gray-800/90 border-t border-gray-700 p-4 -mx-6 px-6 mt-6 rounded-b-2xl backdrop-blur-sm">
              {!showRejectInput ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Approve Report
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={actionLoading}
                    className="flex-1 border border-red-500/50 text-red-400 py-2.5 rounded-lg hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Report
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleReject}
                      disabled={!rejectReason.trim() || actionLoading}
                      className="flex-1 bg-linear-to-r from-red-500 to-red-700 text-white py-2.5 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                      {actionLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Confirm Rejection
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectInput(false);
                        setRejectReason("");
                      }}
                      disabled={actionLoading}
                      className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata Footer */}
          <div className="text-xs text-gray-500 border-t border-gray-700 pt-4 flex flex-wrap justify-between gap-2">
            <span>Created: {formatDateTime(report.createdAt)}</span>
            {report.updatedAt && report.updatedAt !== report.createdAt && (
              <span>Last updated: {formatDateTime(report.updatedAt)}</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportDetailsModal;
