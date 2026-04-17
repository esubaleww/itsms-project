import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Clock,
  TrendingUp,
  Award,
  Search,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";

const TasksList = ({ tasks, loading, onViewTask }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Award className="w-4 h-4 text-green-400" />;
      case "in_progress":
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "assigned_to_team":
        return "Pending";
      default:
        return status;
    }
  };

  const filteredTasks = tasks?.filter((task) => {
    if (filter !== "all" && task.status !== filter) return false;
    if (
      search &&
      !task.title?.toLowerCase().includes(search.toLowerCase()) &&
      !task.type?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const statusCounts = {
    all: tasks?.length || 0,
    assigned_to_team:
      tasks?.filter((t) => t.status === "assigned_to_team").length || 0,
    in_progress: tasks?.filter((t) => t.status === "in_progress").length || 0,
    completed: tasks?.filter((t) => t.status === "completed").length || 0,
  };

  if (loading) {
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">My Tasks</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[
            { value: "all", label: "All", count: statusCounts.all },
            {
              value: "assigned_to_team",
              label: "Pending",
              count: statusCounts.assigned_to_team,
            },
            {
              value: "in_progress",
              label: "In Progress",
              count: statusCounts.in_progress,
            },
            {
              value: "completed",
              label: "Completed",
              count: statusCounts.completed,
            },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === tab.value
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              {tab.label}
              <span className="ml-1 text-xs text-gray-500">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="divide-y divide-gray-700">
        {filteredTasks?.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <CheckSquare className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="px-6 py-4 hover:bg-gray-700/50 cursor-pointer transition"
              onClick={() => onViewTask(task)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <p className="font-medium text-white">{task.title}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <Briefcase className="w-3 h-3" />
                    <span className="capitalize">{task.type}</span>
                    <span>•</span>
                    <User className="w-3 h-3" />
                    <span>{task.applicant?.fullName || "N/A"}</span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    {task.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Assigned by: {task.assignedBy?.fullName || "Team Lead"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}
                  >
                    {getStatusDisplay(task.status)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewTask(task);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 text-sm"
                  >
                    Update →
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksList;
