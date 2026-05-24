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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-heading font-medium text-text-primary">
              {type === "innovator" ? "Innovator Progress" : "Startup Progress"}
            </h2>
            <p className="text-sm text-text-muted">{menteeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {stats.totalMilestones || 0}
              </p>
              <p className="text-xs text-text-muted">Total Milestones</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {stats.completed || 0}
              </p>
              <p className="text-xs text-text-muted">Completed</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {stats.inProgress || 0}
              </p>
              <p className="text-xs text-text-muted">In Progress</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {stats.completionRate || 0}%
              </p>
              <p className="text-xs text-text-muted">Completion Rate</p>
            </div>
          </div>

          {progress?.milestones && progress.milestones.length > 0 && (
            <div>
              <h3 className="text-lg font-heading font-medium text-text-primary mb-3">
                Milestones
              </h3>
              <div className="space-y-3">
                {progress.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-text-primary">
                        {milestone.title}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          milestone.status === "completed"
                            ? "bg-green-50 text-green-600"
                            : milestone.status === "in_progress"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {milestone.status || "Pending"}
                      </span>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-text-secondary mt-1">
                        {milestone.description}
                      </p>
                    )}
                    {milestone.mentorFeedback && (
                      <div className="mt-3 p-3 bg-white shadow-sm rounded-lg border border-gray-200">
                        <p className="text-xs text-purple-600 mb-1">
                          Mentor Feedback:
                        </p>
                        <p className="text-sm text-text-secondary">
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
