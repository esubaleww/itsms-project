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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!mentees || mentees.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200">
        {isInnovator ? (
          <Lightbulb className="w-12 h-12 text-text-muted mx-auto mb-3" />
        ) : (
          <Rocket className="w-12 h-12 text-text-muted mx-auto mb-3" />
        )}
        <p className="text-text-secondary">
          No {isInnovator ? "innovators" : "startups"} assigned to you
        </p>
        <p className="text-sm text-text-muted mt-1">
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
            className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 hover:border-accent/50 transition group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-heading font-medium text-text-primary group-hover:text-accent transition text-base">
                  {getMenteeName(mentee)}
                </h3>
                <p className="text-xs text-text-muted mt-1 line-clamp-1">
                  {getMenteeTitle(mentee)}
                </p>
              </div>
              {pendingCount > 0 && (
                <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium whitespace-nowrap ml-2">
                  {pendingCount} Pending
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-text-muted mb-4">
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
                  <span className="text-xs text-text-muted">Progress</span>
                  <span className="text-xs text-accent font-medium">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => onViewProgress(userId, type)}
                className="btn-filled flex-1 min-w-20 px-3 py-2 text-sm"
              >
                <Eye className="w-3 h-3" /> Progress
              </button>
              <button
                onClick={() => onReviewMilestones(mentee, type)}
                className="btn-filled flex-1 min-w-25 px-3 py-2 text-sm"
              >
                <FileText className="w-3 h-3" />
                {hasAnyMilestones ? "Review" : "Add Milestones"}
              </button>
              <button
                onClick={() => onFinalReview(mentee, type)}
                className="flex-1 min-w-20 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-lg transition text-sm flex items-center justify-center gap-1 font-medium"
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
