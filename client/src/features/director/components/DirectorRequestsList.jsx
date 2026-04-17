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
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
          border: "border-emerald-500/30",
          icon: Check,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-400",
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
          color: "text-gray-400",
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
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
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
          color: "text-gray-400",
          bg: "bg-gray-500/20",
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "urgent":
        return {
          color: "text-red-400",
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
          color: "text-gray-400",
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
    const instructions = prompt(
      "Enter instructions for the advisor (optional):",
    );
    setShowAdvisorAssign(requestId);
    setSelectedStaff("");
  };

  const handleMentorClick = (requestId) => {
    const instructions = prompt(
      "Enter instructions for the mentor (optional):",
    );
    setShowMentorAssign(requestId);
    setSelectedStaff("");
  };

  const handleTrainerClick = (requestId) => {
    const instructions = prompt(
      "Enter instructions for the trainer (optional):",
    );
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
    return (
      (req.type === "innovation" || req.type === "startup") &&
      req.status === "approved" &&
      !req.assignedMentor
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
            className="bg-gray-800 rounded-xl border border-gray-700 p-5 animate-pulse"
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4 border border-gray-700">
          <AlertCircle className="w-10 h-10 text-gray-600" />
        </div>
        <p className="text-gray-400 text-lg">No requests found</p>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
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
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
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
                    <span className="flex items-center gap-1 text-xs text-gray-500">
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
                    <p className="font-semibold text-white text-lg">
                      {typeConfig.label}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <User className="w-3 h-3 text-gray-500" />
                      <span className="font-medium">From:</span>
                      <span>{req.applicant?.fullName || "Unknown"}</span>
                    </div>
                    {req.applicant?.email && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Mail className="w-3 h-3" />
                        {req.applicant.email}
                      </div>
                    )}
                    {req.applicant?.phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Phone className="w-3 h-3" />
                        {req.applicant.phone}
                      </div>
                    )}
                  </div>

                  {req.description && (
                    <p className="text-sm text-gray-300 mt-3 bg-gray-700/30 rounded-lg p-3 line-clamp-2">
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
                      <div className="flex items-center gap-1 text-xs text-emerald-400">
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
                      <div className="flex flex-col gap-2 bg-gray-700 rounded-lg border border-gray-600 p-2">
                        <select
                          value={selectedTeam}
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          className="text-sm bg-transparent px-2 py-1 text-white focus:outline-none min-w-40"
                          autoFocus
                          disabled={isLoading}
                        >
                          <option value="" className="bg-gray-800">
                            Select Team...
                          </option>
                          {teams.map((team) => (
                            <option
                              key={team._id}
                              value={team._id}
                              className="bg-gray-800"
                            >
                              {team.name} ({team.members?.length || 0} members)
                            </option>
                          ))}
                        </select>
                        <textarea
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Instructions for the team (optional)..."
                          className="text-sm bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                          rows="2"
                          disabled={isLoading}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleConfirmAssign}
                            disabled={!selectedTeam || isLoading}
                            className={`px-2 py-1 rounded transition ${
                              selectedTeam && !isLoading
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
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
                            className="px-2 py-1 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition"
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

                  {showAssign &&
                    needsAdvisor(req) &&
                    (isAdvisorAssigning ? (
                      <StaffAssignmentDropdown
                        options={advisorOptions}
                        selectedStaff={selectedStaff}
                        onSelect={setSelectedStaff}
                        onConfirm={() =>
                          handleConfirmStaffAssign(
                            "advisor",
                            req._id,
                            selectedStaff,
                          )
                        }
                        onCancel={handleCancelStaffAssign}
                        isLoading={isLoading}
                        placeholder="Select Advisor..."
                      />
                    ) : (
                      <button
                        onClick={() => handleAdvisorClick(req._id)}
                        className="text-emerald-400 text-xs font-medium px-2 py-1 rounded-lg hover:bg-emerald-500/20 transition flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        Assign Advisor
                      </button>
                    ))}

                  {showAssign &&
                    needsMentor(req) &&
                    (isMentorAssigning ? (
                      <StaffAssignmentDropdown
                        options={mentorOptions}
                        selectedStaff={selectedStaff}
                        onSelect={setSelectedStaff}
                        onConfirm={() =>
                          handleConfirmStaffAssign(
                            "mentor",
                            req._id,
                            selectedStaff,
                          )
                        }
                        onCancel={handleCancelStaffAssign}
                        isLoading={isLoading}
                        placeholder="Select Mentor..."
                      />
                    ) : (
                      <button
                        onClick={() => handleMentorClick(req._id)}
                        className="text-purple-400 text-xs font-medium px-2 py-1 rounded-lg hover:bg-purple-500/20 transition flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        Assign Mentor
                      </button>
                    ))}

                  {showAssign &&
                    needsTrainer(req) &&
                    (isTrainerAssigning ? (
                      <StaffAssignmentDropdown
                        options={trainerOptions}
                        selectedStaff={selectedStaff}
                        onSelect={setSelectedStaff}
                        onConfirm={() =>
                          handleConfirmStaffAssign(
                            "trainer",
                            req._id,
                            selectedStaff,
                          )
                        }
                        onCancel={handleCancelStaffAssign}
                        isLoading={isLoading}
                        placeholder="Select Trainer..."
                      />
                    ) : (
                      <button
                        onClick={() => handleTrainerClick(req._id)}
                        className="text-cyan-400 text-xs font-medium px-2 py-1 rounded-lg hover:bg-cyan-500/20 transition flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        Assign Trainer
                      </button>
                    ))}

                  <button
                    onClick={() => onViewDetails?.(req._id)}
                    className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {req.timeline && req.timeline.length > 0 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : req._id)}
                      className={`p-2 rounded-lg transition ${
                        isExpanded
                          ? "text-emerald-400 bg-emerald-500/20"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                      title={isExpanded ? "Hide timeline" : "Show timeline"}
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && req.timeline && req.timeline.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-700 overflow-hidden"
                >
                  <div className="p-5 bg-gray-800/50">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Request Timeline
                    </h4>
                    <div className="space-y-3">
                      {req.timeline.map((event, idx) => (
                        <div key={idx} className="flex gap-3 group">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                event.action === "Approved"
                                  ? "bg-emerald-500"
                                  : event.action === "Rejected"
                                    ? "bg-red-500"
                                    : event.action === "Completed"
                                      ? "bg-purple-500"
                                      : "bg-blue-500"
                              } mt-1.5`}
                            ></div>
                            {idx < req.timeline.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-700 group-hover:bg-gray-600 mt-1"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <p className="text-sm font-medium text-white">
                              {event.action || "Status Update"}
                            </p>
                            {event.details && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {event.details}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {event.by?.fullName || "System"} •{" "}
                              {formatDateTime(
                                event.timestamp || event.createdAt,
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
  <div className="flex items-center gap-2 bg-gray-700 rounded-lg border border-gray-600 p-1">
    <select
      value={selectedStaff}
      onChange={(e) => onSelect(e.target.value)}
      className="text-sm bg-transparent px-2 py-1 text-white focus:outline-none min-w-40"
      autoFocus
      disabled={isLoading}
    >
      <option value="" className="bg-gray-800">
        {placeholder}
      </option>
      {options.map((staff) => (
        <option key={staff._id} value={staff._id} className="bg-gray-800">
          {staff.fullName} - {staff.position}
        </option>
      ))}
    </select>
    <button
      onClick={onConfirm}
      disabled={!selectedStaff || isLoading}
      className={`p-1 rounded transition ${
        selectedStaff && !isLoading
          ? "text-emerald-400 hover:bg-emerald-500/20"
          : "text-gray-500 cursor-not-allowed"
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
      className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded transition"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default DirectorRequestsList;
