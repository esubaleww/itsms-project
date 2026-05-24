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
    { value: "low", label: "Low", color: "bg-gray-100 text-text-muted" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-50 text-yellow-600",
    },
    { value: "high", label: "High", color: "bg-orange-50 text-orange-600" },
    { value: "urgent", label: "Urgent", color: "bg-red-50 text-red-600" },
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-200"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-heading font-medium text-text-primary">
              Assign Task
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-3 py-2 bg-white border rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full px-3 py-2 bg-white border rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe the task..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Assign To *
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              className={`w-full px-3 py-2 bg-white border rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ${
                errors.assignedTo ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select team member</option>
              {members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fullName}
                </option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
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
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition ${
                    formData.priority === p.value
                      ? p.color + " ring-2 ring-offset-1 ring-accent"
                      : "bg-gray-50 border border-gray-200 text-text-muted hover:bg-gray-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-filled w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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
