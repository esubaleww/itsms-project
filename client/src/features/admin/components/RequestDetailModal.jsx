import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  Lightbulb,
  Building2,
  Users,
  Target,
  Briefcase,
  Tag,
  TrendingUp,
  BookOpen,
  Award,
  Eye,
  ExternalLink,
  AlertCircle,
  Download,
  File,
  Link2,
  Phone,
  MapPin,
  School,
  ClipboardList,
  Calendar as CalendarIcon,
  DollarSign,
} from "lucide-react";
import { useToast } from "../../../common/ui/Toast";
import DocumentItem from "../../../common/components/DocumentItem";

const RequestDetailModal = ({ request, onClose, onApprove, onReject }) => {
  const { addToast } = useToast();
  const [comments, setComments] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const getTypeLabel = (type) => {
    switch (type) {
      case "internship":
        return "Internship Application";
      case "innovation":
        return "Innovation Application";
      case "startup":
        return "Startup Registration";
      case "service":
        return "Service Request";
      case "training":
        return "Training Request";
      default:
        return type;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "internship":
        return GraduationCap;
      case "innovation":
        return Lightbulb;
      case "startup":
        return Building2;
      case "training":
        return BookOpen;
      case "service":
        return Briefcase;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "internship":
        return "bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/30";
      case "innovation":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "startup":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "training":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "service":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-[#6b7280] border border-gray-500/30";
    }
  };

  const profile = request.relatedProfile;
  const isIntern = request.type === "internship";
  const isInnovator = request.type === "innovation";
  const isStartup = request.type === "startup";
  const isTraining = request.type === "training";
  const isService = request.type === "service";
  const isPending = request.status === "pending_admin";
  // Extract documents based on profile type
  const documents = {
    // Intern documents
    cvIntern: isIntern && profile?.documents?.cv ? profile.documents.cv : null,
    applicationLetterIntern:
      isIntern && profile?.documents?.applicationLetter
        ? profile.documents.applicationLetter
        : null,
    transcript:
      isIntern && profile?.documents?.transcript
        ? profile.documents.transcript
        : null,

    // Innovator documents
    businessPlan:
      isInnovator && profile?.documents?.businessPlan
        ? profile.documents.businessPlan
        : null,
    pitchDeck:
      isInnovator && profile?.documents?.pitchDeck
        ? profile.documents.pitchDeck
        : null,
    presentation:
      isInnovator && profile?.documents?.presentation
        ? profile.documents.presentation
        : null,

    // Startup documents
    businessLicense:
      isStartup && profile?.documents?.businessLicense
        ? profile.documents.businessLicense
        : null,
    taxId:
      isStartup && profile?.documents?.taxId ? profile.documents.taxId : null,
    memorandum:
      isStartup && profile?.documents?.memorandum
        ? profile.documents.memorandum
        : null,

    // Service documents (RequesterProfile)
    requestLetter:
      (isService || isTraining) && profile?.documents?.requestLetter
        ? profile.documents.requestLetter
        : null,
    authorizationLetter:
      (isService || isTraining) && profile?.documents?.authorizationLetter
        ? profile.documents.authorizationLetter
        : null,
    supportingDocs:
      (isService || isTraining) && profile?.documents?.supportingDocs
        ? profile.documents.supportingDocs
        : [],

    applicationLetter:
      isTraining && profile?.documents?.applicationLetter
        ? profile.documents.applicationLetter
        : null,
    cv: isTraining && profile?.documents?.cv ? profile.documents.cv : null,
  };

  const hasAnyDocuments = Object.values(documents).some((val) => {
    if (!val) return false;
    if (typeof val === "string") return true;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object") return Object.keys(val).length > 0;
    return false;
  });

  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      await onApprove(request._id, comments);
      addToast("Request approved successfully!", "success");
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to approve request", "error");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    try {
      await onReject(request._id, comments);
      addToast("Request rejected successfully!", "success");
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to reject request", "error");
    } finally {
      setRejectLoading(false);
    }
  };

  const TypeIcon = getTypeIcon(request.type);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#2563eb]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">Request Details</h2>
              <p className="text-sm text-[#6b7280]">
                Review and process application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Type Badge */}
          <div className="flex justify-start">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getTypeColor(request.type)}`}
            >
              <TypeIcon className="w-4 h-4" />
              <span>{getTypeLabel(request.type)}</span>
            </div>
          </div>
          {/* Warning if profile is not populated */}
          {request.relatedProfile &&
            typeof request.relatedProfile === "object" &&
            !profile?.documents && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-yellow-400 text-sm">
                  ⚠️ Profile data is loaded but documents might be missing.
                  Check if the profile documents were properly saved.
                </p>
              </div>
            )}
          {(!request.relatedProfile ||
            typeof request.relatedProfile !== "object") && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-500 text-sm">
                ⚠️ Profile data not loaded. Please ensure the API is populating
                the relatedProfile field.
              </p>
            </div>
          )}
          {/* Applicant Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                <User className="w-3 h-3" />
                <label>Applicant</label>
              </div>
              <p className="text-[#111827] font-medium">
                {request.applicant?.fullName ||
                  request.applicant?.name ||
                  "N/A"}
              </p>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                <Mail className="w-3 h-3" />
                <label>Email</label>
              </div>
              <p className="text-[#111827] font-medium">
                {request.applicant?.email || "N/A"}
              </p>
            </div>

            {/* Profile-specific fields */}
            {isIntern && profile && (
              <>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <GraduationCap className="w-3 h-3" />
                    <label>University</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.university?.name || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <BookOpen className="w-3 h-3" />
                    <label>Department</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.university?.department || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Tag className="w-3 h-3" />
                    <label>Student ID</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.university?.studentId || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Target className="w-3 h-3" />
                    <label>Year of Study</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.university?.year || "N/A"}
                  </p>
                </div>
              </>
            )}

            {isInnovator && profile && (
              <>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 md:col-span-2">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Lightbulb className="w-3 h-3" />
                    <label>Idea Title</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.ideaTitle || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Building2 className="w-3 h-3" />
                    <label>Institution</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.institution || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Target className="w-3 h-3" />
                    <label>Education Level</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.education?.level || "N/A"}
                  </p>
                </div>
              </>
            )}

            {isStartup && profile && (
              <>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 md:col-span-2">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Building2 className="w-3 h-3" />
                    <label>Company Name</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.companyName || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Award className="w-3 h-3" />
                    <label>Registration Number</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.registrationNumber || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Users className="w-3 h-3" />
                    <label>Employee Count</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.employeeCount || "1"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <label>Sector</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.sector || "N/A"}
                  </p>
                </div>
              </>
            )}

            {/* Service Request Fields (RequesterProfile) */}
            {(isService || isTraining) && profile && (
              <>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Building2 className="w-3 h-3" />
                    <label>Organization Name</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.organizationName || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Briefcase className="w-3 h-3" />
                    <label>Department</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.department || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <User className="w-3 h-3" />
                    <label>Position</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.position || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Phone className="w-3 h-3" />
                    <label>Contact Person</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.contactPerson || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Phone className="w-3 h-3" />
                    <label>Contact Phone</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.contactPhone || "N/A"}
                  </p>
                </div>
              </>
            )}

            {/* Training Specific Fields */}
            {isTraining && profile && profile.trainingDetails && (
              <>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <School className="w-3 h-3" />
                    <label>Training Type</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.trainingDetails?.type || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <CalendarIcon className="w-3 h-3" />
                    <label>Preferred Dates</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.trainingDetails?.preferredDates || "N/A"}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                    <Users className="w-3 h-3" />
                    <label>Number of Participants</label>
                  </div>
                  <p className="text-[#111827] font-medium">
                    {profile.trainingDetails?.participants || "N/A"}
                  </p>
                </div>
              </>
            )}

            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                <Calendar className="w-3 h-3" />
                <label>Submitted</label>
              </div>
              <p className="text-[#111827] font-medium">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                <Clock className="w-3 h-3" />
                <label>Status</label>
              </div>
              <p className="text-[#111827] font-medium capitalize">
                {request.status?.replace(/_/g, " ") || "N/A"}
              </p>
            </div>
          </div>
          {/* Service/Training Request Details */}
          {(isService || isTraining) && request.metadata && (
            <div className="space-y-4">
              <div className="border-t border-[#E5E7EB] pt-4">
                <h3 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#2563eb]" />
                  Request Details
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {request.metadata.serviceType && (
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                      <span className="text-[#6b7280] text-xs">
                        Service Type
                      </span>
                      <p className="text-[#111827] font-medium">
                        {request.metadata.serviceType}
                      </p>
                    </div>
                  )}
                  {request.metadata.priority && (
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                      <span className="text-[#6b7280] text-xs">Priority</span>
                      <p
                        className={`font-medium capitalize ${
                          request.metadata.priority === "urgent"
                            ? "text-red-500"
                            : request.metadata.priority === "high"
                              ? "text-orange-400"
                              : request.metadata.priority === "medium"
                                ? "text-yellow-400"
                                : "text-green-400"
                        }`}
                      >
                        {request.metadata.priority}
                      </p>
                    </div>
                  )}
                  {request.metadata.requirements && (
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                      <span className="text-[#6b7280] text-xs">
                        Special Requirements
                      </span>
                      <p className="text-[#111827] whitespace-pre-wrap">
                        {request.metadata.requirements}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#2563eb]">
              <FileText className="w-4 h-4" />
              <label className="text-sm font-medium text-[#374151]">
                Description
              </label>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
              <p className="text-[#374151] whitespace-pre-wrap">
                {request.metadata?.description ||
                  request.description ||
                  profile?.ideaDescription ||
                  profile?.description ||
                  "No description provided"}
              </p>
            </div>
          </div>
          {/* Innovator-specific details */}
          {isInnovator && profile && profile.problemSolved && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#2563eb]">
                <Target className="w-4 h-4" />
                <label className="text-sm font-medium text-[#374151]">
                  Problem Solved
                </label>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-[#374151] whitespace-pre-wrap">
                  {profile.problemSolved}
                </p>
              </div>
            </div>
          )}
          {isInnovator && profile && profile.targetMarket && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#2563eb]">
                <Users className="w-4 h-4" />
                <label className="text-sm font-medium text-[#374151]">
                  Target Market
                </label>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-[#374151] whitespace-pre-wrap">
                  {profile.targetMarket}
                </p>
              </div>
            </div>
          )}
          {/* Skills Section */}
          {profile?.skills && profile.skills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#2563eb]">
                <Tag className="w-4 h-4" />
                <label className="text-sm font-medium text-[#374151]">
                  Skills
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-[#EEF2FF] text-[#2563eb] rounded-lg text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Startup Founders Section */}
          {isStartup && profile?.founders && profile.founders.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#2563eb]">
                <Users className="w-4 h-4" />
                <label className="text-sm font-medium text-[#374151]">
                  Founders ({profile.founders.length})
                </label>
              </div>
              <div className="space-y-2">
                {profile.founders.map((founder, index) => (
                  <div key={index} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-[#6b7280] text-xs">Name</span>
                        <p className="text-[#111827] font-medium">{founder.name}</p>
                      </div>
                      <div>
                        <span className="text-[#6b7280] text-xs">Role</span>
                        <p className="text-[#111827] font-medium">{founder.role}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[#6b7280] text-xs">Email</span>
                        <p className="text-[#111827] font-medium">
                          {founder.email}
                        </p>
                      </div>
                      {founder.share && (
                        <div>
                          <span className="text-[#6b7280] text-xs">Share</span>
                          <p className="text-[#111827] font-medium">
                            {founder.share}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Section */}
          {hasAnyDocuments && (
            <div className="space-y-3">
              <div className="border-t border-[#E5E7EB] pt-4">
                <h3 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2563eb]" />
                  Attached Documents
                </h3>
                <div className="space-y-3">
                  {/* Intern Documents */}
                  {isIntern && (
                    <>
                      {documents.cvIntern && (
                        <DocumentItem
                          label="CV/Resume"
                          file={documents.cvIntern}
                        />
                      )}
                      {documents.applicationLetterIntern && (
                        <DocumentItem
                          label="Application Letter"
                          file={documents.applicationLetterIntern}
                        />
                      )}
                      {documents.transcript && (
                        <DocumentItem
                          label="Academic Transcript"
                          file={documents.transcript}
                        />
                      )}
                    </>
                  )}

                  {/* Innovator Documents */}
                  {isInnovator && (
                    <>
                      {documents.businessPlan && (
                        <DocumentItem
                          label="Business Plan"
                          file={documents.businessPlan}
                        />
                      )}
                      {documents.pitchDeck && (
                        <DocumentItem
                          label="Pitch Deck"
                          file={documents.pitchDeck}
                        />
                      )}
                      {documents.presentation && (
                        <DocumentItem
                          label="Presentation"
                          file={documents.presentation}
                        />
                      )}
                    </>
                  )}

                  {/* Startup Documents */}
                  {isStartup && (
                    <>
                      {documents.businessLicense && (
                        <DocumentItem
                          label="Business License"
                          file={documents.businessLicense}
                        />
                      )}
                      {documents.taxId && (
                        <DocumentItem
                          label="Tax ID / TIN Certificate"
                          file={documents.taxId}
                        />
                      )}
                      {documents.memorandum && (
                        <DocumentItem
                          label="Memorandum of Association"
                          file={documents.memorandum}
                        />
                      )}
                    </>
                  )}

                  {/* Service/Training Documents */}
                  {(isService || isTraining) && (
                    <>
                      {documents.requestLetter && (
                        <DocumentItem
                          label="Request Letter"
                          file={documents.requestLetter}
                        />
                      )}
                      {documents.authorizationLetter && (
                        <DocumentItem
                          label="Authorization Letter"
                          file={documents.authorizationLetter}
                        />
                      )}
                      {documents.applicationLetter && (
                        <DocumentItem
                          label="Application Letter"
                          file={documents.applicationLetter}
                        />
                      )}
                      {documents.cv && (
                        <DocumentItem label="CV" file={documents.cv} />
                      )}
                      {documents.supportingDocs &&
                        documents.supportingDocs.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-[#374151]">
                              Supporting Documents (
                              {documents.supportingDocs.length})
                            </p>
                            {documents.supportingDocs.map((doc, idx) => (
                              <DocumentItem
                                key={idx}
                                label={`Supporting Document ${idx + 1}`}
                                file={doc}
                              />
                            ))}
                          </div>
                        )}
                    </>
                  )}

                  {/* Fallback for any other document types */}
                  {documents.metadataDocs &&
                    typeof documents.metadataDocs === "object" &&
                    Object.entries(documents.metadataDocs).map(
                      ([key, value]) =>
                        value &&
                        typeof value === "string" && (
                          <DocumentItem
                            key={key}
                            label={key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                            file={value}
                          />
                        ),
                    )}
                </div>
              </div>
            </div>
          )}
          {/* Timeline */}
          {request.timeline && request.timeline.length > 0 && (
            <div className="space-y-3">
              <div className="border-t border-[#E5E7EB] pt-4">
                <h3 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2563eb]" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  {request.timeline.map((event, i) => (
                    <div
                      key={i}
                      className="flex gap-3 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3"
                    >
                      <div className="w-24 text-[#2563eb] font-medium">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#111827]">{event.action}</p>
                        {event.details && (
                          <p className="text-[#6b7280] text-xs mt-1">
                            {event.details}
                          </p>
                        )}
                        {event.by && (
                          <p className="text-[#6b7280] text-xs mt-1">
                            By:{" "}
                            {typeof event.by === "object"
                              ? event.by.fullName || event.by.name
                              : event.by}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {isPending && (
          <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl">
            <div className="space-y-3">
              <textarea
                placeholder="Add comments (optional)..."
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] shadow-sm focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none"
                rows="3"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={approveLoading}
                  className="flex-1 bg-[#2563eb] text-white py-2.5 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium flex items-center justify-center gap-2"
                >
                  {approveLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approve Request
                    </>
                  )}
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectLoading}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium flex items-center justify-center gap-2"
                >
                  {rejectLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Reject Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {!isPending && (
          <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition-all duration-200"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RequestDetailModal;
