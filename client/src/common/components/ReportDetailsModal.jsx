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
  Briefcase,
  Target,
  Award,
  BarChart3,
  Download,
  File,
  Lightbulb,
  Rocket,
  School,
  GraduationCap,
  Star,
} from "lucide-react";
import DocumentItem from "../components/DocumentItem";

const ReportDetailsModal = ({
  report,
  onClose,
  onApprove,
  onReject,
  reportType,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    achievements: true,
    challenges: true,
    nextSteps: true,
    metrics: true,
    attachments: true,
    timeline: true,
    skills: true,
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
          color: "text-accent",
          bg: "bg-blue-50",
          border: "border-accent/30",
          icon: CheckCircle,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-500",
          bg: "bg-red-50",
          border: "border-red-500/30",
          icon: XCircle,
          label: "Rejected",
        };
      case "reviewed":
        return {
          color: "text-blue-500",
          bg: "bg-blue-50",
          border: "border-blue-500/30",
          icon: Eye,
          label: "Under Review",
        };
      case "pending_director_review":
        return {
          color: "text-yellow-500",
          bg: "bg-yellow-50",
          border: "border-yellow-500/30",
          icon: Clock,
          label: "Pending Review",
        };
      default:
        return {
          color: "text-yellow-500",
          bg: "bg-yellow-50",
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
        await onApprove(report._id, reportType, null);
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
        await onReject(report._id, reportType, rejectReason);
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
    report.status === "submitted" ||
    report.status === "pending" ||
    report.status === "pending_director_review";

  const isTrainerReport = report.type === "trainer_report";
  const isAdvisorReport = report.type === "advisor_report";
  const isMentorReport = report.type === "mentor_report";
  const isTeamReport = report.type === "team_report";

  const getReportIcon = () => {
    if (isTrainerReport) return <School className="w-5 h-5" />;
    if (isAdvisorReport) return <GraduationCap className="w-5 h-5" />;
    if (isMentorReport) return <Lightbulb className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getDisplayMetrics = () => {
    const metrics = [];

    if (isTrainerReport || isAdvisorReport || isMentorReport) {
      const data = report.data || {};

      if (data.overallPerformance) {
        metrics.push({
          label: "Overall Performance",
          value: data.overallPerformance,
          icon: Star,
          color: "purple",
        });
      }
      if (data.attendanceRate !== undefined) {
        metrics.push({
          label: "Attendance Rate",
          value: `${data.attendanceRate}%`,
          icon: TrendingUp,
          color: "emerald",
        });
      }
      if (data.certificationRecommended !== undefined) {
        metrics.push({
          label: "Certification Recommended",
          value: data.certificationRecommended ? "Yes" : "No",
          icon: Award,
          color: "blue",
        });
      }
      if (data.recommendation) {
        metrics.push({
          label: "Recommendation",
          value:
            data.recommendation === "hire"
              ? "Hire"
              : data.recommendation === "additional"
                ? "Additional Training"
                : data.recommendation === "not_ready"
                  ? "Not Ready"
                  : data.recommendation,
          icon: Target,
          color: "orange",
        });
      }
    } else {
      const m = report.metrics || {};
      if (m.tasksCompleted !== undefined && m.tasksCompleted > 0) {
        metrics.push({
          label: "Tasks Completed",
          value: m.tasksCompleted,
          icon: CheckCircle,
          color: "emerald",
        });
      }
      if (m.hoursWorked !== undefined && m.hoursWorked > 0) {
        metrics.push({
          label: "Hours Worked",
          value: m.hoursWorked,
          icon: Clock,
          color: "blue",
        });
      }
    }
    return metrics;
  };

  const displayMetrics = getDisplayMetrics();
  const attachments = report.attachments || [];

  const isSummaryReport = isTrainerReport || isAdvisorReport || isMentorReport;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-accent/20 flex items-center justify-center">
              {getReportIcon()}
            </div>
            <div>
              <h2 className="text-xl font-heading font-medium text-text-primary">
                {report.title || "Report Details"}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
                {isSummaryReport && report.data?.overallPerformance && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-500/30">
                    {report.data.overallPerformance}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
                <Calendar className="w-4 h-4" />
                <span>Submitted Date</span>
              </div>
              <p className="font-medium text-text-primary">
                {formatDate(report.createdAt)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
                <User className="w-4 h-4" />
                <span>Submitted By</span>
              </div>
              <p className="font-medium text-text-primary">
                {report.submittedBy?.fullName ||
                  report.data?.submittedBy?.fullName ||
                  "Unknown"}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {report.type?.replace("_report", "").replace("_", " ") ||
                  "Report"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
                <Building2 className="w-4 h-4" />
                <span>For / Trainee</span>
              </div>
              <p className="font-medium text-text-primary">
                {report.participant?.fullName ||
                  report.data?.traineeName ||
                  report.team?.name ||
                  "N/A"}
              </p>
            </div>
          </div>

          {displayMetrics.length > 0 && (
            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection("metrics")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="font-heading font-medium text-text-primary">
                    {isSummaryReport
                      ? "Summary Metrics"
                      : "Performance Metrics"}
                  </span>
                  <span className="text-xs bg-blue-50 text-accent px-2 py-0.5 rounded-full">
                    {displayMetrics.length}
                  </span>
                </div>
                {expandedSections.metrics ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.metrics && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="p-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayMetrics.map((metric, idx) => {
                          const Icon = metric.icon;
                          const colorClasses = {
                            blue: "text-blue-500",
                            emerald: "text-accent",
                            red: "text-red-500",
                            purple: "text-purple-500",
                            orange: "text-orange-500",
                            pink: "text-pink-500",
                            cyan: "text-cyan-500",
                            yellow: "text-yellow-500",
                            gray: "text-text-muted",
                          };
                          return (
                            <div
                              key={idx}
                              className="bg-white rounded-lg p-3 text-center border border-gray-200"
                            >
                              <Icon
                                className={`w-5 h-5 ${colorClasses[metric.color] || "text-text-muted"} mx-auto mb-1`}
                              />
                              <p className="text-xl font-bold text-text-primary">
                                {metric.value}
                              </p>
                              <p className="text-xs text-text-muted">
                                {metric.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {isSummaryReport &&
            report.data?.skillsAcquired &&
            report.data.skillsAcquired.length > 0 && (
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleSection("skills")}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="font-heading font-medium text-text-primary">
                      Skills Acquired
                    </span>
                    <span className="text-xs bg-blue-50 text-accent px-2 py-0.5 rounded-full">
                      {report.data.skillsAcquired.length}
                    </span>
                  </div>
                  {expandedSections.skills ? (
                    <ChevronUp className="w-4 h-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.skills && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {report.data.skillsAcquired.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-gray-100 rounded-lg text-text-secondary text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          {isSummaryReport && report.data?.comments && (
            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection("summary")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-accent" />
                  <span className="font-heading font-medium text-text-primary">
                    Trainer Comments
                  </span>
                </div>
                {expandedSections.summary ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.summary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="p-4 border-t border-gray-200">
                      <p className="text-text-secondary whitespace-pre-wrap">
                        {report.data.comments}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!isSummaryReport && (
            <>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleSection("summary")}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <span className="font-heading font-medium text-text-primary">
                      Executive Summary
                    </span>
                  </div>
                  {expandedSections.summary ? (
                    <ChevronUp className="w-4 h-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="p-4 border-t border-gray-200">
                        <p className="text-text-secondary whitespace-pre-wrap">
                          {report.summary || "No summary provided"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {report.achievements && report.achievements.length > 0 && (
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <button
                    onClick={() => toggleSection("achievements")}
                    className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span className="font-heading font-medium text-text-primary">
                        Key Achievements
                      </span>
                      <span className="text-xs bg-blue-50 text-accent px-2 py-0.5 rounded-full">
                        {report.achievements.length}
                      </span>
                    </div>
                    {expandedSections.achievements ? (
                      <ChevronUp className="w-4 h-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.achievements && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="p-4 border-t border-gray-200">
                          <ul className="space-y-2">
                            {report.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                                <span className="text-text-secondary">
                                  {achievement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {report.nextSteps && report.nextSteps.length > 0 && (
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <button
                    onClick={() => toggleSection("nextSteps")}
                    className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="font-heading font-medium text-text-primary">
                        Next Steps
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                        {report.nextSteps.length}
                      </span>
                    </div>
                    {expandedSections.nextSteps ? (
                      <ChevronUp className="w-4 h-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.nextSteps && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="p-4 border-t border-gray-200">
                          <ul className="space-y-2">
                            {report.nextSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500 font-medium min-w-6">
                                  {idx + 1}.
                                </span>
                                <span className="text-text-secondary">
                                  {step}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {attachments.length > 0 && (
            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection("attachments")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-accent" />
                  <span className="font-heading font-medium text-text-primary">
                    Attachments
                  </span>
                  <span className="text-xs bg-blue-50 text-accent px-2 py-0.5 rounded-full">
                    {attachments.length}
                  </span>
                </div>
                {expandedSections.attachments ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.attachments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="p-4 space-y-2 border-t border-gray-200">
                      {attachments.map((attachment, idx) => (
                        <DocumentItem
                          key={idx}
                          label={attachment.name || "Attachment"}
                          file={{
                            url:
                              attachment.url?.url || attachment.filename?.url,
                            name: attachment.name || attachment.filename?.name,
                            size: attachment.size || attachment.filename?.size,
                            mimeType:
                              attachment.mimeType ||
                              attachment.filename?.mimeType,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {report.feedback && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <h3 className="font-heading font-medium text-text-primary mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Review Feedback
              </h3>
              <p className="text-sm text-text-secondary">{report.feedback}</p>
              {report.reviewedBy && (
                <p className="text-xs text-text-muted mt-2">
                  Reviewed by: {report.reviewedBy?.fullName || "Reviewer"} on{" "}
                  {formatDateTime(report.reviewedAt)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-b-2xl">
          {isPending && onApprove && onReject ? (
            !showRejectInput ? (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 bg-accent text-white shadow-sm hover:bg-accent/90 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  className="flex-1 border border-red-500 text-red-500 py-2.5 rounded-lg hover:bg-red-50 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
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
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || actionLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    className="flex-1 border border-gray-300 text-text-secondary py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          ) : (
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-text-secondary py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReportDetailsModal;
