import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Megaphone,
  FileText,
  Tag,
  Image,
  Send,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../../../components/ui/Toast";

const CreateAnnouncementModal = ({ onClose, onSubmit }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcement",
    image: "",
    isPublished: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: "announcement", label: "Announcement", icon: Megaphone },
    { value: "news", label: "News", icon: FileText },
    { value: "event", label: "Event", icon: Tag },
    { value: "success_story", label: "Success Story", icon: FileText },
    { value: "opportunity", label: "Opportunity", icon: Tag },
    { value: "update", label: "Update", icon: FileText },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (formData.image && !/^https?:\/\/\S+\.\S+/.test(formData.image)) {
      newErrors.image = "Please enter a valid image URL (http:// or https://)";
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
      addToast("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      addToast("Announcement created successfully!", "success");
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to create announcement", "error");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryValue) => {
    const category = categories.find((c) => c.value === categoryValue);
    return category?.icon || FileText;
  };

  const CategoryIcon = getCategoryIcon(formData.category);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E7EB] shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-[#0f172a]" />
            </div>
            <h2 className="text-xl font-bold text-[#0f172a]">
              Create Announcement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#4b5563] hover:text-[#0f172a]" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            id="announcement-form"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="text"
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                    errors.title ? "border-red-500" : "border-[#E5E7EB]"
                  }`}
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter announcement title"
                />
              </div>
              {errors.title && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <CategoryIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <select
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                    errors.category ? "border-red-500" : "border-[#E5E7EB]"
                  }`}
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                >
                  {categories.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      className="bg-white"
                    >
                      {c.label}
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

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows="6"
                className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-y ${
                  errors.content ? "border-red-500" : "border-[#E5E7EB]"
                }`}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your announcement content here..."
              />
              {errors.content && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.content}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">
                Image URL <span className="text-[#64748b]">(Optional)</span>
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="url"
                  className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all ${
                    errors.image ? "border-red-500" : "border-[#E5E7EB]"
                  }`}
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {errors.image && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.image}
                </p>
              )}
              {formData.image && (
                <p className="text-[#64748b] text-xs mt-1 flex items-center gap-1">
                  <Image className="w-3 h-3" /> Image will be displayed with the
                  announcement
                </p>
              )}
            </div>

            {/* Publish Immediately */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) =>
                  handleInputChange("isPublished", e.target.checked)
                }
                className="w-4 h-4 rounded border-[#E5E7EB] bg-white text-[#2563eb] focus:ring-[#2563eb] focus:ring-offset-0 focus:ring-offset-gray-800"
              />
              <label htmlFor="isPublished" className="text-sm text-[#334155]">
                Publish immediately
              </label>
            </div>
          </form>
        </div>

        {/* Buttons */}
        <div className="p-5 border-t border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="submit"
              form="announcement-form"
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
                  <Send className="w-4 h-4" />
                  Create Announcement
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

export default CreateAnnouncementModal;
