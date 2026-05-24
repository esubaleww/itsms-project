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
              Trainee Progress
            </h2>
            <p className="text-sm text-text-muted">
              {progress?.trainee?.fullName || trainee?.trainee?.fullName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {totalSessions}
              </p>
              <p className="text-xs text-text-muted">Total Sessions</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {attendedSessions}
              </p>
              <p className="text-xs text-text-muted">Attended</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-500">{missedCount}</p>
              <p className="text-xs text-text-muted">Missed</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {stats.completionRate || 0}%
              </p>
              <p className="text-xs text-text-muted">Attendance Rate</p>
            </div>
          </div>

          {stats.startDate && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-text-muted">Program Start Date</p>
              <p className="text-sm text-text-primary font-medium">
                {new Date(stats.startDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {upcomingCount > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-600">
                📅 {upcomingCount} upcoming session
                {upcomingCount !== 1 ? "s" : ""} not yet started
              </p>
            </div>
          )}

          {sessions.length > 0 && (
            <div>
              <h3 className="text-lg font-heading font-medium text-text-primary mb-3">
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
                  let statusColor = "bg-red-50 text-red-600";

                  if (attended) {
                    statusLabel = "Attended";
                    statusColor = "bg-blue-50 text-accent";
                  } else if (isUpcoming) {
                    statusLabel = "Upcoming";
                    statusColor = "bg-yellow-50 text-yellow-600";
                  }

                  return (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-heading font-medium text-text-primary">
                            {session.title || "Untitled Session"}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-text-muted">
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
                              <span>⏱ Duration: {session.duration} hours</span>
                            )}
                            {session.location && (
                              <span>📍 Location: {session.location}</span>
                            )}
                          </div>
                          {attendedAt && (
                            <p className="text-xs text-accent/70 mt-2">
                              ✅ Attended on{" "}
                              {new Date(attendedAt).toLocaleString()}
                            </p>
                          )}
                          {isUpcoming && (
                            <p className="text-xs text-yellow-600/70 mt-2">
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
              <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">No sessions found</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TraineeProgressModal;
