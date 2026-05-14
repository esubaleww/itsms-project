import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  User,
  Mail,
  Rocket,
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
  Target,
  Users,
  Briefcase,
  DollarSign,
} from "lucide-react";

const DirectorStartupsList = ({
  startups = [],
  staffList = [],
  onAssignMentor,
  onViewDetails,
  directorateId,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState("");

  const getStartupData = useCallback((item) => {
    if (!item) return null;

    const startup = item.startup || item;

    return {
      id: startup._id || item._id,
      userId: startup.user?._id || item.user?._id,
      companyName: startup.companyName || item.companyName || "Unknown",
      fullName: startup.companyName || item.companyName || "Unknown",
      email: startup.email || item.email,
      phone: startup.phone || item.phone,
      mentor: item.mentor || null,
      mentorId: item.mentor?._id,
      mentorName: item.mentor?.fullName,
      mentorPosition: item.mentor?.position,
      mentorAssignedAt: item.mentorAssignedAt,
      registrationNumber: item.registrationNumber,
      sector: item.sector,
      description: item.description,
      website: item.website,
      founders: item.founders || [],
      employeeCount: item.employeeCount || 1,
      status: item.status,
      documents: item.documents,
      milestones: item.incubation?.milestones || [],
      incubationStage: item.incubation?.stage,
      fundingStage: item.incubation?.fundingStage,
      startDate: item.incubation?.startDate,
    };
  }, []);

  const mentorOptions = useMemo(() => {
    return staffList.filter(
      (staff) =>
        (staff.position === "technical_staff" ||
          staff.position === "trainer" ||
          staff.position === "mentor" ||
          staff.position === "advisor") &&
        (!directorateId ||
          staff.directorate?._id === directorateId ||
          staff.directorate === directorateId),
    );
  }, [staffList, directorateId]);

  const handleAssignMentor = useCallback(
    (startupId) => {
      if (selectedMentor && onAssignMentor) {
        onAssignMentor(startupId, selectedMentor);
        setAssigningId(null);
        setSelectedMentor("");
      }
    },
    [selectedMentor, onAssignMentor],
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-[#EEF2FF] text-[#2563eb] text-xs px-2 py-0.5 rounded-full border border-[#2563eb]/30">
            Approved
          </span>
        );
      case "incubating":
        return (
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
            Incubating
          </span>
        );
      case "graduated":
        return (
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-500/30">
            Graduated
          </span>
        );
      default:
        return (
          <span className="bg-gray-500/20 text-[#6b7280] text-xs px-2 py-0.5 rounded-full border border-gray-500/30">
            {status || "Pending"}
          </span>
        );
    }
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case "idea":
        return (
          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
            Idea Stage
          </span>
        );
      case "mvp":
        return (
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
            MVP Stage
          </span>
        );
      case "launched":
        return (
          <span className="bg-[#EEF2FF] text-[#2563eb] text-xs px-2 py-0.5 rounded-full">
            Launched
          </span>
        );
      case "growth":
        return (
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
            Growth Stage
          </span>
        );
      default:
        return null;
    }
  };

  const getFundingStageBadge = (stage) => {
    switch (stage) {
      case "bootstrapped":
        return (
          <span className="bg-gray-500/20 text-[#6b7280] text-xs px-2 py-0.5 rounded-full">
            Bootstrapped
          </span>
        );
      case "seed":
        return (
          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
            Seed Stage
          </span>
        );
      case "angel":
        return (
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
            Angel Investment
          </span>
        );
      case "venture":
        return (
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
            Venture Capital
          </span>
        );
      default:
        return null;
    }
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
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-64"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!startups || startups.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-full mb-4 border border-[#E5E7EB]">
          <Rocket className="w-10 h-10 text-[#9ca3af]" />
        </div>
        <p className="text-[#6b7280] text-lg">No startups found</p>
        <p className="text-sm text-[#6b7280] mt-1 max-w-md mx-auto">
          Startups will appear here after their applications are approved and
          assigned to your directorate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {startups.map((item, index) => {
        const startupData = getStartupData(item);
        if (!startupData) return null;

        const isExpanded = expandedId === startupData.id;
        const isAssigning = assigningId === startupData.id;
        const hasMentor = startupData.mentorId || startupData.mentorName;
        const milestonesCompleted =
          startupData.milestones?.filter((m) => m.status === "completed")
            .length || 0;
        const totalMilestones = startupData.milestones?.length || 0;

        return (
          <motion.div
            key={startupData.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200"
          >
            {/* Main Row */}
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-700 rounded-xl flex items-center justify-center text-[#111827] font-semibold text-lg shadow-lg">
                      {startupData.companyName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#111827] text-lg">
                          {startupData.companyName}
                        </p>
                        {getStatusBadge(startupData.status)}
                        {getStageBadge(startupData.incubationStage)}
                        {getFundingStageBadge(startupData.fundingStage)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-[#6b7280]">
                        {startupData.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {startupData.email}
                          </span>
                        )}
                        {startupData.sector && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {startupData.sector}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-3">
                    {startupData.description && (
                      <p className="text-sm text-[#6b7280] mt-1 line-clamp-2">
                        {startupData.description}
                      </p>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-[#6b7280]">
                      <Users className="w-4 h-4" />
                      <span>{startupData.founders?.length || 1} founders</span>
                    </div>
                    {startupData.employeeCount && (
                      <div className="flex items-center gap-1 text-[#6b7280]">
                        <Users className="w-4 h-4" />
                        <span>{startupData.employeeCount} employees</span>
                      </div>
                    )}
                    {totalMilestones > 0 && (
                      <div className="flex items-center gap-1 text-[#2563eb]">
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          {milestonesCompleted}/{totalMilestones} milestones
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mentor Info */}
                  {hasMentor ? (
                    <div className="mt-3 flex items-center gap-2 text-sm bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/20 w-fit">
                      <UserCheck className="w-4 h-4" />
                      <span>
                        Mentor: {startupData.mentorName} (
                        {startupData.mentorPosition || "Mentor"})
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 border border-orange-500/20">
                      <AlertCircle className="w-4 h-4" />
                      <span>No mentor assigned</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:ml-4">
                  {!hasMentor &&
                    onAssignMentor &&
                    (isAssigning ? (
                      <div className="flex items-center gap-2 bg-gray-700 rounded-lg border border-[#D1D5DB] p-1">
                        <select
                          value={selectedMentor}
                          onChange={(e) => setSelectedMentor(e.target.value)}
                          className="text-sm bg-transparent px-2 py-1 text-[#111827] focus:outline-none min-w-40"
                          autoFocus
                        >
                          <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                            Select Mentor...
                          </option>
                          {mentorOptions.map((staff) => (
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
                          onClick={() =>
                            handleAssignMentor(
                              startupData.userId || startupData.id,
                            )
                          }
                          disabled={!selectedMentor}
                          className={`p-1 rounded transition ${selectedMentor ? "text-[#2563eb] hover:bg-[#EEF2FF]" : "text-[#6b7280] cursor-not-allowed"}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAssigningId(null);
                            setSelectedMentor("");
                          }}
                          className="p-1 text-[#6b7280] hover:text-red-500 hover:bg-red-500/20 rounded transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigningId(startupData.id)}
                        className="text-purple-400 text-xs font-medium px-2 py-1 rounded-lg hover:bg-purple-500/20 transition flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        Assign Mentor
                      </button>
                    ))}

                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : startupData.id)
                    }
                    className={`p-1.5 rounded-lg transition ${isExpanded ? "text-[#2563eb] bg-[#EEF2FF]" : "text-[#6b7280] hover:text-[#111827] hover:bg-[#F3F4F6]"}`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Section */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#E5E7EB] overflow-hidden"
                >
                  <div className="p-5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Building2 className="w-3 h-3" />
                        Company Details
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {startupData.registrationNumber && (
                          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                            <span className="text-[#6b7280] text-xs">
                              Registration Number
                            </span>
                            <p className="text-[#111827] text-sm mt-1">
                              {startupData.registrationNumber}
                            </p>
                          </div>
                        )}
                        {startupData.website && (
                          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                            <span className="text-[#6b7280] text-xs">
                              Website
                            </span>
                            <a
                              href={startupData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2563eb] text-sm mt-1 block hover:underline"
                            >
                              {startupData.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {startupData.founders &&
                      startupData.founders.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            Founders ({startupData.founders.length})
                          </h4>
                          <div className="space-y-2">
                            {startupData.founders.map((founder, idx) => (
                              <div
                                key={idx}
                                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-[#111827]">
                                      {founder.name}
                                    </p>
                                    <p className="text-sm text-[#6b7280]">
                                      {founder.role}
                                    </p>
                                    <p className="text-xs text-[#6b7280] mt-1">
                                      {founder.email}
                                    </p>
                                  </div>
                                  {founder.share && (
                                    <span className="text-sm text-[#2563eb]">
                                      {founder.share}% equity
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {startupData.milestones &&
                      startupData.milestones.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Award className="w-3 h-3" />
                            Milestones ({milestonesCompleted}/{totalMilestones})
                          </h4>
                          <div className="space-y-2">
                            {startupData.milestones.map((milestone, idx) => (
                              <div
                                key={idx}
                                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    {milestone.status === "completed" ? (
                                      <CheckCircle className="w-4 h-4 text-[#2563eb]" />
                                    ) : milestone.status === "in_progress" ? (
                                      <Clock className="w-4 h-4 text-blue-400" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-[#6b7280]" />
                                    )}
                                    <span className="font-medium text-[#111827] text-sm">
                                      {milestone.title}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      milestone.status === "completed"
                                        ? "bg-[#EEF2FF] text-[#2563eb]"
                                        : milestone.status === "in_progress"
                                          ? "bg-blue-500/20 text-blue-400"
                                          : "bg-gray-500/20 text-[#6b7280]"
                                    }`}
                                  >
                                    {milestone.status || "Pending"}
                                  </span>
                                </div>
                                {milestone.description && (
                                  <p className="text-sm text-[#6b7280] mt-1 ml-6">
                                    {milestone.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {startupData.documents && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Documents
                        </h4>
                        <div className="space-y-2">
                          {startupData.documents.businessLicense && (
                            <a
                              href={startupData.documents.businessLicense}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition"
                            >
                              <FileText className="w-4 h-4 text-[#2563eb]" />
                              <span className="text-sm text-[#111827]">
                                Business License
                              </span>
                            </a>
                          )}
                          {startupData.documents.memorandum && (
                            <a
                              href={startupData.documents.memorandum}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition"
                            >
                              <FileText className="w-4 h-4 text-[#2563eb]" />
                              <span className="text-sm text-[#111827]">
                                Memorandum of Association
                              </span>
                            </a>
                          )}
                        </div>
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

export default DirectorStartupsList;
