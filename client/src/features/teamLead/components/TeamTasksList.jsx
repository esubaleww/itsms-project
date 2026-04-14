// client/src/features/dashboard/components/TeamTasksList.jsx
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
  Check,
  XCircle,
} from "lucide-react";

const TeamTasksList = ({
  tasks,
  detailed = false,
  onUpdateStatus,
  onViewDetails,
}) => {
  const [expandedId, setExpandedId] = useState(null);

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

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No tasks assigned yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Tasks assigned to team members will appear here
        </p>
      </div>
    );
  }

  if (!detailed) {
    return (
      <div className="divide-y divide-gray-700">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className="p-4 hover:bg-gray-700/30 transition cursor-pointer"
            onClick={() => onViewDetails?.(task)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}
                  >
                    {task.status?.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-500">{task.title}</span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-1">
                  {task.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />{" "}
                    {task.assignedTo?.fullName || "Unassigned"}
                  </span>
                  {task.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all overflow-hidden"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                  >
                    {getStatusIcon(task.status)}{" "}
                    {task.status?.replace("_", " ")}
                  </span>
                  {task.priority && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "urgent"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : task.priority === "high"
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />{" "}
                    {task.assignedTo?.fullName || "Unassigned"}
                  </span>
                  {task.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due:{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {task.status !== "completed" && (
                  <button
                    onClick={() =>
                      onUpdateStatus(task._id, task.index, "completed")
                    }
                    className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                    title="Mark Complete"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {task.status !== "in_progress" &&
                  task.status !== "completed" && (
                    <button
                      onClick={() =>
                        onUpdateStatus(task._id, task.index, "in_progress")
                      }
                      className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                      title="Start Task"
                    >
                      <PlayCircle className="w-4 h-4" />
                    </button>
                  )}
                <button
                  onClick={() => onViewDetails?.(task)}
                  className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamTasksList;
