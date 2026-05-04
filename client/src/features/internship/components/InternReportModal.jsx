import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  User,
  FileText,
  Clock,
  MessageSquare,
  XCircle,
  Edit,
  Save,
} from "lucide-react";

const InternReportModal = ({
  report,
  advisor,
  onClose,
  onUpdate,
  onRefresh,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    content: report.content || "",
    learnings: report.learnings || "",
    challenges: report.challenges || "",
    nextPlan: report.nextPlan || "",
    hoursWorked: report.hoursWorked || 0,
  });
  const [loading, setLoading] = useState(false);

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Invalid date";
      return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "advisor_reviewed":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
          border: "border-emerald-500/30",
          icon: CheckCircle,
          label: "Reviewed",
        };
      default:
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          icon: Clock,
          label: "Pending Review",
        };
    }
  };

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;
  const canEdit = report.status === "submitted";

  const handleEdit = () => {
    setEditData({
      content: report.content || "",
      learnings: report.learnings || "",
      challenges: report.challenges || "",
      nextPlan: report.nextPlan || "",
      hoursWorked: report.hoursWorked || 0,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(report.week, editData);
      await onRefresh(); // Refresh the reports list
      // Update the local report data
      Object.assign(report, {
        content: editData.content,
        learnings: editData.learnings,
        challenges: editData.challenges,
        nextPlan: editData.nextPlan,
        hoursWorked: editData.hoursWorked,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-700 shadow-2xl"
      >
        <div className="sticky top-0 bg-gray-800/95 border-b border-gray-700 p-5 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Week {report.week} Report
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && !isEditing && (
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
                title="Edit Report"
              >
                <Edit className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Hours Worked */}
          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Clock className="w-4 h-4" />
              <span>Hours Worked</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={editData.hoursWorked}
                onChange={(e) =>
                  handleChange("hoursWorked", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                min="0"
              />
            ) : (
              <p className="font-medium text-white">
                {report.hoursWorked || 0} hours
              </p>
            )}
          </div>

          {/* Content / Summary */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Weekly Summary
            </h3>
            {isEditing ? (
              <textarea
                value={editData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="Write your weekly summary..."
              />
            ) : (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {report.content || "No content provided"}
                </p>
              </div>
            )}
          </div>

          {/* Learnings */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Key Learnings
            </h3>
            {isEditing ? (
              <textarea
                value={editData.learnings}
                onChange={(e) => handleChange("learnings", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="What did you learn this week?"
              />
            ) : (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {report.learnings || "No learnings recorded"}
                </p>
              </div>
            )}
          </div>

          {/* Challenges */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              Challenges
            </h3>
            {isEditing ? (
              <textarea
                value={editData.challenges}
                onChange={(e) => handleChange("challenges", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="What challenges did you face?"
              />
            ) : (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {report.challenges || "No challenges reported"}
                </p>
              </div>
            )}
          </div>

          {/* Next Plan */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Next Week Plan
            </h3>
            {isEditing ? (
              <textarea
                value={editData.nextPlan}
                onChange={(e) => handleChange("nextPlan", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="What are your plans for next week?"
              />
            ) : (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {report.nextPlan || "No plans recorded"}
                </p>
              </div>
            )}
          </div>

          {/* Advisor Feedback */}
          {report.advisorFeedback && (
            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
              <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Advisor Feedback
              </h3>
              <p className="text-gray-300">{report.advisorFeedback}</p>
              {report.reviewedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Reviewed on: {formatDateTime(report.reviewedAt)}
                </p>
              )}
            </div>
          )}

          {/* Submitted At */}
          {report.submittedAt && (
            <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
              Submitted: {formatDateTime(report.submittedAt)}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-800/95 border-t border-gray-700 p-4 rounded-b-2xl">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InternReportModal;
