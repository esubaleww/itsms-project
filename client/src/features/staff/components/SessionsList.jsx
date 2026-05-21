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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Training Sessions</h2>
          <p className="text-xs text-[#6b7280]">
            Manage all training sessions and generate QR codes
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-institutional px-4 py-2 text-sm"
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
          className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 border border-[#E5E7EB] space-y-4"
        >
          <input
            type="text"
            placeholder="Session title *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition"
            />
            <input
              type="number"
              placeholder="Duration (hours)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition"
            />
          </div>
          <input
            type="text"
            placeholder="Location (optional)"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#F3F4F6] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.date}
              className="btn-institutional flex-1 px-4 py-2 disabled:opacity-50"
            >
              Create Session
            </button>
          </div>
        </motion.div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-16 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl border border-[#E5E7EB]">
          <Calendar className="w-16 h-16 text-[#9ca3af] mx-auto mb-4" />
          <p className="text-[#6b7280] text-lg">No sessions created yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-institutional mt-4 px-4 py-2 text-sm"
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
                className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-[#2563eb]/50 transition-all duration-300 group"
              >
                <div className="p-5 pb-3 border-b border-[#E5E7EB]/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#111827] text-lg group-hover:text-[#2563eb] transition truncate flex-1">
                      {session.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                        status === "upcoming"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-[#6b7280]"
                      }`}
                    >
                      {status === "upcoming" ? "Upcoming" : "Past"}
                    </span>
                  </div>

                  <div className="space-y-1 mt-3">
                    <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span className="text-[#9ca3af]">•</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(session.date).toLocaleTimeString()}</span>
                    </div>
                    {session.duration > 0 && (
                      <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                        <Clock className="w-3 h-3" />
                        <span>{session.duration} hours</span>
                      </div>
                    )}
                    {session.location && (
                      <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                        <MapPin className="w-3 h-3" />
                        <span>{session.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <button
                    onClick={() => handleGenerateQR(session)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg transition text-sm font-medium"
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

