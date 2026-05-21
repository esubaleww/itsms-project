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
          color: "text-[#2563eb]",
          bg: "bg-[#EEF2FF]",
          border: "border-[#2563eb]/30",
          icon: CheckCircle,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: XCircle,
          label: "Rejected",
        };
      case "reviewed":
        return {
          color: "text-[#2563eb]",
          bg: "bg-[#EEF2FF]",
          border: "border-[#2563eb]/30",
          icon: BookOpen,
          label: "Reviewed",
        };
      default:
        return {
          color: "text-amber-700",
          bg: "bg-amber-50",
          border: "border-amber-200",
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
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] p-5 animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-20 bg-[#E5E7EB] rounded-full"></div>
                  <div className="h-4 w-24 bg-[#E5E7EB] rounded"></div>
                </div>
                <div className="h-5 w-3/4 bg-[#E5E7EB] rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-[#E5E7EB] rounded"></div>
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-full mb-4 border border-[#E5E7EB]">
          <FileText className="w-10 h-10 text-[#9ca3af]" />
        </div>
        <p className="text-[#6b7280] text-lg">No reports submitted</p>
        <p className="text-sm text-[#6b7280] mt-1 max-w-md mx-auto">
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
              className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200"
            >
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#374151] border border-[#D1D5DB]">
                        {getReportTypeIcon(report.type)}
                        {getReportTypeLabel(report.type)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                        <Calendar className="w-3 h-3" />
                        {formatDateTime(report.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-[#111827] font-semibold text-lg mb-2">
                      {report.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b7280] mb-3">
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
                        <span className="text-xs text-[#6b7280]">
                          Performance:
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
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
                                className="text-xs px-2 py-0.5 bg-[#F3F4F6] rounded-full text-[#374151] border border-[#E5E7EB]"
                              >
                                {skill}
                              </span>
                            ))}
                          {report.data.skillsAcquired.length > 3 && (
                            <span className="text-xs px-2 py-0.5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-full text-[#6b7280]">
                              +{report.data.skillsAcquired.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                    <p className="text-[#374151] text-sm line-clamp-2 mb-3">
                      {getSummaryText(report)}
                    </p>

                    {hasFeedback && !isExpanded && (
                      <div className="mt-3 flex items-start gap-2 text-xs bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg p-2">
                        <MessageSquare className="w-3 h-3 text-[#2563eb] mt-0.5 shrink-0" />
                        <span className="text-[#6b7280] line-clamp-1">
                          Feedback: {report.feedback}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {isPending && onReview && !showReview && (
                      <button
                        onClick={() => setShowReviewForm(report._id)}
                        className="p-2 rounded-lg transition text-[#2563eb] hover:bg-[#EEF2FF]"
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
                            className="p-2 rounded-lg transition text-[#2563eb] hover:bg-[#EEF2FF]"
                            title="Approve Report"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {!showReject && (
                          <button
                            onClick={() => setShowRejectForm(report._id)}
                            className="p-2 rounded-lg transition text-red-600 hover:bg-red-50"
                            title="Reject Report"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}

                    <button
                      onClick={() => handleViewDetails(report._id)}
                      className="text-[#6b7280] hover:text-[#111827] p-2 rounded-lg hover:bg-[#F3F4F6] transition"
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
                          ? "text-[#2563eb] bg-[#EEF2FF]"
                          : "text-[#6b7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
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
                  <div className="mt-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg border border-[#D1D5DB]">
                    <p className="text-sm text-[#374151] mb-2">
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
                      className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb]"
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
                        className="px-4 py-2 border border-[#D1D5DB] rounded-lg text-[#374151] hover:bg-[#F3F4F6]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReview(report._id)}
                        disabled={!reviewFeedback[report._id]?.trim()}
                        className="btn-institutional px-4 py-2 disabled:opacity-50"
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
                  <div className="mt-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg border border-[#D1D5DB]">
                    <p className="text-sm text-[#374151] mb-2">
                      Approve this report?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowApproveForm(null);
                        }}
                        className="px-4 py-2 border border-[#D1D5DB] rounded-lg text-[#374151] hover:bg-[#F3F4F6]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleApprove(report._id)}
                        className="btn-institutional px-4 py-2"
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
                  <div className="mt-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg border border-[#D1D5DB]">
                    <p className="text-sm text-[#374151] mb-2">
                      Reason for rejection:
                    </p>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-red-500"
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => {
                          setShowRejectForm(null);
                          setRejectReason("");
                        }}
                        className="px-4 py-2 border border-[#D1D5DB] rounded-lg text-[#374151] hover:bg-[#F3F4F6]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReject(report._id)}
                        disabled={!rejectReason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 font-medium"
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
                    className="border-t border-[#E5E7EB] overflow-hidden"
                  >
                    <div className="p-5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-5">
                      <div>
                        <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                          Detailed Summary
                        </h4>
                        <p className="text-[#111827] text-sm">
                          {getSummaryText(report)}
                        </p>
                      </div>

                      {report.data?.recommendation && (
                        <div>
                          <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                            Recommendation
                          </h4>
                          <p className="text-[#374151] text-sm">
                            {report.data.recommendation}
                          </p>
                        </div>
                      )}

                      {report.data?.skillsAcquired &&
                        report.data.skillsAcquired.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                              Skills Acquired
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {report.data.skillsAcquired.map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 bg-[#F3F4F6] rounded-full text-[#374151] border border-[#E5E7EB]"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {report.data?.certificationRecommended !== undefined && (
                        <div>
                          <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                            Certification Recommendation
                          </h4>
                          <p className="text-[#374151] text-sm">
                            {report.data.certificationRecommended
                              ? "Yes, recommended"
                              : "Not recommended"}
                          </p>
                        </div>
                      )}

                      {hasFeedback && (
                        <div>
                          <h4 className="text-sm font-medium text-[#6b7280] mb-2">
                            Director Feedback
                          </h4>
                          <div className="bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg p-3">
                            <p className="text-[#374151] text-sm">
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
