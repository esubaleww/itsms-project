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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-md overflow-hidden border border-[#E5E7EB] shadow-2xl"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-[#111827]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Create Team</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5" id="team-form">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <input
                type="text"
                required
                className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                  errors.name ? "border-red-500" : "border-[#D1D5DB]"
                }`}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Innovation Assessment Team"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
            <p className="text-[#6b7280] text-xs mt-1">
              Choose a descriptive name for your team (3-50 characters)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Description
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-4 h-4 text-[#6b7280]" />
              <textarea
                rows="3"
                className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none ${
                  errors.description ? "border-red-500" : "border-[#D1D5DB]"
                }`}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="What does this team do? What are their responsibilities?"
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-[#6b7280] text-xs">
                Optional: Describe the team's purpose and goals
              </p>
              <p
                className={`text-xs ${formData.description.length > 400 ? "text-yellow-500" : "text-[#6b7280]"}`}
              >
                {formData.description.length}/500
              </p>
            </div>
          </div>

          <div className="bg-[#EEF2FF] border border-[#2563eb]/30 rounded-lg p-3">
            <p className="text-xs text-[#2563eb] flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="font-medium">Team Creation Tips:</span>
            </p>
            <ul className="text-xs text-[#6b7280] mt-1 space-y-1 ml-4 list-disc">
              <li>
                Use clear, descriptive names that reflect the team's purpose
              </li>
              <li>Define responsibilities clearly in the description</li>
            </ul>
          </div>
        </form>

        <div className="p-5 border-t border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              type="submit"
              form="team-form"
              disabled={loading}
              className="btn-institutional flex-1 py-2.5 disabled:opacity-50"
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
              className="flex-1 border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition-all duration-200"
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
