import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Building2,
  FileText,
  Tag,
  AlertCircle,
  Lightbulb,
  GraduationCap,
  Wrench,
  BookOpen,
  FlaskConical,
  Cpu,
  Rocket,
} from "lucide-react";

const CreateDirectorateModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const types = [
    {
      value: "innovation",
      label: "Innovation",
      icon: Lightbulb,
      color: "from-purple-500 to-indigo-700",
    },
    {
      value: "internship",
      label: "Internship",
      icon: GraduationCap,
      color: "from-green-500 to-emerald-700",
    },
    {
      value: "startup",
      label: "Startup",
      icon: Rocket,
      color: "from-amber-500 to-orange-700",
    },
    {
      value: "service",
      label: "Service",
      icon: Wrench,
      color: "from-blue-500 to-cyan-700",
    },
    {
      value: "training",
      label: "Training",
      icon: BookOpen,
      color: "from-orange-500 to-amber-700",
    },
    {
      value: "research",
      label: "Research",
      icon: FlaskConical,
      color: "from-rose-500 to-pink-700",
    },
    {
      value: "technology",
      label: "Technology",
      icon: Cpu,
      color: "from-cyan-500 to-blue-700",
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Directorate name is required";
    if (!formData.type) newErrors.type = "Please select a type";
    if (formData.name && formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create directorate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const selectedType = types.find((t) => t.value === formData.type);
  const TypeIcon = selectedType?.icon;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md flex flex-col max-h-[90vh] border border-[#E5E7EB] shadow-2xl"
      >
        {/* Header - Sticky */}
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#0f172a]" />
            </div>
            <h2 className="text-xl font-bold text-[#0f172a]">Create Directorate</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#4b5563] hover:text-[#0f172a]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <form
            id="create-directorate-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Directorate Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="text"
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                    errors.name ? "border-red-500" : "border-[#E5E7EB]"
                  }`}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Innovation Directorate"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Type <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <select
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                    errors.type ? "border-red-500" : "border-[#E5E7EB]"
                  }`}
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                >
                  <option value="" className="bg-white">
                    Select Type
                  </option>
                  {types.map((t) => {
                    const Icon = t.icon;
                    return (
                      <option
                        key={t.value}
                        value={t.value}
                        className="bg-white"
                      >
                        {t.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              {errors.type && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.type}
                </p>
              )}
            </div>

            {/* Type Preview (when selected) */}
            {selectedType && TypeIcon && (
              <div
                className={`bg-linear-to-r ${selectedType.color} bg-opacity-20 rounded-lg p-3 border border-opacity-30`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-[#0f172a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0f172a]">
                      {selectedType.label}
                    </p>
                    <p className="text-xs text-[#0f172a]/70">
                      This directorate will handle{" "}
                      {selectedType.label.toLowerCase()} activities
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-[#64748b]" />
                <textarea
                  rows="3"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the directorate's purpose and responsibilities..."
                />
              </div>
              <p className="text-[#64748b] text-xs mt-1">
                Optional: Add details about what this directorate does
              </p>
            </div>

            {/* Preview Section */}
            {formData.name && formData.type && selectedType && TypeIcon && (
              <div className="bg-white/30 rounded-lg p-3 border border-[#E5E7EB]">
                <p className="text-xs text-[#4b5563] mb-2">Preview:</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-4 h-4 text-[#0f172a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0f172a]">
                      {formData.name}
                    </p>
                    <p className="text-xs text-[#4b5563]">
                      {selectedType.label} Directorate
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Buttons - Sticky at Bottom */}
        <div className="p-5 border-t border-[#E5E7EB] bg-white rounded-b-2xl sticky bottom-0">
          <div className="flex gap-3">
            <button
              type="submit"
              form="create-directorate-form"
              disabled={loading}
              className="flex-1 bg-[#2563eb] text-[#0f172a] py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4" />
                  Create Directorate
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E5E7EB] text-[#334155] py-2.5 rounded-lg hover:bg-white transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateDirectorateModal;
