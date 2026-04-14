import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { useToast } from "../../../components/ui/Toast";

const ReportDetailModal = ({ report, onClose, onApprove, onReject }) => {
  const { addToast } = useToast();
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "reviewed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      case "reviewed":
        return FileText;
      default:
        return Clock;
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(report._id, comments);
      addToast("Report approved successfully!", "success");
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to approve report", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(report._id, comments);
      addToast("Report rejected successfully!", "success");
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to reject report", "error");
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = getStatusIcon(report.status);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Director Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-start">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}
            >
              <StatusIcon className="w-4 h-4" />
              <span className="capitalize">{report.status}</span>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <FileText className="w-3 h-3" />
                <label>Title</label>
              </div>
              <p className="text-white font-medium">{report.title}</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <User className="w-3 h-3" />
                <label>Submitted By</label>
              </div>
              <p className="text-white font-medium">
                {report.submittedBy?.fullName}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                <label>Period</label>
              </div>
              <p className="text-white font-medium">
                {new Date(report.period?.startDate).toLocaleDateString()} -{" "}
                {new Date(report.period?.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Clock className="w-3 h-3" />
                <label>Submitted Date</label>
              </div>
              <p className="text-white font-medium">
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <FileText className="w-4 h-4" />
              <label className="text-sm font-medium text-gray-300">
                Summary
              </label>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-200 whitespace-pre-wrap">
                {report.summary}
              </p>
            </div>
          </div>

          {/* Achievements */}
          {report.achievements?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <label className="text-sm font-medium text-gray-300">
                  Achievements
                </label>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <ul className="space-y-2">
                  {report.achievements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-200"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Challenges */}
          {report.challenges?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <label className="text-sm font-medium text-gray-300">
                  Challenges
                </label>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <ul className="space-y-2">
                  {report.challenges.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-200"
                    >
                      <TrendingDown className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Next Steps */}
          {report.nextSteps?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <ArrowRight className="w-4 h-4" />
                <label className="text-sm font-medium text-gray-300">
                  Next Steps
                </label>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <ul className="space-y-2">
                  {report.nextSteps.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-200"
                    >
                      <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Metrics */}
          {report.metrics && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <BarChart3 className="w-4 h-4" />
                <label className="text-sm font-medium text-gray-300">
                  Metrics
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    {report.metrics.applicationsProcessed || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applications Processed
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    {report.metrics.approvedApplications || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Approved</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">
                    {report.metrics.rejectedApplications || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Rejected</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {report.metrics.completedRequests || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Completed</p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {report.feedback && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <FileText className="w-4 h-4" />
                <label className="text-sm font-medium text-gray-300">
                  Feedback
                </label>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-200">{report.feedback}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {report.status === "submitted" && (
          <div className="p-5 border-t border-gray-700 bg-gray-800/90 rounded-b-2xl">
            <div className="space-y-3">
              <textarea
                placeholder="Add comments (optional)..."
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                rows="3"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
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
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-red-500 to-red-700 text-white py-2.5 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Reject Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {report.status !== "submitted" && (
          <div className="p-5 border-t border-gray-700 bg-gray-800/90 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReportDetailModal;
