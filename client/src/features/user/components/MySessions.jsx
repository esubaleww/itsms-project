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
      <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto" />
        <p className="text-text-muted mt-4">Loading your sessions...</p>
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
        color: "bg-blue-50 text-accent",
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
        color: "bg-red-50 text-red-600",
        icon: XCircle,
      };
    }

    if (now < sessionDate) {
      return {
        label: "Upcoming",
        color: "bg-yellow-50 text-yellow-600",
        icon: Calendar,
      };
    }

    return {
      label: "Active",
      color: "bg-green-50 text-green-600",
      icon: Calendar,
    };
  };

  return (
    <>
      <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6 pb-20 md:pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-medium text-text-primary">
              My Training Sessions
            </h2>
            <p className="text-sm text-text-muted">
              View all your training sessions and track attendance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Total</p>
            <p className="text-2xl font-bold text-text-primary">
              {totalSessions}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Upcoming</p>
            <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Attended</p>
            <p className="text-2xl font-bold text-accent">{attendedCount}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Missed</p>
            <p className="text-2xl font-bold text-red-600">{missedCount}</p>
          </div>
        </div>

        {trainer?.fullName && (
          <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600">Your Trainer</p>
            <p className="text-sm text-text-primary font-medium">
              {trainer.fullName}
            </p>
            {trainer.email && (
              <p className="text-xs text-text-muted mt-1">{trainer.email}</p>
            )}
          </div>
        )}

        {totalSessions === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary text-lg">
              No sessions scheduled yet
            </p>
            <p className="text-xs text-text-muted mt-1">
              Training sessions will appear here once assigned by your trainer
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.length > 0 && (
              <div>
                <h3 className="text-md font-heading font-medium text-blue-600 mb-3 flex items-center gap-2">
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
                      className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:bg-gray-100 transition mb-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Calendar className="w-4 h-4 text-accent" />
                            <p className="font-heading font-medium text-text-primary">
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
                            <p className="text-text-muted">
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
                              <p className="text-text-muted">
                                ⏱ Duration: {session.duration} hours
                              </p>
                            )}
                            {session.location && (
                              <p className="text-text-muted">
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

            {pastSessions.length > 0 && (
              <div>
                <h3 className="text-md font-heading font-medium text-text-muted mb-3 flex items-center gap-2">
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
                      className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:bg-gray-100 transition mb-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Calendar className="w-4 h-4 text-text-muted" />
                            <p className="font-heading font-medium text-text-primary">
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
                            <p className="text-text-muted">
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
                              <p className="text-text-muted">
                                ⏱ Duration: {session.duration} hours
                              </p>
                            )}
                            {session.location && (
                              <p className="text-text-muted">
                                📍 Location: {session.location}
                              </p>
                            )}
                          </div>
                          {session.attendedAt && (
                            <p className="text-xs text-accent/70 mt-2">
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

      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={() => setShowScanner(true)}
          className="btn-filled group relative w-14 h-14 rounded-full! hover:scale-105 active:scale-95"
        >
          <Camera className="w-6 h-6 text-white" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-gray-100 text-text-primary text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-sm">
            Scan QR Code
          </span>
        </button>
      </div>

      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowScanner(true)}
          className="btn-filled px-4 py-2"
        >
          <Camera className="w-4 h-4" />
          Scan QR Code
        </button>
      </div>

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
