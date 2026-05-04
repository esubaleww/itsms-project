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
  Send,
  GraduationCap,
  Lightbulb,
  Rocket,
  School,
  Award,
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
  const [reviewFeedback, setReviewFeedback] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [showApproveForm, setShowApproveForm] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

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

  const getReportTypeIcon = (type) => {
    switch (type) {
      case "team_report":
        return <Users className="w-4 h-4" />;
      case "advisor_report":
        return <GraduationCap className="w-4 h-4" />;
      case "mentor_report":
        return <Lightbulb className="w-4 h-4" />;
      case "startup_mentor_report":
        return <Rocket className="w-4 h-4" />;
      case "trainer_report":
        return <School className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getReportTypeLabel = (type) => {
    switch (type) {
      case "team_report":
        return "Team Report";
      case "advisor_report":
        return "Advisor Summary";
      case "mentor_report":
        return "Mentor Summary";
      case "startup_mentor_report":
        return "Startup Mentor Summary";
      case "trainer_report":
        return "Trainer Summary";
      default:
        return "Report";
    }
  };

  const getSubmittedByName = (report) => {
    if (report.submittedBy?.fullName) return report.submittedBy.fullName;
    if (report.data?.submittedBy?.fullName)
      return report.data.submittedBy.fullName;
    if (report.submittedBy?.name) return report.submittedBy.name;
    return "Unknown";
  };

  const getParticipantName = (report) => {
    if (report.participant?.fullName) return report.participant.fullName;
    if (report.participant?.companyName) return report.participant.companyName;
    if (report.data?.traineeName) return report.data.traineeName;
    return "N/A";
  };

  const getSummaryText = (report) => {
    if (report.summary) return report.summary;
    if (report.data?.summary) return report.data.summary;
    if (report.data?.comments) return report.data.comments;
    if (report.data?.overallPerformance) {
      return `Overall Performance: ${report.data.overallPerformance}. ${report.data.comments || ""}`;
    }
    if (report.data?.overallProgress) {
      return `Overall Progress: ${report.data.overallProgress}. ${report.data.comments || ""}`;
    }
    return "No summary available";
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
    const feedback = reviewFeedback[reportId];
    if (!feedback || !feedback.trim()) {
      alert("Please provide feedback before reviewing");
      return;
    }
    setActionLoading(reportId);
    try {
      await onReview(reportId, feedback);
      setShowReviewForm(null);
      setReviewFeedback((prev) => ({ ...prev, [reportId]: "" }));
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (reportId) => {
    if (!onApprove) return;
    setActionLoading(reportId);
    try {
      await onApprove(reportId);
      setShowApproveForm(null);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reportId) => {
    if (!onReject) return;
    if (!rejectReason || !rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    setActionLoading(reportId);
    try {
      await onReject(reportId, rejectReason);
      setShowRejectForm(null);
      setRejectReason("");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (reportId) => {
    if (onViewDetails) {
      onViewDetails(reportId);
    } else {
      setExpandedId(expandedId === reportId ? null : reportId);
    }
  };

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

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4 border border-gray-700">
          <FileText className="w-10 h-10 text-gray-600" />
        </div>
        <p className="text-gray-400 text-lg">No reports submitted</p>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Reports will appear here once submitted.
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
          const isPending =
            report.status === "submitted" || report.status === "pending";
          const isReviewed = report.status === "reviewed";
          const isLoading = actionLoading === report._id;
          const hasFeedback =
            report.feedback && report.feedback.trim().length > 0;
          const showReview = showReviewForm === report._id;
          const showApprove = showApproveForm === report._id;
          const showReject = showRejectForm === report._id;

          return (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
            >
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600">
                        {getReportTypeIcon(report.type)}
                        {getReportTypeLabel(report.type)}
                      </span>
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

                    <h3 className="text-white font-semibold text-lg mb-2">
                      {report.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Submitted by: {getSubmittedByName(report)}
                      </span>
                      {report.type !== "team_report" && (
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Trainee: {getParticipantName(report)}
                        </span>
                      )}
                      {report.team && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Team: {report.team?.name}
                        </span>
                      )}
                    </div>

                    {report.data?.overallPerformance && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-400">
                          Performance:
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                          {report.data.overallPerformance}
                        </span>
                      </div>
                    )}

                    {report.data?.skillsAcquired &&
                      report.data.skillsAcquired.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {report.data.skillsAcquired
                            .slice(0, 3)
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300"
                              >
                                {skill}
                              </span>
                            ))}
                          {report.data.skillsAcquired.length > 3 && (
                            <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-400">
                              +{report.data.skillsAcquired.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                      {getSummaryText(report)}
                    </p>

                    {hasFeedback && !isExpanded && (
                      <div className="mt-3 flex items-start gap-2 text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                        <MessageSquare className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                        <span className="text-gray-400 line-clamp-1">
                          Feedback: {report.feedback}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {isPending && onReview && !showReview && (
                      <button
                        onClick={() => setShowReviewForm(report._id)}
                        className="p-2 rounded-lg transition text-blue-400 hover:bg-blue-500/20"
                        title="Review Report"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                    )}

                    {isReviewed && onApprove && onReject && (
                      <>
                        {!showApprove && (
                          <button
                            onClick={() => setShowApproveForm(report._id)}
                            className="p-2 rounded-lg transition text-emerald-400 hover:bg-emerald-500/20"
                            title="Approve Report"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {!showReject && (
                          <button
                            onClick={() => setShowRejectForm(report._id)}
                            className="p-2 rounded-lg transition text-red-400 hover:bg-red-500/20"
                            title="Reject Report"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
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

                {showReview && (
                  <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-300 mb-2">
                      Provide feedback for this report:
                    </p>
                    <textarea
                      rows={3}
                      value={reviewFeedback[report._id] || ""}
                      onChange={(e) =>
                        setReviewFeedback((prev) => ({
                          ...prev,
                          [report._id]: e.target.value,
                        }))
                      }
                      placeholder="Enter your feedback and comments..."
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => {
                          setShowReviewForm(null);
                          setReviewFeedback((prev) => ({
                            ...prev,
                            [report._id]: "",
                          }));
                        }}
                        className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReview(report._id)}
                        disabled={!reviewFeedback[report._id]?.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Submit Review
                      </button>
                    </div>
                  </div>
                )}

                {showApprove && (
                  <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-300 mb-2">
                      Approve this report?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowApproveForm(null);
                        }}
                        className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleApprove(report._id)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                    </div>
                  </div>
                )}

                {showReject && (
                  <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-300 mb-2">
                      Reason for rejection:
                    </p>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => {
                          setShowRejectForm(null);
                          setRejectReason("");
                        }}
                        className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReject(report._id)}
                        disabled={!rejectReason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                          Detailed Summary
                        </h4>
                        <p className="text-white text-sm">
                          {getSummaryText(report)}
                        </p>
                      </div>

                      {report.data?.recommendation && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Recommendation
                          </h4>
                          <p className="text-gray-300 text-sm">
                            {report.data.recommendation}
                          </p>
                        </div>
                      )}

                      {report.data?.skillsAcquired &&
                        report.data.skillsAcquired.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">
                              Skills Acquired
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {report.data.skillsAcquired.map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {report.data?.certificationRecommended !== undefined && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Certification Recommendation
                          </h4>
                          <p className="text-gray-300 text-sm">
                            {report.data.certificationRecommended
                              ? "Yes, recommended"
                              : "Not recommended"}
                          </p>
                        </div>
                      )}

                      {hasFeedback && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Director Feedback
                          </h4>
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <p className="text-gray-300 text-sm">
                              {report.feedback}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default DirectorReportsList;
