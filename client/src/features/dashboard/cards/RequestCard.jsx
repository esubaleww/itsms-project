import { useNavigate } from "react-router-dom";

const RequestCard = ({ request }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending_approval":
        return "⏳";
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "in_progress":
        return "🔧";
      case "completed":
        return "🎉";
      default:
        return "📋";
    }
  };

  return (
    <div
      onClick={() => navigate(`/requests/${request._id}`)}
      className="p-4 hover:bg-gray-50 cursor-pointer transition"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-gray-500">
            {request.requestNumber}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
          >
            {getStatusIcon(request.status)} {request.status.replace("_", " ")}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(request.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="font-medium mb-1">
        {request.title || request.description?.substring(0, 60)}...
      </p>

      <div className="flex gap-4 text-sm text-gray-600">
        <span>Service: {request.service?.name || "N/A"}</span>
        <span>
          Priority:
          <span
            className={`
            ml-1 font-medium capitalize
            ${request.priority === "high" ? "text-red-600" : ""}
            ${request.priority === "medium" ? "text-yellow-600" : ""}
            ${request.priority === "low" ? "text-green-600" : ""}
          `}
          >
            {request.priority}
          </span>
        </span>
      </div>

      {/* Progress bar for in-progress */}
      {request.status === "in_progress" && request.tasks && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>
              {request.tasks.filter((t) => t.status === "completed").length}/
              {request.tasks.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${(request.tasks.filter((t) => t.status === "completed").length / request.tasks.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
