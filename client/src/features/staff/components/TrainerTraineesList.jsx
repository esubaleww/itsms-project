import { motion } from "framer-motion";
import { Eye, Calendar, School, Mail, Award, CheckCircle } from "lucide-react";

const TrainerTraineesList = ({
  trainees = [],
  onViewProgress,
  onFinalReview,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]" />
      </div>
    );
  }

  if (!trainees || trainees.length === 0) {
    return (
      <div className="text-center py-16 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl border border-[#E5E7EB]">
        <School className="w-16 h-16 text-[#9ca3af] mx-auto mb-4" />
        <p className="text-[#6b7280] text-lg">No trainees assigned</p>
        <p className="text-sm text-[#6b7280] mt-1">
          Trainees will appear here once assigned by the director
        </p>
      </div>
    );
  }

  const getTraineeName = (trainee) => trainee.trainee?.fullName || "Unknown";
  const getTraineeEmail = (trainee) => trainee.trainee?.email || "";
  const getTraineeProfession = (trainee) =>
    trainee.profession || "No profession specified";
  const getCompletionRate = (trainee) => trainee.progress?.completionRate || 0;
  const getSessionsAttended = (trainee) =>
    trainee.progress?.attendedSessions || 0;
  const getTotalSessions = (trainee) => trainee.progress?.totalSessions || 0;
  const hasSubmittedReview = (trainee) => {
    console.log("trainee", trainee);
    return trainee.trainerSummary && trainee.trainerSummary.submittedAt;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {trainees.map((trainee, index) => {
        const name = getTraineeName(trainee);
        const email = getTraineeEmail(trainee);
        const profession = getTraineeProfession(trainee);
        const completionRate = getCompletionRate(trainee);
        const sessionsAttended = getSessionsAttended(trainee);
        const totalSessions = getTotalSessions(trainee);
        const reviewSubmitted = hasSubmittedReview(trainee);

        return (
          <motion.div
            key={trainee._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-blue-500/50 transition-all duration-300 group"
          >
            <div className="p-5 pb-3 border-b border-[#E5E7EB]/50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#111827] text-lg group-hover:text-blue-400 transition truncate">
                    {name}
                  </h3>
                  <p className="text-xs text-[#6b7280] mt-1 line-clamp-1">
                    {profession}
                  </p>
                </div>
                {reviewSubmitted && (
                  <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full whitespace-nowrap ml-2 font-medium">
                    Review Sent
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6b7280] mt-2">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
            </div>

            <div className="px-5 py-3 border-b border-[#E5E7EB]/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563eb]" />
                  <span className="text-xs text-[#6b7280]">Attendance</span>
                </div>
                <span className="text-xs text-[#2563eb] font-medium">
                  {sessionsAttended}/{totalSessions} sessions
                </span>
              </div>
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5 mb-3">
                <div
                  className="bg-[#2563eb] h-1.5 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                  <span className="text-[#6b7280]">
                    Progress: {completionRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => onViewProgress(trainee.trainee?._id)}
                className="btn-institutional flex items-center justify-center gap-2 py-2 px-3 text-sm w-full"
              >
                <Eye className="w-4 h-4" />
                Progress
              </button>
              {reviewSubmitted ? (
                <div className="flex items-center justify-center gap-2 py-2 px-3 bg-[#F3F4F6] text-[#9ca3af] border border-[#E5E7EB] rounded-lg text-sm cursor-not-allowed font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Review Sent
                </div>
              ) : (
                <button
                  onClick={() => onFinalReview(trainee)}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg transition text-sm font-medium"
                >
                  <Award className="w-4 h-4" />
                  Final Review
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TrainerTraineesList;
