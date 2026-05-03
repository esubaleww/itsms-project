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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-[#E5E7EB] shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white/95 z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-[#0f172a]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a]">
              {isEditing ? "Edit Service" : "Add New Service"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition shrink-0"
          >
            <X className="w-5 h-5 text-[#4b5563] hover:text-[#0f172a]" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4 sm:space-y-5">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5"
            id="service-form"
          >
            {/* Service Name - Full width */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Service Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-3 bg-gray-50 border rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                    errors.name ? "border-red-500" : "border-[#E5E7EB]"
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

            {/* Category & Icon - 2 columns on desktop, stack on mobile */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <CategoryIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-3 bg-gray-50 border rounded-lg text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                      errors.category ? "border-red-500" : "border-[#E5E7EB]"
                    }`}
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat.value}
                        value={cat.value}
                        className="bg-white"
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

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">
                  Icon <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <SelectedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <select
                    name="icon"
                    required
                    value={formData.icon}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-3 bg-gray-50 border rounded-lg text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                      errors.icon ? "border-red-500" : "border-[#E5E7EB]"
                    }`}
                  >
                    {icons.map((icon) => (
                      <option
                        key={icon.value}
                        value={icon.value}
                        className="bg-white"
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
            </div>

            {/* Estimated Time & Price */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">
                  Estimated Time <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="text"
                    name="estimatedTime"
                    required
                    value={formData.estimatedTime}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-3 bg-gray-50 border rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                      errors.estimatedTime
                        ? "border-red-500"
                        : "border-[#E5E7EB]"
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

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">
                  Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-[#E5E7EB] rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                    placeholder="e.g., Free, $500, etc."
                  />
                </div>
              </div>
            </div>

            {/* Popular Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-[#E5E7EB] bg-white text-[#2563eb] focus:ring-[#2563eb] focus:ring-offset-0 focus:ring-offset-gray-800"
                />
                <span className="text-sm text-[#334155] flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Mark as Popular
                </span>
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-3 bg-gray-50 border rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-y ${
                  errors.description ? "border-red-500" : "border-[#E5E7EB]"
                }`}
                placeholder="Detailed description of the service..."
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Requirements
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addRequirement())
                  }
                  className="flex-1 px-3 py-3 bg-gray-50 border border-[#E5E7EB] rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                  placeholder="Add a requirement..."
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-3 bg-white hover:bg-gray-100 rounded-lg transition text-[#334155]"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-[#334155] flex items-center gap-2 border border-[#E5E7EB]"
                    >
                      {req}
                      <button
                        type="button"
                        onClick={() => removeRequirement(idx)}
                        className="text-[#64748b] hover:text-red-400 transition"
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
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Required Documents
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addDocument())
                  }
                  className="flex-1 px-3 py-3 bg-gray-50 border border-[#E5E7EB] rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                  placeholder="Add a required document..."
                />
                <button
                  type="button"
                  onClick={addDocument}
                  className="px-4 py-3 bg-white hover:bg-gray-100 rounded-lg transition text-[#334155]"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.documents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-[#334155] flex items-center gap-2 border border-[#E5E7EB]"
                    >
                      <FileText className="w-3 h-3" />
                      {doc}
                      <button
                        type="button"
                        onClick={() => removeDocument(idx)}
                        className="text-[#64748b] hover:text-red-400 transition"
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

        {/* Buttons - Stack on mobile, row on desktop */}
        <div className="p-4 sm:p-5 border-t border-[#E5E7EB] bg-white/95 rounded-b-2xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 border border-[#E5E7EB] text-[#334155] py-3 rounded-lg hover:bg-white transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="service-form"
              disabled={loading}
              className="order-1 sm:order-2 flex-1 bg-[#2563eb] text-[#0f172a] py-3 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Update Service" : "Create Service"}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceCatalogModal;
