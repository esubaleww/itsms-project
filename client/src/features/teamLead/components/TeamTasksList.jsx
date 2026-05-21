import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Eye,
  User,
  Calendar,
  ChevronRight,
  PlayCircle,
  UserPlus,
  X,
} from "lucide-react";

const TeamTasksList = ({
  tasks,
  detailed = false,
  onUpdateStatus,
  onViewDetails,
  onAssignTask,
  teamMembers = [],
  loading = false,
}) => {
  const [assigningTask, setAssigningTask] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [instructions, setInstructions] = useState("");

  const pendingTasks = tasks?.pending || tasks?.assigned_to_team || [];
  const inProgressTasks = tasks?.in_progress || [];
  const completedTasks = tasks?.completed || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
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

  const handleAssignSubmit = async (taskId) => {
    if (!selectedMember) return;
    await onAssignTask(taskId, selectedMember, instructions);
    setAssigningTask(null);
    setSelectedMember("");
    setInstructions("");
  };

  const handleUpdateStatus = async (taskId, taskIndex, newStatus) => {
    await onUpdateStatus(taskId, taskIndex, newStatus);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]" />
      </div>
    );
  }

  if (
    pendingTasks.length === 0 &&
    inProgressTasks.length === 0 &&
    completedTasks.length === 0
  ) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
        <p className="text-[#6b7280]">No tasks assigned to team yet</p>
        <p className="text-sm text-[#6b7280] mt-1">
          Tasks will appear here once assigned by the director
        </p>
      </div>
    );
  }

  const renderTaskCard = (task, idx, category) => {
    const isAssigned = task.assignedTo;
    const isInProgress = task.status === "in_progress";
    const isPending = task.status === "assigned_to_team";
    const isCompleted = task.status === "completed";
    const isAssigning = assigningTask === task._id;

    return (
      <motion.div
        key={task._id || idx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-xl border border-[#E5E7EB] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all overflow-hidden"
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                >
                  {getStatusIcon(task.status)} {task.status?.replace("_", " ")}
                </span>
                {task.priority && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === "urgent"
                        ? "bg-red-500/20 text-red-500 border border-red-500/30"
                        : task.priority === "high"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-[#111827] mb-1">{task.title}</h3>
              <p className="text-sm text-[#6b7280] mb-3">{task.description}</p>
              <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Applicant: {task.applicant?.fullName || "N/A"}
                </span>
                {task.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
              {isAssigned && (
                <div className="mt-2 text-xs text-[#2563eb] flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Assigned to: {task.assignedTo?.fullName}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              {isPending && !isAssigned && (
                <button
                  onClick={() => setAssigningTask(task._id)}
                  className="p-1.5 text-[#6b7280] hover:text-[#2563eb] hover:bg-[#EEF2FF] rounded-lg transition"
                  title="Assign to Member"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              )}

              {isAssigned && !isInProgress && !isCompleted && (
                <button
                  onClick={() => handleUpdateStatus(task._id, 0, "in_progress")}
                  className="p-1.5 text-[#6b7280] hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                  title="Start Task"
                >
                  <PlayCircle className="w-4 h-4" />
                </button>
              )}

              {isInProgress && (
                <button
                  onClick={() => handleUpdateStatus(task._id, 0, "completed")}
                  className="p-1.5 text-[#6b7280] hover:text-[#2563eb] hover:bg-[#EEF2FF] rounded-lg transition"
                  title="Mark Complete"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onViewDetails?.(task)}
                className="p-1.5 text-[#6b7280] hover:text-[#2563eb] hover:bg-[#EEF2FF] rounded-lg transition"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isAssigning && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-[#D1D5DB]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[#111827] text-sm font-medium">
                  Assign to Team Member
                </h4>
                <button
                  onClick={() => setAssigningTask(null)}
                  className="text-[#6b7280] hover:text-[#111827]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-3 py-2 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#D1D5DB] rounded-lg text-[#111827] text-sm mb-3"
              >
                <option value="">Select member...</option>
                {teamMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.fullName} - {member.position || "Team Member"}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Instructions (optional)"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#D1D5DB] rounded-lg text-[#111827] text-sm mb-3"
                rows="2"
              />
              <button
                onClick={() => handleAssignSubmit(task._id)}
                disabled={!selectedMember}
                className="btn-institutional w-full px-3 py-2 disabled:opacity-50"
              >
                Assign Task
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Assignment ({pendingTasks.length})
          </h3>
          <div className="space-y-3">
            {pendingTasks.map((task, idx) =>
              renderTaskCard(task, idx, "pending"),
            )}
          </div>
        </div>
      )}

      {inProgressTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            In Progress ({inProgressTasks.length})
          </h3>
          <div className="space-y-3">
            {inProgressTasks.map((task, idx) =>
              renderTaskCard(task, idx, "in_progress"),
            )}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#2563eb] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task, idx) =>
              renderTaskCard(task, idx, "completed"),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTasksList;
