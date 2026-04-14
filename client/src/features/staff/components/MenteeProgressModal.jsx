// client/src/features/staff/components/MenteeProgressModal.jsx
import { motion } from "framer-motion";
import { X, Target, CheckCircle, Clock, TrendingUp } from "lucide-react";

const MenteeProgressModal = ({ mentee, progress, type, onClose }) => {
  const stats = progress?.stats || {};

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl"
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div>
            <h2 className="text-xl font-bold text-white">
              {type === "innovator" ? "Innovator Progress" : "Startup Progress"}
            </h2>
            <p className="text-sm text-gray-400">
              {type === "innovator" ? mentee?.fullName : mentee?.companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.totalMilestones || 0}
              </p>
              <p className="text-xs text-gray-400">Total Milestones</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.completed || 0}
              </p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.inProgress || 0}
              </p>
              <p className="text-xs text-gray-400">In Progress</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.completionRate || 0}%
              </p>
              <p className="text-xs text-gray-400">Completion Rate</p>
            </div>
          </div>

          {progress?.milestones && progress.milestones.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Milestones
              </h3>
              <div className="space-y-3">
                {progress.milestones.map((milestone, idx) => (
                  <div key={idx} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-white">
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
                      <p className="text-sm text-gray-300 mt-1">
                        {milestone.description}
                      </p>
                    )}
                    {milestone.mentorFeedback && (
                      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-xs text-purple-400 mb-1">
                          Mentor Feedback:
                        </p>
                        <p className="text-sm text-gray-300">
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
