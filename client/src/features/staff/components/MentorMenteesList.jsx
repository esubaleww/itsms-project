import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  FileText,
  Lightbulb,
  Rocket,
  Mail,
  Target,
  Award,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const MentorMenteesList = ({
  mentees = [],
  type = "innovator",
  onViewProgress,
  onReviewMilestones,
  onFinalReview,
  loading,
}) => {
  const isInnovator = type === "innovator";

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]" />
      </div>
    );
  }

  if (!mentees || mentees.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB]">
        {isInnovator ? (
          <Lightbulb className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
        ) : (
          <Rocket className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
        )}
        <p className="text-[#6b7280]">
          No {isInnovator ? "innovators" : "startups"} assigned to you
        </p>
        <p className="text-sm text-[#6b7280] mt-1">
          Mentees will appear here once assigned by the director
        </p>
      </div>
    );
  }

  const getMenteeProfileId = (mentee) => {
    return mentee._id;
  };

  const getMenteeUserId = (mentee) => {
    return mentee.mentee?._id || mentee.userId;
  };

  const getMenteeName = (mentee) => {
    if (isInnovator) {
      return mentee.mentee?.fullName || "Unknown";
    }
    return mentee.companyName || "Unknown";
  };

  const getMenteeEmail = (mentee) => {
    if (isInnovator) {
      return mentee.mentee?.email || "";
    }
    return mentee.email || "";
  };

  const getMenteeTitle = (mentee) => {
    if (isInnovator) {
      return mentee.ideaTitle || "No idea title";
    }
    return mentee.sector || "No sector specified";
  };

  const getMilestones = (mentee) => {
    return mentee.milestones || [];
  };

  const getPendingCount = (mentee) => {
    const milestones = getMilestones(mentee);
    return milestones.filter((m) => m.status === "pending").length;
  };

  const getProgressPercentage = (mentee) => {
    const milestones = getMilestones(mentee);
    if (milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.status === "completed").length;
    return Math.round((completed / milestones.length) * 100);
  };

  const hasMilestones = (mentee) => {
    return getMilestones(mentee).length > 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {mentees.map((mentee, index) => {
        const profileId = getMenteeProfileId(mentee);
        const userId = getMenteeUserId(mentee);
        const pendingCount = getPendingCount(mentee);
        const hasAnyMilestones = hasMilestones(mentee);
        const progress = getProgressPercentage(mentee);

        return (
          <motion.div
            key={profileId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] p-5 hover:border-[#2563eb]/50 transition group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-[#111827] group-hover:text-[#2563eb] transition text-base">
                  {getMenteeName(mentee)}
                </h3>
                <p className="text-xs text-[#6b7280] mt-1 line-clamp-1">
                  {getMenteeTitle(mentee)}
                </p>
              </div>
              {pendingCount > 0 && (
                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full whitespace-nowrap ml-2">
                  {pendingCount} Pending
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-[#6b7280] mb-4">
              <div className="flex items-center gap-2">
                {isInnovator ? (
                  <Lightbulb className="w-3 h-3" />
                ) : (
                  <Rocket className="w-3 h-3" />
                )}
                <span>ID: {profileId?.slice(-8) || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span className="truncate">{getMenteeEmail(mentee)}</span>
              </div>

              <div className="mt-3 pt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#6b7280]">Progress</span>
                  <span className="text-xs text-[#2563eb] font-medium">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => onViewProgress(userId, type)}
                className="flex-1 min-w-20 px-3 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-[#111827] rounded-lg transition text-sm flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" /> Progress
              </button>
              <button
                onClick={() => onReviewMilestones(mentee, type)}
                className="flex-1 min-w-25 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-[#2563eb] hover:text-[#111827] rounded-lg transition text-sm flex items-center justify-center gap-1"
              >
                <FileText className="w-3 h-3" />
                {hasAnyMilestones ? "Review" : "Add Milestones"}
              </button>
              <button
                onClick={() => onFinalReview(mentee, type)}
                className="flex-1 min-w-20 px-3 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-[#111827] rounded-lg transition text-sm flex items-center justify-center gap-1"
              >
                <Award className="w-3 h-3" /> Final
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MentorMenteesList;
