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
        className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-700 shadow-2xl"
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "Edit Announcement" : "Create Announcement"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            id="announcement-form"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                    errors.title ? "border-red-500" : "border-gray-600"
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <CategoryIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                    errors.category ? "border-red-500" : "border-gray-600"
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
                      className="bg-gray-800"
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows="6"
                className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-y ${
                  errors.content ? "border-red-500" : "border-gray-600"
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Image <span className="text-gray-500">(Optional)</span>
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
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-gray-800"
              />
              <label
                htmlFor="isFeatured"
                className="text-sm text-gray-300 flex items-center gap-1"
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
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-gray-800"
              />
              <label htmlFor="isPublished" className="text-sm text-gray-300">
                Publish immediately
              </label>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-700 bg-gray-800/90 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="submit"
              form="announcement-form"
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
                  <Send className="w-4 h-4" />
                  {isEditing ? "Update Announcement" : "Create Announcement"}
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

export default CreateAnnouncementModal;
