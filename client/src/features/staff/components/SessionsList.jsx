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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading font-medium text-text-primary">
            Training Sessions
          </h2>
          <p className="text-xs text-text-muted">
            Manage all training sessions and generate QR codes
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-filled px-4 py-2 text-sm"
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
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4"
        >
          <input
            type="text"
            placeholder="Session title *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
            <input
              type="number"
              placeholder="Duration (hours)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="Location (optional)"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.date}
              className="btn-filled flex-1 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Session
            </button>
          </div>
        </motion.div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-16 bg-white shadow-sm rounded-2xl border border-gray-200">
          <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary text-lg">No sessions created yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-filled mt-4 px-4 py-2 text-sm"
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
                className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="p-5 pb-3 border-b border-gray-200/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-medium text-text-primary text-lg group-hover:text-accent transition truncate flex-1">
                      {session.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                        status === "upcoming"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-text-muted"
                      }`}
                    >
                      {status === "upcoming" ? "Upcoming" : "Past"}
                    </span>
                  </div>

                  <div className="space-y-1 mt-3">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span className="text-text-muted">•</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(session.date).toLocaleTimeString()}</span>
                    </div>
                    {session.duration > 0 && (
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock className="w-3 h-3" />
                        <span>{session.duration} hours</span>
                      </div>
                    )}
                    {session.location && (
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <MapPin className="w-3 h-3" />
                        <span>{session.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <button
                    onClick={() => handleGenerateQR(session)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-lg transition text-sm font-medium"
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
