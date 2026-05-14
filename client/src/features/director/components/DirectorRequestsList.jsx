// client/src/features/director/components/DirectorRequestsList.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  ChevronRight,
  X,
  Check,
  UserPlus,
  AlertCircle,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Tag,
  Lightbulb,
  Rocket,
  FileText,
  Users,
  History,
} from "lucide-react";

const DirectorRequestsList = ({
  requests = [],
  showAssign = false,
  teams = [],
  staffList = [],
  onAssign,
  onViewDetails,
  onAssignAdvisor,
}) => {
  const [assigningId, setAssigningId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [instructions, setInstructions] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showAdvisorAssign, setShowAdvisorAssign] = useState(null);
  const [showMentorAssign, setShowMentorAssign] = useState(null);
  const [showTrainerAssign, setShowTrainerAssign] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [showInstructionsInput, setShowInstructionsInput] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "text-[#2563eb]",
          bg: "bg-[#EEF2FF]",
          border: "border-[#2563eb]/30",
          icon: Check,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-500",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          icon: X,
          label: "Rejected",
        };
      case "in_progress":
        return {
          color: "text-blue-400",
          bg: "bg-blue-500/20",
          border: "border-blue-500/30",
          icon: Clock,
          label: "In Progress",
        };
      case "assigned_to_team":
        return {
          color: "text-purple-400",
          bg: "bg-purple-500/20",
          border: "border-purple-500/30",
          icon: Users,
          label: "Assigned to Team",
        };
      case "completed":
        return {
          color: "text-[#2563eb]",
          bg: "bg-[#EEF2FF]",
          border: "border-[#2563eb]/30",
          icon: Check,
          label: "Completed",
        };
      case "pending_admin":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          icon: Clock,
          label: "Pending Admin",
        };
      default:
        return {
          color: "text-[#6b7280]",
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
          icon: AlertCircle,
          label: status?.replace(/_/g, " ").toUpperCase() || "Pending",
        };
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "internship":
        return {
          label: "Internship Application",
          icon: GraduationCap,
          color: "text-[#2563eb]",
          bg: "bg-[#EEF2FF]",
        };
      case "innovation":
        return {
          label: "Innovation Application",
          icon: Lightbulb,
          color: "text-purple-400",
          bg: "bg-purple-500/20",
        };
      case "startup":
        return {
          label: "Startup Application",
          icon: Rocket,
          color: "text-orange-400",
          bg: "bg-orange-500/20",
        };
      case "service":
        return {
          label: "Service Request",
          icon: Briefcase,
          color: "text-blue-400",
          bg: "bg-blue-500/20",
        };
      case "training":
        return {
          label: "Training Request",
          icon: GraduationCap,
          color: "text-cyan-400",
          bg: "bg-cyan-500/20",
        };
      default:
        return {
          label: type || "Application",
          icon: FileText,
          color: "text-[#6b7280]",
          bg: "bg-gray-500/20",
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "urgent":
        return {
          color: "text-red-500",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          label: "Urgent",
        };
      case "high":
        return {
          color: "text-orange-400",
          bg: "bg-orange-500/20",
          border: "border-orange-500/30",
          label: "High",
        };
      case "medium":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          label: "Medium",
        };
      default:
        return {
          color: "text-[#6b7280]",
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
          label: "Low",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const advisorOptions = useMemo(() => {
    return staffList.filter(
      (staff) =>
        staff.position === "technical_staff" ||
        staff.position === "trainer" ||
        staff.position === "advisor",
    );
  }, [staffList]);

  const mentorOptions = useMemo(() => {
    return staffList.filter(
      (staff) =>
        staff.position === "mentor" ||
        staff.position === "technical_staff" ||
        staff.position === "advisor",
    );
  }, [staffList]);

  const trainerOptions = useMemo(() => {
    return staffList.filter(
      (staff) =>
        staff.position === "trainer" ||
        staff.position === "technical_staff" ||
        staff.position === "advisor",
    );
  }, [staffList]);

  const handleAssignClick = (requestId) => {
    setAssigningId(requestId);
    setSelectedTeam("");
    setInstructions("");
    setShowInstructionsInput(true);
  };

  const handleConfirmAssign = async () => {
    if (selectedTeam && onAssign) {
      setActionLoading(assigningId);
      try {
        await onAssign(assigningId, selectedTeam, instructions);
        setAssigningId(null);
        setSelectedTeam("");
        setInstructions("");
        setShowInstructionsInput(false);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleCancelAssign = () => {
    setAssigningId(null);
    setSelectedTeam("");
    setInstructions("");
    setShowInstructionsInput(false);
  };

  const handleAdvisorClick = (requestId) => {
    setShowAdvisorAssign(requestId);
    setSelectedStaff("");
  };

  const handleMentorClick = (requestId) => {
    setShowMentorAssign(requestId);
    setSelectedStaff("");
  };

  const handleTrainerClick = (requestId) => {
    setShowTrainerAssign(requestId);
    setSelectedStaff("");
  };

  const handleConfirmStaffAssign = async (type, requestId, staffId) => {
    setActionLoading(requestId);
    try {
      if (type === "advisor" && onAssignAdvisor) {
        await onAssignAdvisor(requestId, staffId);
      } else if (type === "mentor" && onAssignAdvisor) {
        await onAssignAdvisor(requestId, staffId);
      } else if (type === "trainer" && onAssignAdvisor) {
        await onAssignAdvisor(requestId, staffId);
      }
      setShowAdvisorAssign(null);
      setShowMentorAssign(null);
      setShowTrainerAssign(null);
      setSelectedStaff("");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelStaffAssign = () => {
    setShowAdvisorAssign(null);
    setShowMentorAssign(null);
    setShowTrainerAssign(null);
    setSelectedStaff("");
  };

  const needsAdvisor = (req) => {
    return (
      req.type === "internship" &&
      req.status === "approved" &&
      !req.assignedAdvisor
    );
  };

  const needsMentor = (req) => {
    console.log("Mentor check - req:", {
      type: req.type,
      status: req.status,
      assignedMentor: req.assignedMentor,
      mentor: req.mentor,
      assignedTo: req.assignedTo,
      assignments: req.assignments,
    });

    return (
      (req.type === "innovation" || req.type === "startup") &&
      req.status === "approved" &&
      !req.assignedMentor &&
      !req.mentor
    );
  };
  const needsTrainer = (req) => {
    return (
      req.type === "training" &&
      req.status === "approved" &&
      !req.assignedTrainer
    );
  };

  const needsTeam = (req) => {
    return (
      req.type === "service" && req.status === "approved" && !req.assignedTeam
    );
  };

  if (requests === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] p-5 animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-700 rounded"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-full mb-4 border border-[#E5E7EB]">
          <AlertCircle className="w-10 h-10 text-[#9ca3af]" />
        </div>
        <p className="text-[#6b7280] text-lg">No requests found</p>
        <p className="text-sm text-[#6b7280] mt-1 max-w-md mx-auto">
          All caught up! New requests will appear here once submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req, index) => {
        const statusConfig = getStatusConfig(req.status);
        const StatusIcon = statusConfig.icon;
        const typeConfig = getTypeConfig(req.type);
        const TypeIcon = typeConfig.icon;
        const priorityConfig = getPriorityConfig(req.priority);
        const isExpanded = expandedId === req._id;
        const isAssigning = assigningId === req._id;
        const isAdvisorAssigning = showAdvisorAssign === req._id;
        const isMentorAssigning = showMentorAssign === req._id;
        const isTrainerAssigning = showTrainerAssign === req._id;
        const isLoading = actionLoading === req._id;

        return (
          <motion.div
            key={req._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200"
          >
            <div className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                    {req.priority && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color} border ${priorityConfig.border}`}
                      >
                        <Tag className="w-3 h-3" />
                        {priorityConfig.label}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                      <Calendar className="w-3 h-3" />
                      {formatDate(req.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg ${typeConfig.bg} flex items-center justify-center`}
                    >
                      <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                    </div>
                    <p className="font-semibold text-[#111827] text-lg">
                      {typeConfig.label}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1 text-sm text-[#374151]">
                      <User className="w-3 h-3 text-[#6b7280]" />
                      <span className="font-medium">From:</span>
                      <span>{req.applicant?.fullName || "Unknown"}</span>
                    </div>
                    {req.applicant?.email && (
                      <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                        <Mail className="w-3 h-3" />
                        {req.applicant.email}
                      </div>
                    )}
                    {req.applicant?.phone && (
                      <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                        <Phone className="w-3 h-3" />
                        {req.applicant.phone}
                      </div>
                    )}
                  </div>

                  {req.description && (
                    <p className="text-sm text-[#374151] mt-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 line-clamp-2">
                      {req.description}
                    </p>
                  )}

                  <div className="mt-3 space-y-1">
                    {req.assignedTeam && (
                      <div className="flex items-center gap-1 text-xs text-purple-400">
                        <Users className="w-3 h-3" />
                        <span>Assigned to team:</span>
                        <span className="font-medium">
                          {req.assignedTeam?.name || req.assignedTeam}
                        </span>
                      </div>
                    )}
                    {req.assignedAdvisor && (
                      <div className="flex items-center gap-1 text-xs text-[#2563eb]">
                        <UserPlus className="w-3 h-3" />
                        <span>Advisor:</span>
                        <span className="font-medium">
                          {req.assignedAdvisor?.fullName || req.assignedAdvisor}
                        </span>
                      </div>
                    )}
                    {req.assignedMentor && (
                      <div className="flex items-center gap-1 text-xs text-purple-400">
                        <UserPlus className="w-3 h-3" />
                        <span>Mentor:</span>
                        <span className="font-medium">
                          {req.assignedMentor?.fullName || req.assignedMentor}
                        </span>
                      </div>
                    )}
                    {req.assignedTrainer && (
                      <div className="flex items-center gap-1 text-xs text-cyan-400">
                        <UserPlus className="w-3 h-3" />
                        <span>Trainer:</span>
                        <span className="font-medium">
                          {req.assignedTrainer?.fullName || req.assignedTrainer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {showAssign &&
                    needsTeam(req) &&
                    (isAssigning ? (
                      <div className="flex flex-col gap-2 bg-gray-700 rounded-lg border border-[#D1D5DB] p-2">
                        <select
                          value={selectedTeam}
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          className="text-sm bg-transparent px-2 py-1 text-[#111827] focus:outline-none min-w-40"
                          autoFocus
                          disabled={isLoading}
                        >
                          <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                            Select Team...
                          </option>
                          {teams.map((team) => (
                            <option
                              key={team._id}
                              value={team._id}
                              className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                            >
                              {team.name} ({team.members?.length || 0} members)
                            </option>
                          ))}
                        </select>
                        <textarea
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Instructions for the team (optional)..."
                          className="text-sm bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#D1D5DB] rounded-lg p-2 text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb]"
                          rows="2"
                          disabled={isLoading}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleConfirmAssign}
                            disabled={!selectedTeam || isLoading}
                            className={`px-2 py-1 rounded transition ${
                              selectedTeam && !isLoading
                                ? "bg-emerald-600 text-[#111827] hover:bg-emerald-700"
                                : "bg-gray-600 text-[#6b7280] cursor-not-allowed"
                            }`}
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            ) : (
                              "Assign"
                            )}
                          </button>
                          <button
                            onClick={handleCancelAssign}
                            disabled={isLoading}
                            className="px-2 py-1 bg-gray-600 text-[#374151] rounded hover:bg-gray-500 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAssignClick(req._id)}
                        className="text-blue-400 text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-500/20 transition flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        Assign Team
                      </button>
                    ))}

                  <button
                    onClick={() => onViewDetails?.(req._id)}
                    className="text-[#6b7280] hover:text-[#111827] p-2 rounded-lg hover:bg-[#F3F4F6] transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Timeline button - show for all requests */}
                  {req.timeline && req.timeline.length > 0 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : req._id)}
                      className={`p-2 rounded-lg transition ${
                        isExpanded
                          ? "text-[#2563eb] bg-[#EEF2FF]"
                          : "text-[#6b7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
                      }`}
                      title={isExpanded ? "Hide timeline" : "Show timeline"}
                    >
                      <History className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Section - Show for all requests when expanded */}
            <AnimatePresence>
              {isExpanded && req.timeline && req.timeline.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#E5E7EB] overflow-hidden"
                >
                  <div className="p-5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                    <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Request Timeline
                    </h4>
                    <div className="space-y-3">
                      {req.timeline.map((event, idx) => (
                        <div key={idx} className="flex gap-3 group">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                event.action === "Application approved" ||
                                event.action === "Request completed"
                                  ? "bg-emerald-500"
                                  : event.action === "Application rejected"
                                    ? "bg-red-500"
                                    : event.action === "Task completed"
                                      ? "bg-purple-500"
                                      : event.action === "Assigned to team"
                                        ? "bg-blue-500"
                                        : "bg-gray-500"
                              } mt-1.5`}
                            ></div>
                            {idx < req.timeline.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-700 group-hover:bg-gray-600 mt-1"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <p className="text-sm font-medium text-[#111827]">
                              {event.action || "Status Update"}
                            </p>
                            {event.details && (
                              <p className="text-xs text-[#6b7280] mt-0.5">
                                {event.details}
                              </p>
                            )}
                            <p className="text-xs text-[#6b7280] mt-1 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {event.by?.fullName || "System"} •{" "}
                              {formatDateTime(
                                event.date ||
                                  event.timestamp ||
                                  event.createdAt,
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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

// Helper Component for Staff Assignment Dropdown
const StaffAssignmentDropdown = ({
  options,
  selectedStaff,
  onSelect,
  onConfirm,
  onCancel,
  isLoading,
  placeholder,
}) => (
  <div className="flex items-center gap-2 bg-gray-700 rounded-lg border border-[#D1D5DB] p-1">
    <select
      value={selectedStaff}
      onChange={(e) => onSelect(e.target.value)}
      className="text-sm bg-transparent px-2 py-1 text-[#111827] focus:outline-none min-w-40"
      autoFocus
      disabled={isLoading}
    >
      <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        {placeholder}
      </option>
      {options.map((staff) => (
        <option key={staff._id} value={staff._id} className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          {staff.fullName} - {staff.position}
        </option>
      ))}
    </select>
    <button
      onClick={onConfirm}
      disabled={!selectedStaff || isLoading}
      className={`p-1 rounded transition ${
        selectedStaff && !isLoading
          ? "text-[#2563eb] hover:bg-[#EEF2FF]"
          : "text-[#6b7280] cursor-not-allowed"
      }`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent"></div>
      ) : (
        <Check className="w-4 h-4" />
      )}
    </button>
    <button
      onClick={onCancel}
      disabled={isLoading}
      className="p-1 text-[#6b7280] hover:text-red-500 hover:bg-red-500/20 rounded transition"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default DirectorRequestsList;
