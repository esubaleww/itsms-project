import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  XCircle,
  Send,
  UserPlus,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Rocket,
  Users,
  FileText,
  Clock,
  ChevronRight,
  ChevronDown,
  Download,
  User,
  Tag,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const RequestDetailsModal = ({ request, onClose, onAssign, teams = [] }) => {
  const [comments, setComments] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    details: true,
    documents: true,
    timeline: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAssign = async () => {
    if (selectedTeam && onAssign) {
      setAssigning(true);
      try {
        await onAssign(request._id, selectedTeam, comments);
        onClose();
      } finally {
        setAssigning(false);
      }
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "intern":
        return {
          label: "Internship Application",
          icon: GraduationCap,
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
          border: "border-emerald-500/30",
        };
      case "innovator":
        return {
          label: "Innovation Application",
          icon: Lightbulb,
          color: "text-purple-400",
          bg: "bg-purple-500/20",
          border: "border-purple-500/30",
        };
      case "startup":
        return {
          label: "Startup Registration",
          icon: Rocket,
          color: "text-orange-400",
          bg: "bg-orange-500/20",
          border: "border-orange-500/30",
        };
      case "service":
        return {
          label: "Service Request",
          icon: Briefcase,
          color: "text-blue-400",
          bg: "bg-blue-500/20",
          border: "border-blue-500/30",
        };
      default:
        return {
          label: type || "Application",
          icon: FileText,
          color: "text-gray-400",
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
        };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
          border: "border-emerald-500/30",
          icon: CheckCircle,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          icon: XCircle,
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
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!request) return null;

  const typeConfig = getTypeConfig(request.type);
  const TypeIcon = typeConfig.icon;
  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;
  const priorityConfig = getPriorityConfig(request.priority);
  const isAssignable =
    request.status === "approved" &&
    !request.assignedTeam &&
    request.type === "service";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800/90 border-b border-gray-700 p-6 flex justify-between items-center z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${typeConfig.bg} flex items-center justify-center`}
            >
              <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {typeConfig.label}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
                {request.priority && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color} border ${priorityConfig.border}`}
                  >
                    <Tag className="w-3 h-3" />
                    {priorityConfig.label}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  ID: {request._id?.slice(-8) || "N/A"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Applicant Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <User className="w-4 h-4" />
                <span>Applicant</span>
              </div>
              <p className="font-medium text-white">
                {request.applicant?.fullName || "Unknown"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {request.applicant?.position || "User"}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </div>
              <p className="text-sm text-gray-300">
                {request.applicant?.email || "No email"}
              </p>
              {request.applicant?.phone && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {request.applicant.phone}
                </p>
              )}
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                <span>Submitted</span>
              </div>
              <p className="font-medium text-white">
                {formatDate(request.createdAt)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDateTime(request.createdAt)}
              </p>
            </div>
          </div>

          {/* Description Section */}
          {(request.description || request.title) && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("details")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Description</span>
                </div>
                {expandedSections.details ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4">
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {request.description ||
                          request.title ||
                          "No description provided"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Application Details */}
          {request.relatedProfile && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("personal")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                  <span className="font-semibold text-white">
                    Application Details
                  </span>
                </div>
                {expandedSections.personal ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.personal && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4 space-y-4">
                      {/* Intern Profile */}
                      {request.type === "intern" &&
                        request.relatedProfile.university && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  University
                                </label>
                                <p className="text-white mt-1">
                                  {request.relatedProfile.university.name ||
                                    "N/A"}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Student ID
                                </label>
                                <p className="text-white mt-1">
                                  {request.relatedProfile.university
                                    .studentId || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Department
                                </label>
                                <p className="text-gray-300 mt-1">
                                  {request.relatedProfile.university
                                    .department || "N/A"}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Year of Study
                                </label>
                                <p className="text-gray-300 mt-1">
                                  {request.relatedProfile.university.year ||
                                    "N/A"}
                                </p>
                              </div>
                            </div>
                            {request.relatedProfile.skills?.length > 0 && (
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Skills
                                </label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {request.relatedProfile.skills.map(
                                    (skill, i) => (
                                      <span
                                        key={i}
                                        className="bg-gray-600/50 text-gray-300 px-2 py-1 rounded-lg text-sm"
                                      >
                                        {skill}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      {/* Innovator Profile */}
                      {request.type === "innovator" &&
                        request.relatedProfile.ideaTitle && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-gray-400 uppercase tracking-wider">
                                Idea Title
                              </label>
                              <p className="font-semibold text-emerald-400 text-lg mt-1">
                                {request.relatedProfile.ideaTitle}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 uppercase tracking-wider">
                                Idea Description
                              </label>
                              <p className="text-gray-300 mt-1">
                                {request.relatedProfile.ideaDescription}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Problem Solved
                                </label>
                                <p className="text-gray-300 mt-1">
                                  {request.relatedProfile.problemSolved ||
                                    "N/A"}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Target Market
                                </label>
                                <p className="text-gray-300 mt-1">
                                  {request.relatedProfile.targetMarket || "N/A"}
                                </p>
                              </div>
                            </div>
                            {request.relatedProfile.areasOfInterest?.length >
                              0 && (
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Areas of Interest
                                </label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {request.relatedProfile.areasOfInterest.map(
                                    (area, i) => (
                                      <span
                                        key={i}
                                        className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-sm"
                                      >
                                        {area}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      {/* Startup Profile */}
                      {request.type === "startup" &&
                        request.relatedProfile.companyName && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Company Name
                                </label>
                                <p className="font-semibold text-orange-400 text-lg mt-1">
                                  {request.relatedProfile.companyName}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Registration Number
                                </label>
                                <p className="text-gray-300 mt-1">
                                  {request.relatedProfile.registrationNumber}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 uppercase tracking-wider">
                                Sector / Industry
                              </label>
                              <p className="text-gray-300 mt-1">
                                {request.relatedProfile.sector || "N/A"}
                              </p>
                            </div>
                            {request.relatedProfile.founders?.length > 0 && (
                              <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider">
                                  Founders / Team
                                </label>
                                <div className="space-y-2 mt-2">
                                  {request.relatedProfile.founders.map(
                                    (founder, i) => (
                                      <div
                                        key={i}
                                        className="bg-gray-700/50 p-3 rounded-lg"
                                      >
                                        <p className="font-medium text-white">
                                          {founder.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                          {founder.role}
                                        </p>
                                        {founder.email && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            {founder.email}
                                          </p>
                                        )}
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      {/* Service Request Details */}
                      {request.type === "service" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-gray-400 uppercase tracking-wider">
                                Service Type
                              </label>
                              <p className="text-white mt-1 font-medium">
                                {request.serviceType || "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 uppercase tracking-wider">
                                Priority
                              </label>
                              <p className="mt-1">
                                {request.priority && (
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${priorityConfig.bg} ${priorityConfig.color} border ${priorityConfig.border}`}
                                  >
                                    <Tag className="w-3 h-3" />
                                    {priorityConfig.label}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {request.requirements && (
                            <div>
                              <label className="text-xs text-gray-400 uppercase tracking-wider">
                                Special Requirements
                              </label>
                              <p className="text-gray-300 mt-1">
                                {request.requirements}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Documents Section */}
          {request.documents && request.documents.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("documents")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">
                    Attached Documents
                  </span>
                  <span className="text-xs bg-gray-600 px-2 py-0.5 rounded-full text-gray-300">
                    {request.documents.length}
                  </span>
                </div>
                {expandedSections.documents ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.documents && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4">
                      <div className="space-y-2">
                        {request.documents.map((doc, i) => (
                          <a
                            key={i}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition group"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300 group-hover:text-white">
                                {doc.name || `Document ${i + 1}`}
                              </span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-emerald-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Timeline Section */}
          {request.timeline && request.timeline.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection("timeline")}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">
                    Activity Timeline
                  </span>
                </div>
                {expandedSections.timeline ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.timeline && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4">
                      <div className="space-y-3">
                        {request.timeline.map((event, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5"></div>
                              {index < request.timeline.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-700 mt-1"></div>
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
            </div>
          )}

          {/* Assignment Info */}
          {request.assignedTeam && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-white">
                  Assigned to Team:
                </span>
                <span className="text-purple-400">
                  {request.assignedTeam?.name || request.assignedTeam}
                </span>
              </div>
              {request.assignedTo && request.assignedTo.length > 0 && (
                <div className="mt-2 text-sm text-gray-400">
                  Assigned to:{" "}
                  {request.assignedTo
                    .map((m) => m.user?.fullName || m.user)
                    .join(", ")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {isAssignable ? (
          <div className="sticky bottom-0 bg-gray-800/90 border-t border-gray-700 p-4 backdrop-blur-sm rounded-b-2xl">
            {!showAssignForm ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAssignForm(true)}
                  className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <UserPlus className="w-4 h-4" /> Assign to Team
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="" className="bg-gray-800">
                    Select a team...
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
                  placeholder="Assignment instructions (optional)..."
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                  rows="2"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAssign}
                    disabled={!selectedTeam || assigning}
                    className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    {assigning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confirm Assignment
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowAssignForm(false)}
                    className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="sticky bottom-0 bg-gray-800/90 border-t border-gray-700 p-4 backdrop-blur-sm rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RequestDetailsModal;
