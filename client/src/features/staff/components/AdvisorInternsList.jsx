import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, FileText, GraduationCap, User, Mail, Award } from "lucide-react";

const AdvisorInternsList = ({
  interns,
  onReviewReport,
  onFinalSummary,
  onViewProgress,
}) => {
  if (!interns || interns.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200">
        <GraduationCap className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">No interns assigned to you</p>
        <p className="text-sm text-text-muted mt-1">
          Interns will appear here once assigned by the director
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {interns.map((intern) => (
        <motion.div
          key={intern._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 hover:border-accent/50 transition group"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-heading font-medium text-text-primary group-hover:text-accent transition">
                {intern.fullName}
              </h3>
              <p className="text-xs text-text-muted mt-1">
                {intern.university?.name || "University not set"}
              </p>
            </div>
            {intern.pendingReports > 0 && (
              <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium whitespace-nowrap ml-2">
                {intern.pendingReports} Pending
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs text-text-muted mb-3">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>ID: {intern.university?.studentId || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3" />
              <span className="truncate">{intern.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3 h-3" />
              <span>Year: {intern.university?.year || "N/A"}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onViewProgress(intern)}
              className="btn-filled flex-1 px-3 py-1.5 text-sm"
            >
              <Eye className="w-3 h-3" /> Progress
            </button>
            <button
              onClick={() => onReviewReport(intern)}
              disabled={intern.pendingReports === 0}
              className={`flex-1 px-3 py-1.5 text-sm flex items-center justify-center gap-1 rounded-lg transition ${
                intern.pendingReports > 0
                  ? "btn-filled"
                  : "bg-gray-100 border border-gray-200 text-text-muted cursor-not-allowed"
              }`}
            >
              <FileText className="w-3 h-3" /> Review
            </button>
            <button
              onClick={() => onFinalSummary(intern)}
              className="flex-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-lg transition text-sm flex items-center justify-center gap-1 font-medium"
            >
              <Award className="w-3 h-3" /> Final
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdvisorInternsList;
