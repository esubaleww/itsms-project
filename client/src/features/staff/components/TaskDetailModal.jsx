import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  TrendingUp,
  Clock,
  Calendar,
  User,
  FileText,
  Briefcase,
  Users,
} from "lucide-react";
import { useToast } from "../../../common/ui/Toast";

const TaskDetailModal = ({ task, onClose, onUpdateStatus }) => {
  const { addToast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(task.status);
  const [notes, setNotes] = useState("");

  const statuses = [
    {
      value: "assigned_to_team",
      label: "Pending",
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      value: "in_progress",
      label: "In Progress",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      value: "completed",
      label: "Completed",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
  ];

  const getStatusDisplay = (status) => {
    switch (status) {
      case "assigned_to_team":
        return "Pending";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-600";
      case "in_progress":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-yellow-50 text-yellow-600";
    }
  };

  const handleUpdate = async () => {
    if (selectedStatus === task.status) {
      addToast("No changes made", "info");
      return;
    }

    setUpdating(true);
    try {
      await onUpdateStatus(task._id, null, selectedStatus, notes);
      addToast(`Task marked as ${getStatusDisplay(selectedStatus)}`, "success");
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to update task", "error");
    } finally {
      setUpdating(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "service":
        return <Briefcase className="w-4 h-4" />;
      case "internship":
      case "innovation":
      case "startup":
      case "training":
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 border border-accent/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-text-primary" />
            </div>
            <h2 className="text-xl font-heading font-medium text-text-primary">
              Task Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-text-secondary`}
            >
              {getTypeIcon(task.type)}
              <span className="capitalize">{task.type}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
            >
              {getStatusDisplay(task.status)}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted uppercase tracking-wide">
              Title
            </label>
            <p className="text-text-primary font-heading font-medium text-lg mt-1">
              {task.title}
            </p>
          </div>

          {task.description && (
            <div>
              <label className="text-xs text-text-muted uppercase tracking-wide">
                Description
              </label>
              <p className="text-text-secondary mt-1 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-text-muted uppercase tracking-wide">
                Request Type
              </label>
              <p className="text-text-primary capitalize mt-1">{task.type}</p>
            </div>
            <div>
              <label className="text-xs text-text-muted uppercase tracking-wide">
                Applicant
              </label>
              <p className="text-text-primary">
                {task.applicant?.fullName || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs text-text-muted uppercase tracking-wide">
                Assigned By
              </label>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-3 h-3 text-text-muted" />
                <span className="text-text-primary">
                  {task.assignedBy?.fullName || "Team Lead"}
                </span>
              </div>
            </div>
            {task.deadline && (
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wide">
                  Deadline
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-text-muted" />
                  <span className="text-text-primary">
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {task.tasks && task.tasks.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <label className="text-xs text-text-muted uppercase tracking-wide mb-2 block">
                Subtasks
              </label>
              <div className="space-y-2">
                {task.tasks.map((subtask, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {subtask.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : subtask.status === "in_progress" ? (
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                        <span className="text-text-primary text-sm">
                          {subtask.title}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(subtask.status)}`}
                      >
                        {getStatusDisplay(subtask.status)}
                      </span>
                    </div>
                    {subtask.description && (
                      <p className="text-xs text-text-muted mt-1 ml-6">
                        {subtask.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.timeline && task.timeline.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <label className="text-xs text-text-muted uppercase tracking-wide mb-2 block">
                Timeline
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {task.timeline
                  .slice()
                  .reverse()
                  .map((event, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-accent shrink-0" />
                      <div>
                        <p className="text-text-secondary">{event.action}</p>
                        <p className="text-text-muted">
                          {new Date(event.date).toLocaleString()}
                        </p>
                        {event.details && (
                          <p className="text-text-muted mt-0.5">
                            {event.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <label className="text-xs text-text-muted uppercase tracking-wide mb-2 block">
              Update Status
            </label>
            <div className="flex gap-3 flex-wrap mb-3">
              {statuses.map((status) => {
                const StatusIcon = status.icon;
                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setSelectedStatus(status.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      selectedStatus === status.value
                        ? status.color + " ring-2 ring-accent"
                        : "bg-white text-text-muted hover:bg-gray-100"
                    }`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm">{status.label}</span>
                  </button>
                );
              })}
            </div>
            <textarea
              placeholder="Add notes (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
              rows="2"
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={updating || selectedStatus === task.status}
              className="btn-filled flex-1 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Update Status
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-text-secondary py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;
