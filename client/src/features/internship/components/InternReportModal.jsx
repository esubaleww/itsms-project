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
          color: "text-[#2563eb]",
          bg: "bg-[#EEF2FF]",
          border: "border-[#2563eb]/30",
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
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E7EB] shadow-2xl"
      >
        <div className="sticky top-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/95 border-b border-[#E5E7EB] p-5 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#2563eb]/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#111827]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">
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
                className="p-2 hover:bg-[#F3F4F6] rounded-lg transition"
                title="Edit Report"
              >
                <Edit className="w-5 h-5 text-[#6b7280] hover:text-[#2563eb]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition"
            >
              <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Hours Worked */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 border border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-[#6b7280] text-sm mb-2">
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
                className="w-full px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                min="0"
              />
            ) : (
              <p className="font-medium text-[#111827]">
                {report.hoursWorked || 0} hours
              </p>
            )}
          </div>

          {/* Content / Summary */}
          <div>
            <h3 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563eb]" />
              Weekly Summary
            </h3>
            {isEditing ? (
              <textarea
                value={editData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                placeholder="Write your weekly summary..."
              />
            ) : (
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-[#374151] whitespace-pre-wrap">
                  {report.content || "No content provided"}
                </p>
              </div>
            )}
          </div>

          {/* Learnings */}
          <div>
            <h3 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2563eb]" />
              Key Learnings
            </h3>
            {isEditing ? (
              <textarea
                value={editData.learnings}
                onChange={(e) => handleChange("learnings", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                placeholder="What did you learn this week?"
              />
            ) : (
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-[#374151] whitespace-pre-wrap">
                  {report.learnings || "No learnings recorded"}
                </p>
              </div>
            )}
          </div>

          {/* Challenges */}
          <div>
            <h3 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Challenges
            </h3>
            {isEditing ? (
              <textarea
                value={editData.challenges}
                onChange={(e) => handleChange("challenges", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                placeholder="What challenges did you face?"
              />
            ) : (
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-[#374151] whitespace-pre-wrap">
                  {report.challenges || "No challenges reported"}
                </p>
              </div>
            )}
          </div>

          {/* Next Plan */}
          <div>
            <h3 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Next Week Plan
            </h3>
            {isEditing ? (
              <textarea
                value={editData.nextPlan}
                onChange={(e) => handleChange("nextPlan", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                placeholder="What are your plans for next week?"
              />
            ) : (
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-[#374151] whitespace-pre-wrap">
                  {report.nextPlan || "No plans recorded"}
                </p>
              </div>
            )}
          </div>

          {/* Advisor Feedback */}
          {report.advisorFeedback && (
            <div className="bg-[#EEF2FF] rounded-xl p-4 border border-[#2563eb]/30">
              <h3 className="text-sm font-semibold text-[#2563eb] mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Advisor Feedback
              </h3>
              <p className="text-[#374151]">{report.advisorFeedback}</p>
              {report.reviewedAt && (
                <p className="text-xs text-[#6b7280] mt-2">
                  Reviewed on: {formatDateTime(report.reviewedAt)}
                </p>
              )}
            </div>
          )}

          {/* Submitted At */}
          {report.submittedAt && (
            <div className="text-xs text-[#6b7280] border-t border-[#E5E7EB] pt-3">
              Submitted: {formatDateTime(report.submittedAt)}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/95 border-t border-[#E5E7EB] p-4 rounded-b-2xl">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-[#111827] py-2.5 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
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
              className="w-full border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition"
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
