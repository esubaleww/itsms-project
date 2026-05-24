import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  PlayCircle,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
} from "lucide-react";

const MyTasksList = ({ tasks, loading, onUpdateStatus, onViewDetails }) => {
  const [updatingTask, setUpdatingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-blue-50 text-accent border border-accent/30";
      case "in_progress":
        return "bg-blue-50 text-blue-600 border border-blue-500/30";
      default:
        return "bg-yellow-50 text-yellow-600 border border-yellow-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      case "in_progress":
        return <PlayCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const handleUpdateStatus = async (taskId, taskIndex, newStatus) => {
    setUpdatingTask(taskId);
    try {
      await onUpdateStatus(taskId, taskIndex, newStatus);
    } finally {
      setUpdatingTask(null);
    }
  };

  const toggleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200">
        <Clock className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">No tasks assigned to you</p>
        <p className="text-sm text-text-muted mt-1">
          Tasks assigned by your team lead will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, idx) => {
        const isExpanded = expandedTask === task._id;
        const instructions =
          task.instructions ||
          task.timeline?.find((t) => t.action === "Task assigned to individual")
            ?.details;

        return (
          <motion.div
            key={task._id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {getStatusIcon(task.status)}{" "}
                      {task.status?.replace("_", " ")}
                    </span>
                    {task.metadata?.priority && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.metadata.priority === "urgent"
                            ? "bg-red-50 text-red-600 border border-red-500/30"
                            : task.metadata.priority === "high"
                              ? "bg-orange-50 text-orange-600 border border-orange-500/30"
                              : "bg-yellow-50 text-yellow-600 border border-yellow-500/30"
                        }`}
                      >
                        {task.metadata.priority}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-medium text-text-primary mb-1">
                    {task.title || task.metadata?.serviceType || "Task"}
                  </h3>
                  <p className="text-sm text-text-muted mb-2">
                    {task.description || task.metadata?.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Assigned by: {task.assignedBy?.fullName || "Team Lead"}
                    </span>
                    {task.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {instructions && (
                    <div className="mt-2 text-xs text-text-muted flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span className="line-clamp-1">
                        Instructions: {instructions}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  {task.status !== "completed" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          task._id,
                          task.index || 0,
                          "completed",
                        )
                      }
                      disabled={updatingTask === task._id}
                      className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                      title="Mark Complete"
                    >
                      {updatingTask === task._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  {task.status !== "in_progress" &&
                    task.status !== "completed" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            task._id,
                            task.index || 0,
                            "in_progress",
                          )
                        }
                        disabled={updatingTask === task._id}
                        className="p-1.5 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                        title="Start Task"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </button>
                    )}
                  <button
                    onClick={() => toggleExpand(task._id)}
                    className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition"
                    title={isExpanded ? "Show Less" : "View Details"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 space-y-3"
                >
                  {instructions && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Instructions from Team Lead
                      </h4>
                      <p className="text-sm text-text-secondary whitespace-pre-wrap">
                        {instructions}
                      </p>
                    </div>
                  )}

                  {task.timeline && task.timeline.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-text-muted mb-2">
                        Timeline
                      </h4>
                      <div className="space-y-2">
                        {task.timeline.map((event, eventIdx) => (
                          <div
                            key={eventIdx}
                            className="flex items-start gap-2 text-xs"
                          >
                            <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-accent" />
                            <div>
                              <p className="text-text-secondary">
                                {event.action}
                              </p>
                              <p className="text-text-muted">
                                {new Date(event.date).toLocaleString()}
                              </p>
                              {event.details && (
                                <p className="text-text-muted text-xs mt-0.5">
                                  {event.details}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                      <span className="text-text-muted">Created</span>
                      <p className="text-text-primary">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {task.deadline && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <span className="text-text-muted">Deadline</span>
                        <p className="text-text-primary">
                          {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {task.completedAt && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <span className="text-text-muted">Completed</span>
                        <p className="text-text-primary">
                          {new Date(task.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {task.assignedTo && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <span className="text-text-muted">Assigned To</span>
                        <p className="text-text-primary">
                          {task.assignedTo?.fullName || "You"}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MyTasksList;
