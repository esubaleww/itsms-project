import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  CheckCircle,
  XCircle,
  Camera,
} from "lucide-react";
import QRScannerModal from "./QRScannerModal";

const MySessions = ({ sessions, loading, trainer, onAttendanceMarked }) => {
  const [showScanner, setShowScanner] = useState(false);

  if (loading) {
    return (
      <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto" />
        <p className="text-gray-400 mt-4">Loading your sessions...</p>
      </div>
    );
  }

  const pastSessions = sessions?.past || [];
  const upcomingSessions = sessions?.upcoming || [];
  const totalSessions = sessions?.total || 0;
  const attendedCount = sessions?.attended || 0;
  const upcomingCount = upcomingSessions.length;
  const missedCount = totalSessions - attendedCount - upcomingCount;

  const getSessionStatus = (session) => {
    if (session.attended) {
      return {
        label: "Attended",
        color: "bg-emerald-500/20 text-emerald-400",
        icon: CheckCircle,
      };
    }

    const sessionDate = new Date(session.date);
    const durationInMs = (session.duration || 0) * 60 * 60 * 1000;
    const sessionEndTime = new Date(sessionDate.getTime() + durationInMs);
    const now = new Date();

    if (now > sessionEndTime) {
      return {
        label: "Missed",
        color: "bg-red-500/20 text-red-400",
        icon: XCircle,
      };
    }

    if (now < sessionDate) {
      return {
        label: "Upcoming",
        color: "bg-yellow-500/20 text-yellow-400",
        icon: Calendar,
      };
    }

    return {
      label: "Active",
      color: "bg-green-500/20 text-green-400",
      icon: Calendar,
    };
  };

  return (
    <>
      <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6 pb-20 md:pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              My Training Sessions
            </h2>
            <p className="text-sm text-gray-400">
              View all your training sessions and track attendance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-2xl font-bold text-white">{totalSessions}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Upcoming</p>
            <p className="text-2xl font-bold text-blue-400">{upcomingCount}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Attended</p>
            <p className="text-2xl font-bold text-emerald-400">
              {attendedCount}
            </p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Missed</p>
            <p className="text-2xl font-bold text-red-400">{missedCount}</p>
          </div>
        </div>

        {trainer?.fullName && (
          <div className="mb-6 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-xs text-purple-400">Your Trainer</p>
            <p className="text-sm text-white font-medium">{trainer.fullName}</p>
            {trainer.email && (
              <p className="text-xs text-gray-400 mt-1">{trainer.email}</p>
            )}
          </div>
        )}

        {totalSessions === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No sessions scheduled yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Training sessions will appear here once assigned by your trainer
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming Sessions ({upcomingSessions.length})
                </h3>
                {upcomingSessions.map((session, idx) => {
                  const status = getSessionStatus(session);
                  const StatusIcon = status.icon;
                  return (
                    <motion.div
                      key={session._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gray-700/30 rounded-lg p-5 hover:bg-gray-700/50 transition mb-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <p className="font-semibold text-white">
                              {session.title}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${status.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-400">
                              📅{" "}
                              {session.date
                                ? new Date(session.date).toLocaleDateString()
                                : "Date TBD"}
                              {session.date && (
                                <>
                                  {" "}
                                  at{" "}
                                  {new Date(session.date).toLocaleTimeString()}
                                </>
                              )}
                            </p>
                            {session.duration > 0 && (
                              <p className="text-gray-400">
                                ⏱️ Duration: {session.duration} hours
                              </p>
                            )}
                            {session.location && (
                              <p className="text-gray-400">
                                📍 Location: {session.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Past Sessions ({pastSessions.length})
                </h3>
                {pastSessions.map((session, idx) => {
                  const status = getSessionStatus(session);
                  const StatusIcon = status.icon;
                  return (
                    <motion.div
                      key={session._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gray-700/30 rounded-lg p-5 hover:bg-gray-700/50 transition mb-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="font-semibold text-white">
                              {session.title}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${status.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-400">
                              📅{" "}
                              {session.date
                                ? new Date(session.date).toLocaleDateString()
                                : "Date TBD"}
                              {session.date && (
                                <>
                                  {" "}
                                  at{" "}
                                  {new Date(session.date).toLocaleTimeString()}
                                </>
                              )}
                            </p>
                            {session.duration > 0 && (
                              <p className="text-gray-400">
                                ⏱️ Duration: {session.duration} hours
                              </p>
                            )}
                            {session.location && (
                              <p className="text-gray-400">
                                📍 Location: {session.location}
                              </p>
                            )}
                          </div>
                          {session.attendedAt && (
                            <p className="text-xs text-emerald-400/70 mt-2">
                              ✅ Attended on{" "}
                              {new Date(session.attendedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button - Always visible */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={() => setShowScanner(true)}
          className="group relative w-14 h-14 bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Camera className="w-6 h-6 text-white" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Scan QR Code
          </span>
        </button>
      </div>

      {/* Desktop Button - Always visible */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowScanner(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm flex items-center gap-2 shadow-lg transition-all duration-200"
        >
          <Camera className="w-4 h-4" />
          Scan QR Code
        </button>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
          onSuccess={() => {
            if (onAttendanceMarked) {
              onAttendanceMarked();
            }
          }}
        />
      )}
    </>
  );
};

export default MySessions;
