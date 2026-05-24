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
        color: "bg-blue-50 text-accent",
        icon: CheckCircle,
        label: "Completed",
      };
    }
    if (request.status === "in_progress") {
      return {
        color: "bg-blue-50 text-blue-600",
        icon: Clock,
        label: "In Progress",
      };
    }
    if (adminDecision?.approved === true) {
      return {
        color: "bg-purple-50 text-purple-600",
        icon: CheckCircle,
        label: "Approved",
      };
    }
    if (adminDecision?.approved === false || request.status === "rejected") {
      return {
        color: "bg-red-50 text-red-600",
        icon: XCircle,
        label: "Rejected",
      };
    }
    if (request.status === "pending_admin" || request.status === "pending") {
      return {
        color: "bg-yellow-50 text-yellow-600",
        icon: Clock,
        label: "Pending Approval",
      };
    }
    if (request.status === "assigned_to_director") {
      return {
        color: "bg-cyan-50 text-cyan-600",
        icon: Briefcase,
        label: "With Director",
      };
    }
    return {
      color: "bg-gray-100 text-text-muted",
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
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-text-muted";
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
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 hover:bg-white transition-all cursor-pointer group">
      <div
        onClick={() => onClick?.(request._id)}
        className="p-4 sm:p-5 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-mono text-text-muted bg-gray-50 px-2 py-1 rounded border border-gray-200">
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

            <h3 className="font-heading font-medium text-text-primary text-base sm:text-lg mb-2">
              {serviceType}
            </h3>

            <p className="text-sm text-text-muted line-clamp-2 mb-3">
              {request.metadata?.description || "No description provided"}
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <div className="flex items-center gap-2 text-xs">
                <Building2 className="w-3 h-3 text-text-muted" />
                <span className="text-text-muted">
                  From:{" "}
                  <span className="text-text-secondary">
                    {getApplicantName()}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3 h-3 text-text-muted" />
                <span className="text-text-muted">
                  Updated:{" "}
                  <span className="text-text-secondary">{lastUpdateText}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleExpand}
            className="self-start p-1 text-text-muted hover:text-accent transition"
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
        <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-5 space-y-4">
          <div>
            <h4 className="text-sm font-heading font-medium text-text-primary mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Service Details
            </h4>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <span className="text-text-muted">Type:</span>
                <span className="text-text-secondary">{serviceType}</span>
              </div>
              {request.metadata?.priority && (
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <span className="text-text-muted">Priority:</span>
                  <span
                    className={`capitalize ${getPriorityColor(request.metadata.priority)}`}
                  >
                    {request.metadata.priority}
                  </span>
                </div>
              )}
              <div className="text-sm">
                <span className="text-text-muted block mb-1">Description:</span>
                <span className="text-text-secondary">
                  {request.metadata?.description}
                </span>
              </div>
            </div>
          </div>

          {request.metadata?.documents && (
            <div>
              <h4 className="text-sm font-heading font-medium text-text-primary mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-accent" />
                Documents
              </h4>
              <div className="space-y-2">
                {request.metadata.documents.requestLetter && (
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <FileText className="w-3 h-3 text-text-muted shrink-0" />
                    <span className="text-text-muted">Request Letter:</span>
                    <a
                      href={request.metadata.documents.requestLetter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-blue-700 break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document
                    </a>
                  </div>
                )}
                {request.metadata.documents.authorizationLetter && (
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <FileText className="w-3 h-3 text-text-muted shrink-0" />
                    <span className="text-text-muted">
                      Authorization Letter:
                    </span>
                    <a
                      href={request.metadata.documents.authorizationLetter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-blue-700 break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document
                    </a>
                  </div>
                )}
                {request.metadata.documents.supportingDocs?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <FileText className="w-3 h-3 text-text-muted shrink-0" />
                    <span className="text-text-muted">Supporting Docs:</span>
                    <div className="flex flex-wrap gap-2">
                      {request.metadata.documents.supportingDocs.map(
                        (doc, idx) => (
                          <a
                            key={idx}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-blue-700 text-xs"
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

          {(request.status === "rejected" ||
            request.adminDecision?.approved === false) && (
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-600">
                  Rejection Reason
                </span>
              </div>
              <p className="text-sm text-red-600">
                {rejectionReason || "No reason provided"}
              </p>
              <p className="text-xs text-red-500/70 mt-2">
                Reviewed by: {getDecisionMakerName()}
              </p>
            </div>
          )}

          {request.timeline && request.timeline.length > 0 && (
            <div>
              <h4 className="text-sm font-heading font-medium text-text-primary mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                Activity Timeline
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {request.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-text-secondary">{event.action}</p>
                      <p className="text-xs text-text-muted mt-0.5">
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
