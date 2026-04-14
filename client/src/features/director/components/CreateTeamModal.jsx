import { useState } from "react";
import { motion } from "framer-motion";
import { X, Users, Briefcase, AlertCircle, Send } from "lucide-react";

const CreateTeamModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Team name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Team name must be less than 50 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create team:", error);
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
        className="bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Create Team</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5" id="team-form">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Team Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                  errors.name ? "border-red-500" : "border-gray-600"
                }`}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Innovation Assessment Team"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Choose a descriptive name for your team (3-50 characters)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <textarea
                rows="3"
                className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none ${
                  errors.description ? "border-red-500" : "border-gray-600"
                }`}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="What does this team do? What are their responsibilities?"
              />
            </div>
            {errors.description && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-gray-500 text-xs">
                Optional: Describe the team's purpose and goals
              </p>
              <p
                className={`text-xs ${formData.description.length > 400 ? "text-yellow-500" : "text-gray-500"}`}
              >
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="font-medium">Team Creation Tips:</span>
            </p>
            <ul className="text-xs text-gray-400 mt-1 space-y-1 ml-4 list-disc">
              <li>
                Use clear, descriptive names that reflect the team's purpose
              </li>
              <li>Define responsibilities clearly in the description</li>
            </ul>
          </div>
        </form>

        {/* Buttons */}
        <div className="p-5 border-t border-gray-700 bg-gray-800/90">
          <div className="flex gap-3">
            <button
              type="submit"
              form="team-form"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Create Team
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateTeamModal;
