import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Send,
  AlertCircle,
  Wifi,
  Database,
  Server,
  Globe,
  Code,
  Cloud,
  Shield,
  Lock,
  Briefcase,
} from "lucide-react";

const iconOptions = [
  { value: "Wifi", label: "Wifi", icon: Wifi },
  { value: "Database", label: "Database", icon: Database },
  { value: "Server", label: "Server", icon: Server },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Code", label: "Code", icon: Code },
  { value: "Cloud", label: "Cloud", icon: Cloud },
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Lock", label: "Lock", icon: Lock },
  { value: "Briefcase", label: "Briefcase", icon: Briefcase },
];

const ServiceCatalogModal = ({ service, isEditing, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    icon: "Briefcase",
    price: "",
    estimatedTime: "",
    popular: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        category: service.category || "",
        icon: service.icon || "Briefcase",
        price: service.price || "",
        estimatedTime: service.estimatedTime || "",
        popular: service.popular || false,
      });
    }
  }, [isEditing, service]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.estimatedTime)
      newErrors.estimatedTime = "Estimated time is required";
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
      console.error("Failed to save service:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "infrastructure", label: "Infrastructure" },
    { value: "development", label: "Development" },
    { value: "security", label: "Security" },
    { value: "consulting", label: "Consulting" },
    { value: "training", label: "Training" },
  ];

  const SelectedIcon =
    iconOptions.find((i) => i.value === formData.icon)?.icon || Briefcase;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-[#2563eb]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">
              {isEditing ? "Edit Service" : "Add Service"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          <form onSubmit={handleSubmit} className="space-y-4" id="service-form">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] shadow-sm ${
                  errors.name ? "border-red-500" : "border-[#D1D5DB]"
                }`}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Data Center Management"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] shadow-sm ${
                  errors.description ? "border-red-500" : "border-[#D1D5DB]"
                }`}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the service..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] shadow-sm"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((icon) => {
                  const IconComp = icon.icon;
                  return (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, icon: icon.value })
                      }
                      className={`p-2 rounded-lg border transition ${
                        formData.icon === icon.value
                          ? "border-[#2563eb] bg-[#EEF2FF] text-[#2563eb]"
                          : "border-[#D1D5DB] text-[#6b7280] hover:border-[#374151]"
                      }`}
                    >
                      <IconComp className="w-5 h-5 mx-auto" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Price
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] shadow-sm"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Free / Negotiable / $99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Estimated Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] shadow-sm ${
                    errors.estimatedTime ? "border-red-500" : "border-[#D1D5DB]"
                  }`}
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedTime: e.target.value })
                  }
                  placeholder="e.g., 2-3 days, 1 week"
                />
                {errors.estimatedTime && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.estimatedTime}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular}
                onChange={(e) =>
                  setFormData({ ...formData, popular: e.target.checked })
                }
                className="w-4 h-4 rounded border-[#D1D5DB] bg-white text-[#2563eb] focus:ring-[#2563eb]"
              />
              <label htmlFor="popular" className="text-sm text-[#374151]">
                Mark as Popular
              </label>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="submit"
              form="service-form"
              disabled={loading}
              className="flex-1 bg-[#2563eb] text-white py-2.5 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {isEditing ? "Update Service" : "Create Service"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceCatalogModal;
