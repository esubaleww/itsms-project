// client/src/features/staff/components/TraineeProgressModal.jsx
import { motion } from "framer-motion";
import { X, Calendar, CheckCircle, TrendingUp, Award } from "lucide-react";

const TraineeProgressModal = ({ trainee, progress, onClose }) => {
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
            <h2 className="text-xl font-bold text-white">Trainee Progress</h2>
            <p className="text-sm text-gray-400">{trainee?.fullName}</p>
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
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.totalSessions || 0}
              </p>
              <p className="text-xs text-gray-400">Total Sessions</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.attendedSessions || 0}
              </p>
              <p className="text-xs text-gray-400">Attended</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.completionRate || 0}%
              </p>
              <p className="text-xs text-gray-400">Attendance Rate</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.certificatesEarned || 0}
              </p>
              <p className="text-xs text-gray-400">Certificates</p>
            </div>
          </div>

          {progress?.sessions && progress.sessions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Session History
              </h3>
              <div className="space-y-3">
                {progress.sessions.map((session, idx) => (
                  <div key={idx} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          {session.title}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                          <span>
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          {session.duration && (
                            <span>Duration: {session.duration}</span>
                          )}
                          {session.location && (
                            <span>Location: {session.location}</span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          session.attended
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {session.attended ? "Attended" : "Missed"}
                      </span>
                    </div>
                    {session.certificate && (
                      <div className="mt-2">
                        <a
                          href={session.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <Award className="w-3 h-3" /> View Certificate
                        </a>
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

export default TraineeProgressModal;
