import { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
  FileText,
  XCircle,
  Building2,
  FileCheck,
} from "lucide-react";

const ServiceRequestCard = ({ request, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = () => {
    const adminDecision = request.adminDecision;

    if (request.status === "completed") {
      return {
        color: "bg-[#EEF2FF] text-[#2563eb]",
        icon: CheckCircle,
        label: "Completed",
      };
    }
    if (request.status === "in_progress") {
      return {
        color: "bg-blue-500/20 text-blue-400",
        icon: Clock,
        label: "In Progress",
      };
    }
    if (adminDecision?.approved === true) {
      return {
        color: "bg-purple-500/20 text-purple-400",
        icon: CheckCircle,
        label: "Approved",
      };
    }
    if (adminDecision?.approved === false || request.status === "rejected") {
      return {
        color: "bg-red-500/20 text-red-500",
        icon: XCircle,
        label: "Rejected",
      };
    }
    if (request.status === "pending_admin" || request.status === "pending") {
      return {
        color: "bg-yellow-500/20 text-yellow-400",
        icon: Clock,
        label: "Pending Approval",
      };
    }
    if (request.status === "assigned_to_director") {
      return {
        color: "bg-cyan-500/20 text-cyan-400",
        icon: Briefcase,
        label: "With Director",
      };
    }
    return {
      color: "bg-gray-500/20 text-[#6b7280]",
      icon: Clock,
      label: request.status || "Pending",
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const rejectionReason = request.adminDecision?.comment;

  const requestId = `REQ-${new Date(request.createdAt).getFullYear()}-${String(request._id).slice(-6).toUpperCase()}`;

  const lastUpdate = request.updatedAt
    ? new Date(request.updatedAt)
    : new Date(request.createdAt);
  const daysAgo = Math.floor((Date.now() - lastUpdate) / (1000 * 60 * 60 * 24));
  const lastUpdateText =
    daysAgo === 0
      ? "Today"
      : daysAgo === 1
        ? "Yesterday"
        : `${daysAgo} days ago`;

  const serviceType = request.metadata?.serviceType || "Service Request";

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-500";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-[#6b7280]";
    }
  };

  const getApplicantName = () => {
    if (typeof request.applicant === "object" && request.applicant?.fullName) {
      return request.applicant.fullName;
    }
    return request.relatedProfile?.organizationName || "You";
  };

  const getDecisionMakerName = () => {
    if (
      request.adminDecision?.by &&
      typeof request.adminDecision.by === "object"
    ) {
      return request.adminDecision.by.fullName;
    }
    return "Admin";
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/70 transition-all cursor-pointer group">
      <div
        onClick={() => onClick?.(request._id)}
        className="p-4 sm:p-5 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-mono text-[#6b7280] bg-white px-2 py-1 rounded">
                {requestId}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
              {request.metadata?.priority && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${getPriorityColor(request.metadata.priority)}`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {request.metadata.priority.toUpperCase()}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-[#111827] text-base sm:text-lg mb-2">
              {serviceType}
            </h3>

            <p className="text-sm text-[#6b7280] line-clamp-2 mb-3">
              {request.metadata?.description || "No description provided"}
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <div className="flex items-center gap-2 text-xs">
                <Building2 className="w-3 h-3 text-[#6b7280]" />
                <span className="text-[#6b7280]">
                  From:{" "}
                  <span className="text-[#374151]">{getApplicantName()}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3 h-3 text-[#6b7280]" />
                <span className="text-[#6b7280]">
                  Updated:{" "}
                  <span className="text-[#374151]">{lastUpdateText}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleExpand}
            className="self-start p-1 text-[#6b7280] hover:text-[#2563eb] transition"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/40 p-4 sm:p-5 space-y-4">
          {/* Service Details */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563eb]" />
              Service Details
            </h4>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <span className="text-[#6b7280]">Type:</span>
                <span className="text-[#374151]">{serviceType}</span>
              </div>
              {request.metadata?.priority && (
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <span className="text-[#6b7280]">Priority:</span>
                  <span
                    className={`capitalize ${getPriorityColor(request.metadata.priority)}`}
                  >
                    {request.metadata.priority}
                  </span>
                </div>
              )}
              <div className="text-sm">
                <span className="text-[#6b7280] block mb-1">Description:</span>
                <span className="text-[#374151]">
                  {request.metadata?.description}
                </span>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {request.metadata?.documents && (
            <div>
              <h4 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#2563eb]" />
                Documents
              </h4>
              <div className="space-y-2">
                {request.metadata.documents.requestLetter && (
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <FileText className="w-3 h-3 text-[#6b7280] shrink-0" />
                    <span className="text-[#6b7280]">Request Letter:</span>
                    <a
                      href={request.metadata.documents.requestLetter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563eb] hover:text-[#1d4ed8] break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document
                    </a>
                  </div>
                )}
                {request.metadata.documents.authorizationLetter && (
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <FileText className="w-3 h-3 text-[#6b7280] shrink-0" />
                    <span className="text-[#6b7280]">Authorization Letter:</span>
                    <a
                      href={request.metadata.documents.authorizationLetter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563eb] hover:text-[#1d4ed8] break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document
                    </a>
                  </div>
                )}
                {request.metadata.documents.supportingDocs?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <FileText className="w-3 h-3 text-[#6b7280] shrink-0" />
                    <span className="text-[#6b7280]">Supporting Docs:</span>
                    <div className="flex flex-wrap gap-2">
                      {request.metadata.documents.supportingDocs.map(
                        (doc, idx) => (
                          <a
                            key={idx}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563eb] hover:text-[#1d4ed8] text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Document {idx + 1}
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {(request.status === "rejected" ||
            request.adminDecision?.approved === false) && (
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-500">
                  Rejection Reason
                </span>
              </div>
              <p className="text-sm text-red-300">
                {rejectionReason || "No reason provided"}
              </p>
              <p className="text-xs text-red-500/70 mt-2">
                Reviewed by: {getDecisionMakerName()}
              </p>
            </div>
          )}

          {/* Timeline */}
          {request.timeline && request.timeline.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563eb]" />
                Activity Timeline
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {request.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[#374151]">{event.action}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">
                        {event.by?.fullName || "System"} •{" "}
                        {new Date(
                          event.date || event.createdAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceRequestCard;
