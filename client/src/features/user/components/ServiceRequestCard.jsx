import {
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  Calendar,
  Eye,
  Users,
} from "lucide-react";

const ServiceRequestCard = ({ request, onClick }) => {
  const getStatusConfig = () => {
    switch (request.status) {
      case "completed":
        return {
          color: "bg-emerald-500/20 text-emerald-400",
          icon: CheckCircle,
          label: "Completed",
        };
      case "in_progress":
        return {
          color: "bg-blue-500/20 text-blue-400",
          icon: Clock,
          label: "In Progress",
        };
      case "approved":
        return {
          color: "bg-purple-500/20 text-purple-400",
          icon: CheckCircle,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "bg-red-500/20 text-red-400",
          icon: AlertCircle,
          label: "Rejected",
        };
      case "pending_admin":
      case "pending":
        return {
          color: "bg-yellow-500/20 text-yellow-400",
          icon: Clock,
          label: "Pending",
        };
      case "assigned_to_director":
        return {
          color: "bg-cyan-500/20 text-cyan-400",
          icon: Briefcase,
          label: "With Director",
        };
      case "assigned_to_team":
        return {
          color: "bg-indigo-500/20 text-indigo-400",
          icon: Users,
          label: "Assigned to Team",
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-400",
          icon: Clock,
          label: request.status || "Pending",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // Generate Request ID
  const requestId = `REQ-${new Date(request.createdAt).getFullYear()}-${String(request._id).slice(-6).toUpperCase()}`;

  // Calculate last update
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

  // Assigned department/team
  const assignedTo =
    request.metadata?.assignedDepartment ||
    request.assignedTeam?.name ||
    (request.assignedDirector ? "Director Assigned" : "Pending Assignment");

  // Get service type display name
  const serviceType = request.metadata?.serviceType
    ? request.metadata.serviceType.charAt(0).toUpperCase() +
      request.metadata.serviceType.slice(1)
    : request.type?.charAt(0).toUpperCase() + request.type?.slice(1);

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      onClick={() => onClick(request._id)}
      className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 hover:border-gray-600 hover:bg-gray-800/70 transition-all cursor-pointer group"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          {/* Request ID and Status */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-mono text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
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

          {/* Title */}
          <h3 className="font-semibold text-white text-lg mb-2">
            {serviceType}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {request.metadata?.description ||
              request.description ||
              "No description provided"}
          </p>

          {/* Request Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            <div className="flex items-center gap-2 text-xs">
              <Briefcase className="w-3 h-3 text-gray-500" />
              <span className="text-gray-400">
                Assigned: <span className="text-gray-300">{assignedTo}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span className="text-gray-400">
                Updated: <span className="text-gray-300">{lastUpdateText}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-gray-400">
                Created:{" "}
                <span className="text-gray-300">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </span>
            </div>
            {request.metadata?.serviceCategory && (
              <div className="flex items-center gap-2 text-xs">
                <Briefcase className="w-3 h-3 text-gray-500" />
                <span className="text-gray-400">
                  Category:{" "}
                  <span className="text-gray-300">
                    {request.metadata.serviceCategory}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Eye className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition" />
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestCard;
