import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  User,
  Mail,
  Lightbulb,
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
} from "lucide-react";
import DocumentItem from "../../../common/components/DocumentItem";

const DirectorInnovatorsList = ({
  innovators = [],
  staffList = [],
  onAssignMentor,
  onViewDetails,
  directorateId,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState("");

  const getInnovatorData = useCallback((item) => {
    if (!item) return null;

    const innovator = item.innovator || item;

    return {
      id: innovator._id || item._id,
      userId: innovator.user?._id || item.user?._id,
      fullName: innovator.fullName || item.fullName || "Unknown",
      email: innovator.email || item.email,
      phone: innovator.phone || item.phone,
      mentor: item.mentor || null,
      mentorId: item.mentor?._id,
      mentorName: item.mentor?.fullName,
      mentorPosition: item.mentor?.position,
      mentorAssignedAt: item.mentorAssignedAt,
      ideaTitle: item.ideaTitle,
      ideaDescription: item.ideaDescription,
      problemSolved: item.problemSolved,
      targetMarket: item.targetMarket,
      institution: item.institution,
      education: item.education,
      status: item.status,
      documents: item.documents,
      milestones: item.milestones || [],
      incubationStage: item.incubationStage,
      startDate: item.startDate,
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
    (innovatorId) => {
      if (selectedMentor && onAssignMentor) {
        onAssignMentor(innovatorId, selectedMentor);
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
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">
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
          <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-500/30">
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
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl border border-gray-700 p-4 animate-pulse"
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

  if (!innovators || innovators.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4 border border-gray-700">
          <Lightbulb className="w-10 h-10 text-gray-600" />
        </div>
        <p className="text-gray-400 text-lg">No innovators found</p>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Innovators will appear here after their applications are approved and
          assigned to your directorate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {innovators.map((item, index) => {
        const innovatorData = getInnovatorData(item);
        if (!innovatorData) return null;

        const isExpanded = expandedId === innovatorData.id;
        const isAssigning = assigningId === innovatorData.id;
        const hasMentor = innovatorData.mentorId || innovatorData.mentorName;
        const milestonesCompleted =
          innovatorData.milestones?.filter((m) => m.status === "completed")
            .length || 0;
        const totalMilestones = innovatorData.milestones?.length || 0;

        return (
          <motion.div
            key={innovatorData.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
          >
            {/* Main Row */}
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {innovatorData.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white text-lg">
                          {innovatorData.fullName}
                        </p>
                        {getStatusBadge(innovatorData.status)}
                        {getStageBadge(innovatorData.incubationStage)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                        {innovatorData.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {innovatorData.email}
                          </span>
                        )}
                        {innovatorData.institution && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {innovatorData.institution}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Idea Info */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {innovatorData.ideaTitle || "No title"}
                      </span>
                    </div>
                    {innovatorData.ideaDescription && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {innovatorData.ideaDescription}
                      </p>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>
                        {innovatorData.targetMarket || "Market not defined"}
                      </span>
                    </div>
                    {totalMilestones > 0 && (
                      <div className="flex items-center gap-1 text-emerald-400">
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
                        Mentor: {innovatorData.mentorName} (
                        {innovatorData.mentorPosition || "Mentor"})
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
                      <div className="flex items-center gap-2 bg-gray-700 rounded-lg border border-gray-600 p-1">
                        <select
                          value={selectedMentor}
                          onChange={(e) => setSelectedMentor(e.target.value)}
                          className="text-sm bg-transparent px-2 py-1 text-white focus:outline-none min-w-40"
                          autoFocus
                        >
                          <option value="" className="bg-gray-800">
                            Select Mentor...
                          </option>
                          {mentorOptions.map((staff) => (
                            <option
                              key={staff._id}
                              value={staff._id}
                              className="bg-gray-800"
                            >
                              {staff.fullName} - {staff.position || "Staff"}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            handleAssignMentor(
                              innovatorData.userId || innovatorData.id,
                            )
                          }
                          disabled={!selectedMentor}
                          className={`p-1 rounded transition ${selectedMentor ? "text-emerald-400 hover:bg-emerald-500/20" : "text-gray-500 cursor-not-allowed"}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAssigningId(null);
                            setSelectedMentor("");
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigningId(innovatorData.id)}
                        className="text-purple-400 text-xs font-medium px-2 py-1 rounded-lg hover:bg-purple-500/20 transition flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        Assign Mentor
                      </button>
                    ))}

                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : innovatorData.id)
                    }
                    className={`p-1.5 rounded-lg transition ${isExpanded ? "text-emerald-400 bg-emerald-500/20" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
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
                  className="border-t border-gray-700 overflow-hidden"
                >
                  <div className="p-5 bg-gray-800/50 space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Lightbulb className="w-3 h-3" />
                        Innovation Details
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {innovatorData.problemSolved && (
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <span className="text-gray-400 text-xs">
                              Problem Solved
                            </span>
                            <p className="text-white text-sm mt-1">
                              {innovatorData.problemSolved}
                            </p>
                          </div>
                        )}
                        {innovatorData.targetMarket && (
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <span className="text-gray-400 text-xs">
                              Target Market
                            </span>
                            <p className="text-white text-sm mt-1">
                              {innovatorData.targetMarket}
                            </p>
                          </div>
                        )}
                        {innovatorData.education?.level && (
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <span className="text-gray-400 text-xs">
                              Education
                            </span>
                            <p className="text-white text-sm mt-1">
                              {innovatorData.education.level}
                              {innovatorData.education.fieldOfStudy &&
                                ` - ${innovatorData.education.fieldOfStudy}`}
                            </p>
                          </div>
                        )}
                        {innovatorData.startDate && (
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <span className="text-gray-400 text-xs">
                              Incubation Start
                            </span>
                            <p className="text-white text-sm mt-1">
                              {new Date(
                                innovatorData.startDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {innovatorData.milestones &&
                      innovatorData.milestones.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Award className="w-3 h-3" />
                            Milestones ({milestonesCompleted}/{totalMilestones})
                          </h4>
                          <div className="space-y-2">
                            {innovatorData.milestones.map((milestone, idx) => (
                              <div
                                key={idx}
                                className="bg-gray-700/30 rounded-lg p-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    {milestone.status === "completed" ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    ) : milestone.status === "in_progress" ? (
                                      <Clock className="w-4 h-4 text-blue-400" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-gray-400" />
                                    )}
                                    <span className="font-medium text-white text-sm">
                                      {milestone.title}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      milestone.status === "completed"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : milestone.status === "in_progress"
                                          ? "bg-blue-500/20 text-blue-400"
                                          : "bg-gray-500/20 text-gray-400"
                                    }`}
                                  >
                                    {milestone.status || "Pending"}
                                  </span>
                                </div>
                                {milestone.description && (
                                  <p className="text-sm text-gray-400 mt-1 ml-6">
                                    {milestone.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    {innovatorData.documents && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Documents
                        </h4>
                        <div className="space-y-2">
                          <DocumentItem
                            file={innovatorData.documents.businessPlan}
                            label="Business Plan"
                          />
                          <DocumentItem
                            file={innovatorData.documents.pitchDeck}
                            label="Pitch Deck"
                          />
                          <DocumentItem
                            file={innovatorData.documents.presentation}
                            label="Presentation"
                          />
                        </div>
                      </div>
                    )}{" "}
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

export default DirectorInnovatorsList;
