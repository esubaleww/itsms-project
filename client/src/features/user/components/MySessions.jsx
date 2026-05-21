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
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl border border-[#E5E7EB] p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb] mx-auto" />
        <p className="text-[#6b7280] mt-4">Loading your sessions...</p>
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
        color: "bg-[#EEF2FF] text-[#2563eb]",
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
        color: "bg-red-500/20 text-red-500",
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
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl border border-[#E5E7EB] p-6 pb-20 md:pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#2563eb]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111827]">
              My Training Sessions
            </h2>
            <p className="text-sm text-[#6b7280]">
              View all your training sessions and track attendance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 text-center">
            <p className="text-xs text-[#6b7280]">Total</p>
            <p className="text-2xl font-bold text-[#111827]">{totalSessions}</p>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 text-center">
            <p className="text-xs text-[#6b7280]">Upcoming</p>
            <p className="text-2xl font-bold text-blue-400">{upcomingCount}</p>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 text-center">
            <p className="text-xs text-[#6b7280]">Attended</p>
            <p className="text-2xl font-bold text-[#2563eb]">
              {attendedCount}
            </p>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 text-center">
            <p className="text-xs text-[#6b7280]">Missed</p>
            <p className="text-2xl font-bold text-red-500">{missedCount}</p>
          </div>
        </div>

        {trainer?.fullName && (
          <div className="mb-6 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-xs text-purple-400">Your Trainer</p>
            <p className="text-sm text-[#111827] font-medium">{trainer.fullName}</p>
            {trainer.email && (
              <p className="text-xs text-[#6b7280] mt-1">{trainer.email}</p>
            )}
          </div>
        )}

        {totalSessions === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-[#9ca3af] mx-auto mb-4" />
            <p className="text-[#6b7280] text-lg">No sessions scheduled yet</p>
            <p className="text-xs text-[#6b7280] mt-1">
              Training sessions will appear here once assigned by your trainer
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
                      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5 hover:bg-[#F3F4F6] transition mb-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Calendar className="w-4 h-4 text-[#2563eb]" />
                            <p className="font-semibold text-[#111827]">
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
                            <p className="text-[#6b7280]">
                              ??{" "}
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
                              <p className="text-[#6b7280]">
                                ?? Duration: {session.duration} hours
                              </p>
                            )}
                            {session.location && (
                              <p className="text-[#6b7280]">
                                ?? Location: {session.location}
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
                <h3 className="text-md font-semibold text-[#6b7280] mb-3 flex items-center gap-2">
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
                      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5 hover:bg-[#F3F4F6] transition mb-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Calendar className="w-4 h-4 text-[#6b7280]" />
                            <p className="font-semibold text-[#111827]">
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
                            <p className="text-[#6b7280]">
                              ??{" "}
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
                              <p className="text-[#6b7280]">
                                ?? Duration: {session.duration} hours
                              </p>
                            )}
                            {session.location && (
                              <p className="text-[#6b7280]">
                                ?? Location: {session.location}
                              </p>
                            )}
                          </div>
                          {session.attendedAt && (
                            <p className="text-xs text-[#2563eb]/70 mt-2">
                              ? Attended on{" "}
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

      <div className="fixed bottom-6 right-6 z-[9999] md:hidden">
        <button
          onClick={() => setShowScanner(true)}
          className="btn-institutional group relative w-14 h-14 !rounded-full hover:scale-105 active:scale-95"
        >
          <Camera className="w-6 h-6 text-[#111827]" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#F9FAFB] text-[#111827] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Scan QR Code
          </span>
        </button>
      </div>

      <div className="hidden md:block fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setShowScanner(true)}
          className="btn-institutional px-4 py-2"
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
