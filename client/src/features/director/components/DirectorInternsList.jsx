import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  User,
  Mail,
  GraduationCap,
  UserCheck,
  Eye,
  Star,
  FileText,
  CheckCircle,
  AlertCircle,
  Phone,
  Building2,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
} from "lucide-react";

const DirectorInternsList = ({
  interns = [],
  staffList = [],
  onAssignAdvisor,
  onViewDetails,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");

  const getInternData = useCallback((item) => {
    if (!item) return null;

    return {
      id: item.intern?._id || item._id,
      fullName: item.intern?.fullName || item.fullName || "Unknown",
      email: item.intern?.email || item.email,
      phone: item.intern?.phone || item.phone,
      advisor: item.advisor,
      advisorId: item.advisor?._id,
      advisorName: item.advisor?.fullName,
      advisorPosition: item.advisor?.position,
      advisorAssignedAt: item.advisorAssignedAt,
      summary: item.summary,
      reports: item.reports || [],
      placement: item.placement,
      status: item.status,
      university: item.university?.name || item.university,
      department: item.university?.department,
      studentId: item.university?.studentId,
      year: item.university?.year,
      startDate: item.placement?.startDate,
      endDate: item.placement?.endDate,
    };
  }, []);

  const advisorOptions = staffList || [];

  const handleAssignAdvisor = useCallback(
    (internId) => {
      if (selectedAdvisor && onAssignAdvisor) {
        onAssignAdvisor(internId, selectedAdvisor);
        setAssigningId(null);
        setSelectedAdvisor("");
      }
    },
    [selectedAdvisor, onAssignAdvisor],
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="bg-[#EEF2FF] text-[#2563eb] text-xs px-2 py-0.5 rounded-full border border-[#2563eb]/30">
            Active
          </span>
        );
      case "pending":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded-full">
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="bg-[#EEF2FF] text-[#2563eb] text-xs px-2 py-0.5 rounded-full border border-[#2563eb]/30">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-[#F3F4F6] text-[#6b7280] text-xs px-2 py-0.5 rounded-full border border-[#E5E7EB]">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const getPerformanceStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-3 h-3 fill-yellow-400 text-yellow-400 opacity-50"
        />,
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] p-4 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E5E7EB] rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-[#E5E7EB] rounded w-48 mb-2"></div>
                <div className="h-4 bg-[#E5E7EB] rounded w-64"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!interns || interns.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-full mb-4 border border-[#E5E7EB]">
          <User className="w-10 h-10 text-[#9ca3af]" />
        </div>
        <p className="text-[#6b7280] text-lg">No interns found</p>
        <p className="text-sm text-[#6b7280] mt-1 max-w-md mx-auto">
          Interns will appear here after their applications are approved and
          assigned to your directorate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interns.map((item, index) => {
        const internData = getInternData(item);
        if (!internData) return null;

        const isExpanded = expandedId === internData.id;
        const isAssigning = assigningId === internData.id;
        const hasAdvisor = internData.advisorId || internData.advisorName;
        const hasSummary = internData.summary;
        const recentReports = internData.reports?.slice(-3) || [];
        const totalReports = internData.reports?.length || 0;
        const reviewedReports =
          internData.reports?.filter((r) => r.status === "advisor_reviewed")
            .length || 0;

        const getDuration = () => {
          if (internData.startDate && internData.endDate) {
            const start = new Date(internData.startDate);
            const end = new Date(internData.endDate);
            const weeks = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
            return `${weeks} weeks`;
          }
          return null;
        };

        return (
          <motion.div
            key={internData.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200"
          >
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-xl flex items-center justify-center text-[#111827] font-semibold text-lg shadow-lg">
                      {internData.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#111827] text-lg">
                          {internData.fullName}
                        </p>
                        {getStatusBadge(internData.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-[#6b7280]">
                        {internData.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {internData.email}
                          </span>
                        )}
                        {internData.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {internData.phone}
                          </span>
                        )}
                        {internData.university && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {internData.university}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-[#6b7280]">
                      <FileText className="w-4 h-4" />
                      <span>{totalReports} reports</span>
                    </div>
                    {reviewedReports > 0 && (
                      <div className="flex items-center gap-1 text-[#2563eb]">
                        <CheckCircle className="w-4 h-4" />
                        <span>{reviewedReports} reviewed</span>
                      </div>
                    )}
                    {internData.summary?.overallPerformance && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span>{internData.summary.overallPerformance}/5</span>
                      </div>
                    )}
                    {getDuration() && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <Clock className="w-4 h-4" />
                        <span>{getDuration()}</span>
                      </div>
                    )}
                  </div>

                  {hasAdvisor ? (
                    <div className="mt-3 flex items-center gap-2 text-sm bg-[#EEF2FF] text-[#2563eb] px-3 py-1.5 rounded-lg border border-[#2563eb]/20 w-fit">
                      <UserCheck className="w-4 h-4" />
                      <span>
                        Advisor: {internData.advisorName} (
                        {internData.advisorPosition || "Advisor"})
                      </span>
                      {internData.advisorAssignedAt && (
                        <span className="text-xs text-[#2563eb] ml-1">
                          assigned{" "}
                          {new Date(
                            internData.advisorAssignedAt,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 border border-orange-500/20">
                      <AlertCircle className="w-4 h-4" />
                      <span>No advisor assigned</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:ml-4">
                  {!hasAdvisor &&
                    onAssignAdvisor &&
                    (isAssigning ? (
                      <div className="flex items-center gap-2 bg-white border border-[#D1D5DB] rounded-lg p-1">
                        <select
                          value={selectedAdvisor}
                          onChange={(e) => setSelectedAdvisor(e.target.value)}
                          className="text-sm bg-transparent px-2 py-1 text-[#111827] focus:outline-none min-w-40"
                          autoFocus
                        >
                          <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                            Select Advisor...
                          </option>
                          {advisorOptions.map((staff) => (
                            <option
                              key={staff._id}
                              value={staff._id}
                              className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                            >
                              {staff.fullName} - {staff.position || "Staff"}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignAdvisor(internData.id)}
                          disabled={!selectedAdvisor}
                          className={`p-1 rounded transition ${
                            selectedAdvisor
                              ? "text-[#2563eb] hover:bg-[#EEF2FF]"
                              : "text-[#6b7280] cursor-not-allowed"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAssigningId(null);
                            setSelectedAdvisor("");
                          }}
                          className="p-1 text-[#6b7280] hover:text-red-500 hover:bg-red-500/20 rounded transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigningId(internData.id)}
                        className="text-[#2563eb] text-xs font-medium px-2 py-1 rounded-lg hover:bg-[#EEF2FF] transition flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        Assign Advisor
                      </button>
                    ))}

                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : internData.id)
                    }
                    className={`p-1.5 rounded-lg transition ${
                      isExpanded
                        ? "text-[#2563eb] bg-[#EEF2FF]"
                        : "text-[#6b7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-[#E5E7EB] overflow-hidden"
                >
                  <div className="p-5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-5">
                    {(internData.placement || internData.startDate) && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Building2 className="w-3 h-3" />
                          Placement Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {internData.department && (
                            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                              <span className="text-[#6b7280] text-xs">
                                Department
                              </span>
                              <p className="text-[#111827] font-medium text-sm mt-1">
                                {internData.department}
                              </p>
                            </div>
                          )}
                          {internData.startDate && (
                            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                              <span className="text-[#6b7280] text-xs">
                                Start Date
                              </span>
                              <p className="text-[#111827] font-medium text-sm mt-1">
                                {new Date(
                                  internData.startDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {internData.endDate && (
                            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                              <span className="text-[#6b7280] text-xs">
                                End Date
                              </span>
                              <p className="text-[#111827] font-medium text-sm mt-1">
                                {new Date(
                                  internData.endDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {internData.studentId && (
                            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                              <span className="text-[#6b7280] text-xs">
                                Student ID
                              </span>
                              <p className="text-[#111827] font-medium text-sm mt-1">
                                {internData.studentId}
                              </p>
                            </div>
                          )}
                          {internData.year && (
                            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                              <span className="text-[#6b7280] text-xs">
                                Year
                              </span>
                              <p className="text-[#111827] font-medium text-sm mt-1">
                                Year {internData.year}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {hasSummary && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Award className="w-3 h-3" />
                          Advisor Summary
                        </h4>
                        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 space-y-3">
                          {internData.summary.overallPerformance && (
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-[#374151]">
                                Overall Performance:
                              </span>
                              <div className="flex items-center gap-1">
                                {getPerformanceStars(
                                  internData.summary.overallPerformance,
                                )}
                                <span className="text-sm text-[#6b7280] ml-1">
                                  ({internData.summary.overallPerformance}/5)
                                </span>
                              </div>
                            </div>
                          )}
                          {internData.summary.strengths && (
                            <div>
                              <span className="text-sm font-medium text-[#2563eb] flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Strengths:
                              </span>
                              <p className="text-sm text-[#374151] mt-1 ml-5">
                                {internData.summary.strengths}
                              </p>
                            </div>
                          )}
                          {internData.summary.weaknesses && (
                            <div>
                              <span className="text-sm font-medium text-orange-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Areas for Improvement:
                              </span>
                              <p className="text-sm text-[#374151] mt-1 ml-5">
                                {internData.summary.weaknesses}
                              </p>
                            </div>
                          )}
                          {internData.summary.recommendation && (
                            <div>
                              <span className="text-sm font-medium text-blue-400 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                Recommendation:
                              </span>
                              <p className="text-sm text-[#374151] mt-1 ml-5">
                                {internData.summary.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {recentReports.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Recent Reports ({totalReports} total)
                        </h4>
                        <div className="space-y-2">
                          {recentReports.map((report, idx) => (
                            <div
                              key={idx}
                              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 hover:bg-[#F3F4F6] transition"
                            >
                              <div className="flex flex-wrap justify-between items-start gap-2">
                                <div>
                                  <p className="font-medium text-[#111827] text-sm">
                                    Week {report.week}
                                  </p>
                                  {report.startDate && report.endDate && (
                                    <p className="text-xs text-[#6b7280] mt-0.5">
                                      {new Date(
                                        report.startDate,
                                      ).toLocaleDateString()}{" "}
                                      -{" "}
                                      {new Date(
                                        report.endDate,
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    report.status === "advisor_reviewed"
                                      ? "bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/30"
                                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                  }`}
                                >
                                  {report.status === "advisor_reviewed"
                                    ? "Reviewed"
                                    : "Submitted"}
                                </span>
                              </div>
                              {report.content && (
                                <p className="text-sm text-[#374151] mt-2 line-clamp-2">
                                  {report.content}
                                </p>
                              )}
                              {report.advisorRating && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Star className="w-3 h-3 text-yellow-400" />
                                  <span className="text-xs text-[#6b7280]">
                                    Rating: {report.advisorRating}/5
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {totalReports === 0 && (
                      <div className="text-center py-6">
                        <FileText className="w-12 h-12 text-[#9ca3af] mx-auto mb-2" />
                        <p className="text-sm text-[#6b7280]">
                          No reports submitted yet
                        </p>
                        <p className="text-xs text-[#6b7280] mt-1">
                          Reports will appear here once the intern starts
                          submitting weekly updates.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DirectorInternsList;
