import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, Calendar, AlertCircle, User, FileText } from "lucide-react";

const AssignTaskModal = ({ onClose, onSubmit, members }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    deadline: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-500/20 text-gray-400" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-500/20 text-yellow-400",
    },
    { value: "high", label: "High", color: "bg-orange-500/20 text-orange-400" },
    { value: "urgent", label: "Urgent", color: "bg-red-500/20 text-red-400" },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.assignedTo)
      newErrors.assignedTo = "Please select a team member";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
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
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Assign Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.title ? "border-red-500" : "border-gray-600"}`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.description ? "border-red-500" : "border-gray-600"}`}
              placeholder="Describe the task..."
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assign To *
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.assignedTo ? "border-red-500" : "border-gray-600"}`}
            >
              <option value="">Select team member</option>
              {members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fullName}
                </option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="text-red-400 text-xs mt-1">{errors.assignedTo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, priority: p.value })
                  }
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition ${formData.priority === p.value ? p.color + " ring-2 ring-offset-1 ring-emerald-500" : "bg-gray-700/30 text-gray-400 hover:bg-gray-700"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Send className="w-4 h-4" /> Assign Task
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AssignTaskModal;
