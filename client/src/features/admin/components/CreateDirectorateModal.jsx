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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md flex flex-col max-h-[90vh] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center border border-[#2563eb]/20">
              <Building2 className="w-4 h-4 text-[#2563eb]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Create Directorate</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <form
            id="create-directorate-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Directorate Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="text"
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all shadow-sm ${
                    errors.name ? "border-red-500" : "border-[#D1D5DB]"
                  }`}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Innovation Directorate"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <select
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all shadow-sm ${
                    errors.type ? "border-red-500" : "border-[#D1D5DB]"
                  }`}
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                >
                  <option value="" className="bg-white text-[#111827]">
                    Select Type
                  </option>
                  {types.map((t) => {
                    const Icon = t.icon;
                    return (
                      <option
                        key={t.value}
                        value={t.value}
                        className="bg-white text-[#111827]"
                      >
                        {t.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.type}
                </p>
              )}
            </div>

            {selectedType && TypeIcon && (
              <div
                className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-[#2563eb]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111827]">
                      {selectedType.label}
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      This directorate will handle{" "}
                      {selectedType.label.toLowerCase()} activities
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-[#6b7280]" />
                <textarea
                  rows="3"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all shadow-sm"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the directorate's purpose and responsibilities..."
                />
              </div>
              <p className="text-[#6b7280] text-xs mt-1">
                Optional: Add details about what this directorate does
              </p>
            </div>

            {formData.name && formData.type && selectedType && TypeIcon && (
              <div className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]">
                <p className="text-xs text-[#6b7280] mb-2">Preview:</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-4 h-4 text-[#2563eb]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111827]">
                      {formData.name}
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      {selectedType.label} Directorate
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl sticky bottom-0">
          <div className="flex gap-3">
            <button
              type="submit"
              form="create-directorate-form"
              disabled={loading}
              className="flex-1 bg-[#2563eb] text-white py-2.5 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 font-medium"
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

export default CreateDirectorateModal;
