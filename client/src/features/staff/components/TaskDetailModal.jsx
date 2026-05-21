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
      color: "bg-yellow-500/20 text-yellow-400",
    },
    {
      value: "in_progress",
      label: "In Progress",
      icon: TrendingUp,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      value: "completed",
      label: "Completed",
      icon: CheckCircle,
      color: "bg-green-500/20 text-green-400",
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
        return "bg-green-500/20 text-green-400";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-[#E5E7EB] shadow-2xl"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#111827]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Task Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-white text-[#374151]`}
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
            <label className="text-xs text-[#6b7280] uppercase tracking-wide">
              Title
            </label>
            <p className="text-[#111827] font-medium text-lg mt-1">{task.title}</p>
          </div>

          {task.description && (
            <div>
              <label className="text-xs text-[#6b7280] uppercase tracking-wide">
                Description
              </label>
              <p className="text-[#374151] mt-1 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-[#6b7280] uppercase tracking-wide">
                Request Type
              </label>
              <p className="text-[#111827] capitalize mt-1">{task.type}</p>
            </div>
            <div>
              <label className="text-xs text-[#6b7280] uppercase tracking-wide">
                Applicant
              </label>
              <p className="text-[#111827]">{task.applicant?.fullName || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs text-[#6b7280] uppercase tracking-wide">
                Assigned By
              </label>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-3 h-3 text-[#6b7280]" />
                <span className="text-[#111827]">
                  {task.assignedBy?.fullName || "Team Lead"}
                </span>
              </div>
            </div>
            {task.deadline && (
              <div>
                <label className="text-xs text-[#6b7280] uppercase tracking-wide">
                  Deadline
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-[#6b7280]" />
                  <span className="text-[#111827]">
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {task.tasks && task.tasks.length > 0 && (
            <div className="border-t border-[#E5E7EB] pt-4">
              <label className="text-xs text-[#6b7280] uppercase tracking-wide mb-2 block">
                Subtasks
              </label>
              <div className="space-y-2">
                {task.tasks.map((subtask, idx) => (
                  <div key={idx} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {subtask.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : subtask.status === "in_progress" ? (
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-400" />
                        )}
                        <span className="text-[#111827] text-sm">
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
                      <p className="text-xs text-[#6b7280] mt-1 ml-6">
                        {subtask.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.timeline && task.timeline.length > 0 && (
            <div className="border-t border-[#E5E7EB] pt-4">
              <label className="text-xs text-[#6b7280] uppercase tracking-wide mb-2 block">
                Timeline
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {task.timeline
                  .slice()
                  .reverse()
                  .map((event, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 shrink-0" />
                      <div>
                        <p className="text-[#374151]">{event.action}</p>
                        <p className="text-[#6b7280]">
                          {new Date(event.date).toLocaleString()}
                        </p>
                        {event.details && (
                          <p className="text-[#6b7280] mt-0.5">
                            {event.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="border-t border-[#E5E7EB] pt-4">
            <label className="text-xs text-[#6b7280] uppercase tracking-wide mb-2 block">
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
                        ? status.color + " ring-2 ring-[#2563eb]"
                        : "bg-white text-[#6b7280] hover:bg-[#F3F4F6]"
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
              className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] text-sm"
              rows="2"
            />
          </div>
        </div>

        <div className="p-5 border-t border-[#E5E7EB] bg-white/90 backdrop-blur-sm rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={updating || selectedStatus === task.status}
              className="btn-institutional flex-1 py-2.5 disabled:opacity-50"
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
              className="flex-1 border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition-all duration-200"
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
