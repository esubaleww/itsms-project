import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  AlertCircle,
} from "lucide-react";

const TaskDetailsModal = ({ task, onClose, onUpdateStatus }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await onUpdateStatus(task._id, task.index, status);
      onClose();
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-700"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Task Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
            >
              {task.status?.replace("_", " ")}
            </span>
            {task.priority && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === "urgent"
                    ? "bg-red-500/20 text-red-400"
                    : task.priority === "high"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white">{task.title}</h3>
          <p className="text-gray-300">{task.description}</p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span>
                Assigned to: {task.assignedTo?.fullName || "Unassigned"}
              </span>
            </div>
            {task.deadline && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
              </div>
            )}
            {task.completedAt && (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Completed: {new Date(task.completedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {task.status !== "completed" && (
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              {task.status !== "in_progress" && (
                <button
                  onClick={() => handleStatusUpdate("in_progress")}
                  disabled={updating}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" /> Start Task
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate("completed")}
                disabled={updating}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Mark Complete
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailsModal;
