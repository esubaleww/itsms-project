import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ChevronRight,
  User,
  Award,
} from "lucide-react";

const DirectorMyReportsList = ({ reports = [], onViewDetails }) => {
  const [expandedId, setExpandedId] = useState(null);

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
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: XCircle,
          label: "Rejected",
        };
      case "reviewed":
        return {
          color: "text-accent",
          bg: "bg-blue-50",
          border: "border-accent/30",
          icon: Eye,
          label: "Under Review",
        };
      default:
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  const getPerformanceTrend = (report) => {
    if (!report.metrics) return null;
    const current = report.metrics.approvedApplications || 0;
    const previous = report.metrics.previousApproved || 0;
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
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

  if (reports === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-sm rounded-full mb-4 border border-gray-200">
          <FileText className="w-10 h-10 text-text-muted" />
        </div>
        <p className="text-text-secondary text-lg">No reports submitted</p>
        <p className="text-sm text-text-muted mt-1 max-w-md mx-auto">
          Your submitted director reports will appear here. Reports help track
          progress and performance metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report, index) => {
        const statusConfig = getStatusConfig(report.status);
        const StatusIcon = statusConfig.icon;
        const isExpanded = expandedId === report._id;
        const performanceTrend = getPerformanceTrend(report);
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
            className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar className="w-3 h-3" />
                      {formatDateTime(report.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-text-primary font-heading font-medium text-lg mb-2">
                    {report.title}
                  </h3>

                  {report.period && (
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(report.period?.startDate)} -{" "}
                        {formatDate(report.period?.endDate)}
                      </span>
                    </div>
                  )}

                  {report.summary && (
                    <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                      {report.summary}
                    </p>
                  )}

                  {hasMetrics && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {report.metrics.applicationsProcessed !== undefined && (
                        <div className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                          <FileText className="w-3 h-3 text-blue-500" />
                          <span className="text-text-secondary">
                            {report.metrics.applicationsProcessed} processed
                          </span>
                        </div>
                      )}
                      {report.metrics.approvedApplications !== undefined && (
                        <div className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                          <CheckCircle className="w-3 h-3 text-accent" />
                          <span className="text-text-secondary">
                            {report.metrics.approvedApplications} approved
                          </span>
                        </div>
                      )}
                      {report.metrics.completedRequests !== undefined && (
                        <div className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                          <Award className="w-3 h-3 text-purple-500" />
                          <span className="text-text-secondary">
                            {report.metrics.completedRequests} completed
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {hasFeedback && !isExpanded && (
                    <div className="mt-3 flex items-start gap-2 text-xs bg-blue-50 border border-accent/20 rounded-lg p-2">
                      <MessageSquare className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                      <span className="text-text-muted line-clamp-1">
                        Feedback: {report.feedback}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {onViewDetails && (
                    <button
                      onClick={() => onViewDetails?.(report._id)}
                      className="text-text-muted hover:text-text-primary p-2 rounded-lg hover:bg-gray-100 transition"
                      title="View Full Report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : report._id)
                    }
                    className={`p-2 rounded-lg transition ${
                      isExpanded
                        ? "text-accent bg-blue-50"
                        : "text-text-muted hover:text-text-primary hover:bg-gray-100"
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

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-200 overflow-hidden"
                >
                  <div className="p-5 bg-gray-50 space-y-5">
                    {report.summary && (
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Full Summary
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-text-secondary whitespace-pre-wrap">
                            {report.summary}
                          </p>
                        </div>
                      </div>
                    )}

                    {report.achievements?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-accent" />
                          Key Achievements
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <ul className="space-y-2">
                            {report.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                                <span className="text-text-secondary text-sm">
                                  {achievement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {report.challenges?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                          <TrendingDown className="w-3 h-3 text-red-500" />
                          Challenges Faced
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <ul className="space-y-2">
                            {report.challenges.map((challenge, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                <span className="text-text-secondary text-sm">
                                  {challenge}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {report.nextSteps?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-blue-500" />
                          Next Steps
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <ul className="space-y-2">
                            {report.nextSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-50 text-accent flex items-center justify-center text-xs mt-0.5">
                                  {idx + 1}
                                </div>
                                <span className="text-text-secondary text-sm">
                                  {step}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {hasMetrics && (
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Award className="w-3 h-3" />
                          Detailed Metrics
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {report.metrics.applicationsProcessed !==
                            undefined && (
                            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-blue-500">
                                {report.metrics.applicationsProcessed}
                              </p>
                              <p className="text-xs text-text-muted">
                                Applications Processed
                              </p>
                            </div>
                          )}
                          {report.metrics.approvedApplications !==
                            undefined && (
                            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-accent">
                                {report.metrics.approvedApplications}
                              </p>
                              <p className="text-xs text-text-muted">
                                Approved
                              </p>
                            </div>
                          )}
                          {report.metrics.rejectedApplications !==
                            undefined && (
                            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-red-500">
                                {report.metrics.rejectedApplications}
                              </p>
                              <p className="text-xs text-text-muted">
                                Rejected
                              </p>
                            </div>
                          )}
                          {report.metrics.completedRequests !== undefined && (
                            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-purple-500">
                                {report.metrics.completedRequests}
                              </p>
                              <p className="text-xs text-text-muted">
                                Completed
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {performanceTrend !== null && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">
                            Approval Rate Change
                          </span>
                          <div
                            className={`flex items-center gap-1 ${
                              performanceTrend >= 0
                                ? "text-accent"
                                : "text-red-500"
                            }`}
                          >
                            {performanceTrend >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span className="font-medium">
                              {performanceTrend >= 0 ? "+" : ""}
                              {performanceTrend.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              performanceTrend >= 0 ? "bg-accent" : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                Math.abs(performanceTrend),
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {hasFeedback && (
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                          <MessageSquare className="w-3 h-3 text-blue-500" />
                          Feedback & Comments
                        </h4>
                        <div className="bg-blue-50 border border-accent/20 rounded-lg p-4">
                          <p className="text-text-secondary whitespace-pre-wrap">
                            {report.feedback}
                          </p>
                          {report.reviewedBy && (
                            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Reviewed by:{" "}
                              {report.reviewedBy?.fullName || "Admin"}
                            </p>
                          )}
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
  );
};

export default DirectorMyReportsList;
