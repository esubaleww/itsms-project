import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, QrCode, Plus } from "lucide-react";
import SessionQRModal from "./SessionQRModal";

const SessionsList = ({ sessions, loading, onCreateSession }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    duration: "",
    location: "",
  });

  const handleGenerateQR = (session) => {
    setSelectedSession(session);
    setShowQRModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;
    await onCreateSession(formData);
    setFormData({ title: "", date: "", duration: "", location: "" });
    setShowCreateForm(false);
  };

  const getSessionStatus = (session) => {
    const sessionDate = new Date(session.date);
    const now = new Date();
    if (sessionDate < now) return "past";
    return "upcoming";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Training Sessions</h2>
          <p className="text-xs text-gray-400">
            Manage all training sessions and generate QR codes
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Create Session
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-700/30 rounded-xl p-4 border border-gray-700 space-y-4"
        >
          <input
            type="text"
            placeholder="Session title *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="Duration (hours)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <input
            type="text"
            placeholder="Location (optional)"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.date}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              Create Session
            </button>
          </div>
        </motion.div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No sessions created yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-3 text-emerald-400 hover:text-emerald-300 transition text-sm"
          >
            + Create your first session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((session, index) => {
            const status = getSessionStatus(session);
            return (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group"
              >
                <div className="p-5 pb-3 border-b border-gray-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white text-lg group-hover:text-emerald-400 transition truncate flex-1">
                      {session.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                        status === "upcoming"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {status === "upcoming" ? "Upcoming" : "Past"}
                    </span>
                  </div>

                  <div className="space-y-1 mt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span className="text-gray-600">•</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(session.date).toLocaleTimeString()}</span>
                    </div>
                    {session.duration > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{session.duration} hours</span>
                      </div>
                    )}
                    {session.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{session.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <button
                    onClick={() => handleGenerateQR(session)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg transition text-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    Generate QR Code
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {showQRModal && selectedSession && (
        <SessionQRModal
          session={selectedSession}
          onClose={() => {
            setShowQRModal(false);
            setSelectedSession(null);
          }}
        />
      )}
    </div>
  );
};

export default SessionsList;
