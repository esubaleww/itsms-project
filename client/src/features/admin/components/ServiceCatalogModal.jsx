import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  Save,
  Package,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
  Star,
  Briefcase,
  Wifi,
  Database,
  Server,
  Globe,
  Code,
  Cloud,
  Shield,
  Lock,
  Layers,
} from "lucide-react";
import { useToast } from "../../../components/ui/Toast";

const ServiceCatalogModal = ({ service, onClose, onSubmit, isEditing }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: service?.name || "",
    category: service?.category || "infrastructure",
    icon: service?.icon || "Briefcase",
    description: service?.description || "",
    estimatedTime: service?.estimatedTime || "",
    popular: service?.popular || false,
    price: service?.price || "Free",
    requirements: service?.requirements || [],
    documents: service?.documents || [],
  });
  const [newRequirement, setNewRequirement] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: "infrastructure", label: "Infrastructure", icon: Server },
    { value: "development", label: "Development", icon: Code },
    { value: "security", label: "Security", icon: Shield },
    { value: "consulting", label: "Consulting", icon: Briefcase },
    { value: "training", label: "Training", icon: FileText },
    { value: "other", label: "Other", icon: Layers },
  ];

  const icons = [
    { value: "Briefcase", icon: Briefcase, label: "Briefcase" },
    { value: "Wifi", icon: Wifi, label: "WiFi" },
    { value: "Database", icon: Database, label: "Database" },
    { value: "Server", icon: Server, label: "Server" },
    { value: "Globe", icon: Globe, label: "Globe" },
    { value: "Code", icon: Code, label: "Code" },
    { value: "Cloud", icon: Cloud, label: "Cloud" },
    { value: "Shield", icon: Shield, label: "Shield" },
    { value: "Lock", icon: Lock, label: "Lock" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Service name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.icon) newErrors.icon = "Icon is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.estimatedTime.trim())
      newErrors.estimatedTime = "Estimated time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, newDocument.trim()],
      }));
      setNewDocument("");
    }
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      addToast(
        `Service ${isEditing ? "updated" : "created"} successfully!`,
        "success",
      );
      onClose();
    } catch (error) {
      addToast(
        error.message || `Failed to ${isEditing ? "update" : "create"} service`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const SelectedIcon =
    icons.find((i) => i.value === formData.icon)?.icon || Briefcase;
  const CategoryIcon =
    categories.find((c) => c.value === formData.category)?.icon || Layers;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "Edit Service" : "Add New Service"}
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
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5" id="service-form">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Service Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                      errors.name ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="e.g., Network Setup"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <CategoryIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                      errors.category ? "border-red-500" : "border-gray-600"
                    }`}
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat.value}
                        value={cat.value}
                        className="bg-gray-800"
                      >
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Icon <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <SelectedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    name="icon"
                    required
                    value={formData.icon}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                      errors.icon ? "border-red-500" : "border-gray-600"
                    }`}
                  >
                    {icons.map((icon) => (
                      <option
                        key={icon.value}
                        value={icon.value}
                        className="bg-gray-800"
                      >
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.icon && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.icon}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Estimated Time <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="estimatedTime"
                    required
                    value={formData.estimatedTime}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                      errors.estimatedTime
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="e.g., 3-5 days"
                  />
                </div>
                {errors.estimatedTime && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.estimatedTime}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-y ${
                  errors.description ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Detailed description of the service..."
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="e.g., Free, $500, etc."
                  />
                </div>
              </div>

              <div className="flex items-center mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="popular"
                    checked={formData.popular}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-gray-800"
                  />
                  <span className="text-sm text-gray-300 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Mark as Popular
                  </span>
                </label>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Requirements
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addRequirement())
                  }
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Add a requirement..."
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-700/50 px-3 py-1.5 rounded-lg text-sm text-gray-300 flex items-center gap-2 border border-gray-600"
                    >
                      {req}
                      <button
                        type="button"
                        onClick={() => removeRequirement(idx)}
                        className="text-gray-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Required Documents
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addDocument())
                  }
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Add a required document..."
                />
                <button
                  type="button"
                  onClick={addDocument}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.documents.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-700/50 px-3 py-1.5 rounded-lg text-sm text-gray-300 flex items-center gap-2 border border-gray-600"
                    >
                      <FileText className="w-3 h-3" />
                      {doc}
                      <button
                        type="button"
                        onClick={() => removeDocument(idx)}
                        className="text-gray-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Update Service" : "Create Service"}
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

export default ServiceCatalogModal;
