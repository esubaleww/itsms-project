import { motion } from "framer-motion";
import { X, Calendar, CheckCircle, TrendingUp, XCircle } from "lucide-react";

const TraineeProgressModal = ({ trainee, progress, onClose }) => {
  const stats = progress?.stats || {};
  const sessions = progress?.sessions || [];
  const now = new Date();

  const missedSessions = sessions.filter((item) => {
    const session = item.session;
    const sessionDate = new Date(session.date);
    const isAttended = item.attended || false;
    return !isAttended && sessionDate <= now;
  });

  const totalSessions = stats.totalSessions || 0;
  const attendedSessions = stats.attendedSessions || 0;
  const missedCount = missedSessions.length;
  const upcomingCount = totalSessions - attendedSessions - missedCount;

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
            <p className="text-sm text-gray-400">
              {progress?.trainee?.fullName || trainee?.trainee?.fullName}
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
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalSessions}</p>
              <p className="text-xs text-gray-400">Total Sessions</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {attendedSessions}
              </p>
              <p className="text-xs text-gray-400">Attended</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-400">{missedCount}</p>
              <p className="text-xs text-gray-400">Missed</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {stats.completionRate || 0}%
              </p>
              <p className="text-xs text-gray-400">Attendance Rate</p>
            </div>
          </div>

          {stats.startDate && (
            <div className="bg-gray-700/30 rounded-lg p-3">
              <p className="text-xs text-gray-400">Program Start Date</p>
              <p className="text-sm text-white font-medium">
                {new Date(stats.startDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {upcomingCount > 0 && (
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <p className="text-xs text-blue-400">
                📅 {upcomingCount} upcoming session
                {upcomingCount !== 1 ? "s" : ""} not yet started
              </p>
            </div>
          )}

          {sessions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Session History
              </h3>
              <div className="space-y-3">
                {sessions.map((item, idx) => {
                  const session = item.session || item;
                  const attended = item.attended || false;
                  const attendedAt = item.attendedAt;
                  const sessionDate = new Date(session.date);
                  const isUpcoming = sessionDate > now && !attended;

                  let statusLabel = "Missed";
                  let statusColor = "bg-red-500/20 text-red-400";

                  if (attended) {
                    statusLabel = "Attended";
                    statusColor = "bg-emerald-500/20 text-emerald-400";
                  } else if (isUpcoming) {
                    statusLabel = "Upcoming";
                    statusColor = "bg-yellow-500/20 text-yellow-400";
                  }

                  return (
                    <div key={idx} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-white">
                            {session.title || "Untitled Session"}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                            {session.date && (
                              <span>
                                📅 {new Date(session.date).toLocaleDateString()}
                              </span>
                            )}
                            {session.date && (
                              <span>
                                🕐 {new Date(session.date).toLocaleTimeString()}
                              </span>
                            )}
                            {session.duration > 0 && (
                              <span>⏱️ Duration: {session.duration} hours</span>
                            )}
                            {session.location && (
                              <span>📍 Location: {session.location}</span>
                            )}
                          </div>
                          {attendedAt && (
                            <p className="text-xs text-emerald-400/70 mt-2">
                              ✅ Attended on{" "}
                              {new Date(attendedAt).toLocaleString()}
                            </p>
                          )}
                          {isUpcoming && (
                            <p className="text-xs text-yellow-400/70 mt-2">
                              ⏰ Session starts on{" "}
                              {sessionDate.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ml-2 ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {sessions.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No sessions found</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TraineeProgressModal;
