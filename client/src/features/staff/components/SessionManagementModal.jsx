import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Calendar,
  Clock,
  MapPin,
  FileText,
  QrCode,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTrainer } from "../../../hooks/useTrainer";
import SessionQRModal from "./SessionQRModal";

const SessionManagementModal = ({ trainee, onClose, onRefresh }) => {
  console.log("SessionManagementModal trainee", trainee);
  const { createSession, loading } = useTrainer();
  const [showForm, setShowForm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    duration: "",
    location: "",
  });

  const sessions = trainee?.sessions || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    try {
      await createSession(trainee.trainee?._id, {
        title: formData.title,
        date: formData.date,
        duration: Number(formData.duration) || 0,
        location: formData.location,
      });
      setShowForm(false);
      setFormData({ title: "", date: "", duration: "", location: "" });
      if (onRefresh) await onRefresh();
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const getSessionStatus = (session) => {
    const sessionDate = new Date(session.date);
    const now = new Date();

    if (session.attended) {
      return {
        label: "Attended",
        color: "bg-[#EEF2FF] text-[#2563eb]",
        icon: CheckCircle,
      };
    }
    if (sessionDate < now) {
      return {
        label: "Missed",
        color: "bg-red-500/20 text-red-500",
        icon: XCircle,
      };
    }
    return {
      label: "Upcoming",
      color: "bg-[#EEF2FF] text-[#2563eb]",
      icon: Calendar,
    };
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-[#E5E7EB] shadow-2xl"
      >
        <div className="flex justify-between items-center p-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">Manage Sessions</h2>
            <p className="text-sm text-[#6b7280]">
              {trainee?.trainee?.fullName || trainee?.fullName || "Trainee"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-institutional w-full py-3"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Add New Session"}
          </button>

          <AnimatePresence>
            {showForm && (
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
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                    <input
                      type="number"
                      placeholder="Duration (hours)"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.title || !formData.date || loading}
                  className="btn-institutional w-full py-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Session
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#111827]">All Sessions</h3>
            {sessions.length === 0 ? (
              <div className="text-center py-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
                <Calendar className="w-10 h-10 text-[#9ca3af] mx-auto mb-2" />
                <p className="text-[#6b7280] text-sm">No sessions created yet</p>
              </div>
            ) : (
              sessions.map((session, idx) => {
                const status = getSessionStatus(session);
                const StatusIcon = status.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 border border-[#E5E7EB]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-[#111827]">
                            {session.title}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-[#6b7280]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                          </div>
                          {session.duration > 0 && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>{session.duration} hours</span>
                            </div>
                          )}
                          {session.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{session.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!session.attended && (
                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setShowQRModal(true);
                            }}
                            className="p-1.5 text-[#2563eb] hover:text-[#1d4ed8]"
                            title="Generate QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                        {session.attended && session.certificate && (
                          <button
                            className="p-1.5 text-blue-400 hover:text-blue-300"
                            title="View Certificate"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {session.attendedAt && (
                      <p className="text-xs text-[#2563eb]/70 mt-2">
                        Attended on{" "}
                        {new Date(session.attendedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="p-5 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="w-full border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition"
          >
            Close
          </button>
        </div>
      </motion.div>

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

export default SessionManagementModal;
