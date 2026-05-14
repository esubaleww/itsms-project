import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Megaphone,
  FileText,
  Tag,
  Send,
  AlertCircle,
  Star,
} from "lucide-react";
import { useToast } from "../../../common/ui/Toast";
import { DocumentUpload } from "../../../common/components/DocumentUpload";

const CreateAnnouncementModal = ({
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || "announcement",
    image: initialData?.image || null,
    isPublished:
      initialData?.isPublished !== undefined ? initialData.isPublished : true,
    isFeatured: initialData?.isFeatured || false,
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
      const submitData = {
        ...formData,
        image: formData.image,
      };
      await onSubmit(submitData);
      addToast(
        isEditing
          ? "Announcement updated successfully!"
          : "Announcement created successfully!",
        "success",
      );
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to save announcement", "error");
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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center border border-[#2563eb]/20">
              <Megaphone className="w-4 h-4 text-[#2563eb]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">
              {isEditing ? "Edit Announcement" : "Create Announcement"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            id="announcement-form"
          >
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="text"
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all shadow-sm ${
                    errors.title ? "border-red-500" : "border-[#D1D5DB]"
                  }`}
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter announcement title"
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CategoryIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <select
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all shadow-sm ${
                    errors.category ? "border-red-500" : "border-[#D1D5DB]"
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
                      className="bg-white text-[#111827]"
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="6"
                className={`w-full px-3 py-2 bg-white border rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-y shadow-sm ${
                  errors.content ? "border-red-500" : "border-[#D1D5DB]"
                }`}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your announcement content here..."
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.content}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Image <span className="text-[#6b7280]">(Optional)</span>
              </label>
              <DocumentUpload
                label="announcement image"
                value={formData.image}
                onChange={(file) => handleInputChange("image", file)}
                maxSizeMB={10}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) =>
                  handleInputChange("isFeatured", e.target.checked)
                }
                className="w-4 h-4 rounded border-[#D1D5DB] bg-white text-[#2563eb] focus:ring-[#2563eb] focus:ring-offset-0 focus:ring-offset-white"
              />
              <label
                htmlFor="isFeatured"
                className="text-sm text-[#374151] flex items-center gap-1"
              >
                <Star className="w-4 h-4 text-yellow-400" />
                Feature this announcement (shows at top of news page)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) =>
                  handleInputChange("isPublished", e.target.checked)
                }
                className="w-4 h-4 rounded border-[#D1D5DB] bg-white text-[#2563eb] focus:ring-[#2563eb] focus:ring-offset-0 focus:ring-offset-white"
              />
              <label htmlFor="isPublished" className="text-sm text-[#374151]">
                Publish immediately
              </label>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="submit"
              form="announcement-form"
              disabled={loading}
              className="flex-1 bg-[#2563eb] text-white py-2.5 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {isEditing ? "Update Announcement" : "Create Announcement"}
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

export default CreateAnnouncementModal;
