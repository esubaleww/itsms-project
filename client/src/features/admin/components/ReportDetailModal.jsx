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
        return "bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30";
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
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E7EB] shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#0f172a]" />
            </div>
            <h2 className="text-xl font-bold text-[#0f172a]">Director Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#4b5563] hover:text-[#0f172a]" />
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
            <div className="bg-white/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#4b5563] text-xs mb-1">
                <FileText className="w-3 h-3" />
                <label>Title</label>
              </div>
              <p className="text-[#0f172a] font-medium">{report.title}</p>
            </div>
            <div className="bg-white/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#4b5563] text-xs mb-1">
                <User className="w-3 h-3" />
                <label>Submitted By</label>
              </div>
              <p className="text-[#0f172a] font-medium">
                {report.submittedBy?.fullName}
              </p>
            </div>
            <div className="bg-white/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#4b5563] text-xs mb-1">
                <Calendar className="w-3 h-3" />
                <label>Period</label>
              </div>
              <p className="text-[#0f172a] font-medium">
                {new Date(report.period?.startDate).toLocaleDateString()} -{" "}
                {new Date(report.period?.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-white/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#4b5563] text-xs mb-1">
                <Clock className="w-3 h-3" />
                <label>Submitted Date</label>
              </div>
              <p className="text-[#0f172a] font-medium">
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#2563eb]">
              <FileText className="w-4 h-4" />
              <label className="text-sm font-medium text-[#334155]">
                Summary
              </label>
            </div>
            <div className="bg-white/30 rounded-lg p-4">
              <p className="text-[#0f172a] whitespace-pre-wrap">
                {report.summary}
              </p>
            </div>
          </div>

          {/* Achievements */}
          {report.achievements?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#2563eb]">
                <TrendingUp className="w-4 h-4" />
                <label className="text-sm font-medium text-[#334155]">
                  Achievements
                </label>
              </div>
              <div className="bg-white/30 rounded-lg p-4">
                <ul className="space-y-2">
                  {report.achievements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[#0f172a]"
                    >
                      <CheckSquare className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
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
                <label className="text-sm font-medium text-[#334155]">
                  Challenges
                </label>
              </div>
              <div className="bg-white/30 rounded-lg p-4">
                <ul className="space-y-2">
                  {report.challenges.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[#0f172a]"
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
                <label className="text-sm font-medium text-[#334155]">
                  Next Steps
                </label>
              </div>
              <div className="bg-white/30 rounded-lg p-4">
                <ul className="space-y-2">
                  {report.nextSteps.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[#0f172a]"
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
                <label className="text-sm font-medium text-[#334155]">
                  Metrics
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#2563eb]">
                    {report.metrics.applicationsProcessed || 0}
                  </p>
                  <p className="text-xs text-[#4b5563] mt-1">
                    Applications Processed
                  </p>
                </div>
                <div className="bg-white/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#2563eb]">
                    {report.metrics.approvedApplications || 0}
                  </p>
                  <p className="text-xs text-[#4b5563] mt-1">Approved</p>
                </div>
                <div className="bg-white/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">
                    {report.metrics.rejectedApplications || 0}
                  </p>
                  <p className="text-xs text-[#4b5563] mt-1">Rejected</p>
                </div>
                <div className="bg-white/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {report.metrics.completedRequests || 0}
                  </p>
                  <p className="text-xs text-[#4b5563] mt-1">Completed</p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {report.feedback && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#4b5563]">
                <FileText className="w-4 h-4" />
                <label className="text-sm font-medium text-[#334155]">
                  Feedback
                </label>
              </div>
              <div className="bg-white/30 rounded-lg p-4">
                <p className="text-[#0f172a]">{report.feedback}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {report.status === "submitted" && (
          <div className="p-5 border-t border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-b-2xl">
            <div className="space-y-3">
              <textarea
                placeholder="Add comments (optional)..."
                className="w-full px-3 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none"
                rows="3"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 bg-[#2563eb] text-[#0f172a] py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
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
                  className="flex-1 bg-linear-to-r from-red-500 to-red-700 text-[#0f172a] py-2.5 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
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
          <div className="p-5 border-t border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full border border-[#E5E7EB] text-[#334155] py-2.5 rounded-lg hover:bg-white transition-all duration-200"
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
