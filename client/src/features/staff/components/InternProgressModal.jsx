import { motion } from "framer-motion";
import { X, TrendingUp, FileText, Star, Calendar, Award } from "lucide-react";

const InternProgressModal = ({ intern, progress, onClose }) => {
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
            <h2 className="text-xl font-bold text-white">Intern Progress</h2>
            <p className="text-sm text-gray-400">
              {intern.intern?.fullName || intern.fullName}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.totalWeeks || 0}
              </p>
              <p className="text-xs text-gray-400">Total Reports</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.averageRating?.toFixed(1) || 0}
              </p>
              <p className="text-xs text-gray-400">Average Rating</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.completionRate || 0}%
              </p>
              <p className="text-xs text-gray-400">Completion Rate</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.reviewedWeeks || 0}
              </p>
              <p className="text-xs text-gray-400">Reviewed Reports</p>
            </div>
          </div>

          {/* Reports List */}
          {progress?.reports && progress.reports.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Reports History
              </h3>
              <div className="space-y-3">
                {progress.reports.map((report) => (
                  <div
                    key={report.week}
                    className="bg-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-white">
                        Week {report.week}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          report.status === "advisor_reviewed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {report.status === "advisor_reviewed"
                          ? "Reviewed"
                          : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {report.content}
                    </p>
                    {report.advisorFeedback && (
                      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-xs text-emerald-400 mb-1">
                          Advisor Feedback:
                        </p>
                        <p className="text-sm text-gray-300">
                          {report.advisorFeedback}
                        </p>
                        {report.advisorRating && (
                          <p className="text-xs text-yellow-400 mt-1">
                            Rating: {report.advisorRating}/5
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Section */}
          {progress?.summary && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Advisor Summary
              </h3>
              <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Overall Performance</p>
                  <p className="text-white font-medium capitalize">
                    {progress.summary.overallPerformance}
                  </p>
                </div>
                {progress.summary.strengths && (
                  <div>
                    <p className="text-xs text-gray-400">Strengths</p>
                    <p className="text-white">{progress.summary.strengths}</p>
                  </div>
                )}
                {progress.summary.weaknesses && (
                  <div>
                    <p className="text-xs text-gray-400">
                      Areas for Improvement
                    </p>
                    <p className="text-white">{progress.summary.weaknesses}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400">Recommendation</p>
                  <p className="text-white font-medium capitalize">
                    {progress.summary.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InternProgressModal;
