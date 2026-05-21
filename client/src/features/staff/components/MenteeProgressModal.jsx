import { motion } from "framer-motion";
import { X, Target, CheckCircle, Clock, TrendingUp } from "lucide-react";

const MenteeProgressModal = ({ mentee, progress, type, onClose }) => {
  const stats = progress?.stats || {};
  console.log("Mentee", mentee);

  const menteeName =
    type === "innovator"
      ? mentee?.fullName || mentee?.mentee?.fullName || "Unknown"
      : mentee?.fullName || mentee?.mentee?.fullName || "Unknown";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-[#E5E7EB] shadow-2xl"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">
              {type === "innovator" ? "Innovator Progress" : "Startup Progress"}
            </h2>
            <p className="text-sm text-[#6b7280]">{menteeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#111827]">
                {stats.totalMilestones || 0}
              </p>
              <p className="text-xs text-[#6b7280]">Total Milestones</p>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#111827]">
                {stats.completed || 0}
              </p>
              <p className="text-xs text-[#6b7280]">Completed</p>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#111827]">
                {stats.inProgress || 0}
              </p>
              <p className="text-xs text-[#6b7280]">In Progress</p>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-[#2563eb] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#111827]">
                {stats.completionRate || 0}%
              </p>
              <p className="text-xs text-[#6b7280]">Completion Rate</p>
            </div>
          </div>

          {progress?.milestones && progress.milestones.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#111827] mb-3">
                Milestones
              </h3>
              <div className="space-y-3">
                {progress.milestones.map((milestone, idx) => (
                  <div key={idx} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-[#111827]">
                        {milestone.title}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          milestone.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : milestone.status === "in_progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {milestone.status || "Pending"}
                      </span>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-[#374151] mt-1">
                        {milestone.description}
                      </p>
                    )}
                    {milestone.mentorFeedback && (
                      <div className="mt-3 p-3 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-lg">
                        <p className="text-xs text-purple-400 mb-1">
                          Mentor Feedback:
                        </p>
                        <p className="text-sm text-[#374151]">
                          {milestone.mentorFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MenteeProgressModal;
