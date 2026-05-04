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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "Edit Service" : "Add Service"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 p-5">
          <form onSubmit={handleSubmit} className="space-y-4" id="service-form">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Service Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                  errors.name ? "border-red-500" : "border-gray-600"
                }`}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Data Center Management"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                  errors.description ? "border-red-500" : "border-gray-600"
                }`}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the service..."
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
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
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
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
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : "border-gray-600 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      <IconComp className="w-5 h-5 mx-auto" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Free / Negotiable / $99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Estimated Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                    errors.estimatedTime ? "border-red-500" : "border-gray-600"
                  }`}
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedTime: e.target.value })
                  }
                  placeholder="e.g., 2-3 days, 1 week"
                />
                {errors.estimatedTime && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.estimatedTime}
                  </p>
                )}
              </div>
            </div>

            {/* Popular Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular}
                onChange={(e) =>
                  setFormData({ ...formData, popular: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="popular" className="text-sm text-gray-300">
                Mark as Popular
              </label>
            </div>
          </form>
        </div>

        {/* Buttons */}
        <div className="p-5 border-t border-gray-700 bg-gray-800/90 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="submit"
              form="service-form"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
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
              className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition"
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
