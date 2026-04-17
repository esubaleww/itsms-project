import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Users,
  Plus,
  QrCode,
} from "lucide-react";
import { useToast } from "../../../components/ui/Toast";

const SessionManagementModal = ({
  trainee,
  onClose,
  onCreateSession,
  onRecordAttendance,
  onGenerateCertificate,
}) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newSession, setNewSession] = useState({
    title: "",
    date: "",
    duration: "",
    location: "",
  });

  const sessions = trainee?.sessions || [];
  const upcomingSessions = sessions.filter(
    (s) => !s.attended && new Date(s.date) > new Date(),
  );
  const pastSessions = sessions.filter(
    (s) => s.attended || new Date(s.date) <= new Date(),
  );

  const handleCreateSession = async () => {
    if (!newSession.title || !newSession.date) {
      addToast("Please fill in required fields", "error");
      return;
    }

    setLoading(true);
    try {
      await onCreateSession(newSession);
      addToast("Session created!", "success");
      setShowCreateForm(false);
      setNewSession({ title: "", date: "", duration: "", location: "" });
    } catch (error) {
      addToast(error.message || "Failed to create session", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAttendance = async (sessionId) => {
    setLoading(true);
    try {
      await onRecordAttendance(sessionId, trainee.user?._id);
      addToast("Attendance recorded!", "success");
      setSelectedSession(null);
    } catch (error) {
      addToast(error.message || "Failed to record attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (sessionId) => {
    setLoading(true);
    try {
      await onGenerateCertificate(trainee.user?._id, sessionId);
      addToast("Certificate generated!", "success");
    } catch (error) {
      addToast(error.message || "Failed to generate certificate", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl"
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div>
            <h2 className="text-xl font-bold text-white">
              Manage Training Sessions
            </h2>
            <p className="text-sm text-gray-400">{trainee?.user?.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Upcoming Sessions */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Upcoming Sessions ({upcomingSessions.length})
              </h3>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Create Session
              </button>
            </div>

            {showCreateForm && (
              <div className="mb-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600 space-y-3">
                <input
                  type="text"
                  placeholder="Session title *"
                  value={newSession.title}
                  onChange={(e) =>
                    setNewSession({ ...newSession, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="datetime-local"
                  value={newSession.date}
                  onChange={(e) =>
                    setNewSession({ ...newSession, date: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 2 hours)"
                  value={newSession.duration}
                  onChange={(e) =>
                    setNewSession({ ...newSession, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newSession.location}
                  onChange={(e) =>
                    setNewSession({ ...newSession, location: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                />
                <button
                  onClick={handleCreateSession}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition"
                >
                  Create Session
                </button>
              </div>
            )}

            <div className="space-y-2">
              {upcomingSessions.map((session) => (
                <div
                  key={session._id}
                  className="p-4 rounded-lg border border-gray-700 bg-gray-700/30"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{session.title}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(session.date).toLocaleTimeString()}
                        </span>
                        {session.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.duration}
                          </span>
                        )}
                        {session.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRecordAttendance(session._id)}
                      disabled={loading}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition text-sm"
                    >
                      Record Attendance
                    </button>
                  </div>
                </div>
              ))}
              {upcomingSessions.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  No upcoming sessions
                </p>
              )}
            </div>
          </div>

          {/* Past Sessions */}
          {pastSessions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Past Sessions
              </h3>
              <div className="space-y-2">
                {pastSessions.map((session) => (
                  <div
                    key={session._id}
                    className="p-4 rounded-lg border border-gray-700 bg-gray-700/30"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          {session.title}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle
                              className={`w-3 h-3 ${session.attended ? "text-green-400" : "text-red-400"}`}
                            />
                            {session.attended ? "Attended" : "Missed"}
                          </span>
                        </div>
                      </div>
                      {session.attended && !session.certificate && (
                        <button
                          onClick={() => handleGenerateCertificate(session._id)}
                          disabled={loading}
                          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg transition text-sm flex items-center gap-1"
                        >
                          <QrCode className="w-3 h-3" /> Generate Certificate
                        </button>
                      )}
                      {session.certificate && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                          Certificate Ready
                        </span>
                      )}
                    </div>
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

export default SessionManagementModal;
