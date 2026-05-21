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
          color: "text-[#2563eb]",
          bg: "bg-[#EEF2FF]",
          border: "border-[#2563eb]/30",
          icon: CheckCircle,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-500",
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
      case "pending_director_review":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          icon: Clock,
          label: "Pending Review",
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E7EB] shadow-2xl"
      >
        <div className="sticky top-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/95 border-b border-[#E5E7EB] p-6 flex justify-between items-center z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#2563eb]/20 flex items-center justify-center">
              {getReportIcon()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">
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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {report.data.overallPerformance}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
                <Calendar className="w-4 h-4" />
                <span>Submitted Date</span>
              </div>
              <p className="font-medium text-[#111827]">
                {formatDate(report.createdAt)}
              </p>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
                <User className="w-4 h-4" />
                <span>Submitted By</span>
              </div>
              <p className="font-medium text-[#111827]">
                {report.submittedBy?.fullName ||
                  report.data?.submittedBy?.fullName ||
                  "Unknown"}
              </p>
              <p className="text-xs text-[#6b7280] mt-1">
                {report.type?.replace("_report", "").replace("_", " ") ||
                  "Report"}
              </p>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
                <Building2 className="w-4 h-4" />
                <span>For / Trainee</span>
              </div>
              <p className="font-medium text-[#111827]">
                {report.participant?.fullName ||
                  report.data?.traineeName ||
                  report.team?.name ||
                  "N/A"}
              </p>
            </div>
          </div>

          {displayMetrics.length > 0 && (
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] overflow-hidden">
              <button
                onClick={() => toggleSection("metrics")}
                className="w-full flex justify-between items-center p-4 hover:bg-[#F3F4F6] transition"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                  <span className="font-semibold text-[#111827]">
                    {isSummaryReport
                      ? "Summary Metrics"
                      : "Performance Metrics"}
                  </span>
                  <span className="text-xs bg-[#EEF2FF] text-[#2563eb] px-2 py-0.5 rounded-full">
                    {displayMetrics.length}
                  </span>
                </div>
                {expandedSections.metrics ? (
                  <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.metrics && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#E5E7EB]"
                  >
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayMetrics.map((metric, idx) => {
                          const Icon = metric.icon;
                          const colorClasses = {
                            blue: "text-blue-400",
                            emerald: "text-[#2563eb]",
                            red: "text-red-500",
                            purple: "text-purple-400",
                            orange: "text-orange-400",
                            pink: "text-pink-400",
                            cyan: "text-cyan-400",
                            yellow: "text-yellow-400",
                            gray: "text-[#6b7280]",
                          };
                          return (
                            <div
                              key={idx}
                              className="bg-white rounded-lg p-3 text-center"
                            >
                              <Icon
                                className={`w-5 h-5 ${colorClasses[metric.color] || "text-[#6b7280]"} mx-auto mb-1`}
                              />
                              <p className="text-xl font-bold text-[#111827]">
                                {metric.value}
                              </p>
                              <p className="text-xs text-[#6b7280]">
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
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] overflow-hidden">
                <button
                  onClick={() => toggleSection("skills")}
                  className="w-full flex justify-between items-center p-4 hover:bg-[#F3F4F6] transition"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#2563eb]" />
                    <span className="font-semibold text-[#111827]">
                      Skills Acquired
                    </span>
                    <span className="text-xs bg-[#EEF2FF] text-[#2563eb] px-2 py-0.5 rounded-full">
                      {report.data.skillsAcquired.length}
                    </span>
                  </div>
                  {expandedSections.skills ? (
                    <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.skills && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#E5E7EB]"
                    >
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {report.data.skillsAcquired.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-[#F3F4F6] rounded-lg text-[#374151] text-sm"
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
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] overflow-hidden">
              <button
                onClick={() => toggleSection("summary")}
                className="w-full flex justify-between items-center p-4 hover:bg-[#F3F4F6] transition"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#2563eb]" />
                  <span className="font-semibold text-[#111827]">
                    Trainer Comments
                  </span>
                </div>
                {expandedSections.summary ? (
                  <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.summary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#E5E7EB]"
                  >
                    <div className="p-4">
                      <p className="text-[#374151] whitespace-pre-wrap">
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
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] overflow-hidden">
                <button
                  onClick={() => toggleSection("summary")}
                  className="w-full flex justify-between items-center p-4 hover:bg-[#F3F4F6] transition"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2563eb]" />
                    <span className="font-semibold text-[#111827]">
                      Executive Summary
                    </span>
                  </div>
                  {expandedSections.summary ? (
                    <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#E5E7EB]"
                    >
                      <div className="p-4">
                        <p className="text-[#374151] whitespace-pre-wrap">
                          {report.summary || "No summary provided"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {report.achievements && report.achievements.length > 0 && (
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <button
                    onClick={() => toggleSection("achievements")}
                    className="w-full flex justify-between items-center p-4 hover:bg-[#F3F4F6] transition"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563eb]" />
                      <span className="font-semibold text-[#111827]">
                        Key Achievements
                      </span>
                      <span className="text-xs bg-[#EEF2FF] text-[#2563eb] px-2 py-0.5 rounded-full">
                        {report.achievements.length}
                      </span>
                    </div>
                    {expandedSections.achievements ? (
                      <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.achievements && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#E5E7EB]"
                      >
                        <div className="p-4">
                          <ul className="space-y-2">
                            {report.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                                <span className="text-[#374151]">
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
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <button
                    onClick={() => toggleSection("nextSteps")}
                    className="w-full flex justify-between items-center p-4 hover:bg-[#F3F4F6] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-[#111827]">
                        Next Steps
                      </span>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                        {report.nextSteps.length}
                      </span>
                    </div>
                    {expandedSections.nextSteps ? (
                      <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.nextSteps && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#E5E7EB]"
                      >
                        <div className="p-4">
                          <ul className="space-y-2">
                            {report.nextSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-400 font-medium min-w-6">
                                  {idx + 1}.
                                </span>
                                <span className="text-[#374151]">{step}</span>
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
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] overflow-hidden">
              <button
                onClick={() => toggleSection("attachments")}
                className="w-full flex justify-between items-center p-4 hover:bg-[#F3F4F6] transition"
              >
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-[#2563eb]" />
                  <span className="font-semibold text-[#111827]">Attachments</span>
                  <span className="text-xs bg-[#EEF2FF] text-[#2563eb] px-2 py-0.5 rounded-full">
                    {attachments.length}
                  </span>
                </div>
                {expandedSections.attachments ? (
                  <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.attachments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#E5E7EB]"
                  >
                    <div className="p-4 space-y-2">
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
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-4">
              <h3 className="font-semibold text-[#111827] mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Review Feedback
              </h3>
              <p className="text-sm text-[#374151]">{report.feedback}</p>
              {report.reviewedBy && (
                <p className="text-xs text-[#6b7280] mt-2">
                  Reviewed by: {report.reviewedBy?.fullName || "Reviewer"} on{" "}
                  {formatDateTime(report.reviewedAt)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/95 border-t border-[#E5E7EB] p-4 rounded-b-2xl backdrop-blur-sm">
          {isPending && onApprove && onReject ? (
            !showRejectInput ? (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] text-[#1D4ED8] border border-[#93C5FD] shadow-sm hover:from-[#BFDBFE] hover:to-[#93C5FD] py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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
                  className="flex-1 border border-red-500/50 text-red-500 py-2.5 rounded-lg hover:bg-red-50 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
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
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 font-medium shadow-md text-[#111827] py-2.5 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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
                    className="flex-1 border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          ) : (
            <button
              onClick={onClose}
              className="w-full border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition-all duration-200"
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
