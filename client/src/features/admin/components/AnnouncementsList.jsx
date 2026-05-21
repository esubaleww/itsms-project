import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Megaphone,
  Calendar,
  Search,
  Eye,
  EyeOff,
  X,
  Star,
  StarOff,
} from "lucide-react";

const AnnouncementsList = ({
  announcements,
  onEdit,
  onDelete,
  onCreate,
  onToggleFeatured,
  onTogglePublish,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [actionLoading, setActionLoading] = useState({});

  const categories = [
    "all",
    "announcement",
    "news",
    "event",
    "success_story",
    "opportunity",
    "update",
  ];

  const getCategoryBadge = (category) => {
    switch (category) {
      case "announcement":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "news":
        return "bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/30";
      case "event":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "success_story":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "opportunity":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "update":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-[#6b7280] border border-gray-500/30";
    }
  };

  const filtered = announcements?.filter((a) => {
    if (filterCategory !== "all" && a.category !== filterCategory) return false;
    if (
      searchTerm &&
      !a.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !a.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
  };

  const handleToggleFeatured = async (announcement) => {
    setActionLoading((prev) => ({ ...prev, [announcement._id]: "featured" }));
    try {
      await onToggleFeatured(announcement);
    } finally {
      setActionLoading((prev) => ({ ...prev, [announcement._id]: undefined }));
    }
  };

  const handleTogglePublish = async (announcement) => {
    setActionLoading((prev) => ({ ...prev, [announcement._id]: "publish" }));
    try {
      await onTogglePublish(announcement);
    } finally {
      setActionLoading((prev) => ({ ...prev, [announcement._id]: undefined }));
    }
  };

  const categoryLabels = {
    announcement: "Announcement",
    news: "News",
    event: "Event",
    success_story: "Success Story",
    opportunity: "Opportunity",
    update: "Update",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
            Announcements
          </h2>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1">
            Manage public announcements and updates (
            {announcements?.length || 0} total)
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#374151]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          className="px-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all cursor-pointer shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-white text-[#111827]">
              {c === "all"
                ? "All Categories"
                : categoryLabels[c] || c.replace("_", " ")}
            </option>
          ))}
        </select>

        <button
          onClick={onCreate}
          className="bg-[#2563eb] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1d4ed8] transition-all duration-200 shadow-md whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered?.map((announcement, index) => {
          const isLoading = actionLoading[announcement._id];
          return (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Megaphone className="w-4 h-4 text-[#2563eb]" />
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        announcement.isPublished
                          ? "bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/30"
                          : "bg-gray-500/20 text-[#6b7280] border border-gray-500/30"
                      }`}
                    >
                      {announcement.isPublished ? (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getCategoryBadge(announcement.category)}`}
                    >
                      {categoryLabels[announcement.category] ||
                        announcement.category}
                    </span>
                    {announcement.isFeatured && (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        <Star className="w-3 h-3 inline mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#111827] text-base sm:text-lg mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] mt-1 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-[#6b7280] flex-wrap">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(
                        announcement.publishedDate || announcement.createdAt,
                      ).toLocaleDateString()}
                    </span>
                    {announcement.expiryDate && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span>
                          Expires:{" "}
                          {new Date(
                            announcement.expiryDate,
                          ).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 sm:ml-4">
                  <button
                    onClick={() => handleToggleFeatured(announcement)}
                    disabled={isLoading}
                    className={`p-1.5 rounded-lg transition ${
                      announcement.isFeatured
                        ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                        : "text-[#6b7280] hover:text-yellow-400 hover:bg-yellow-500/10"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={
                      announcement.isFeatured
                        ? "Remove from featured"
                        : "Mark as featured"
                    }
                  >
                    {isLoading === "featured" ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : announcement.isFeatured ? (
                      <Star className="w-4 h-4" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleTogglePublish(announcement)}
                    disabled={isLoading}
                    className={`p-1.5 rounded-lg transition ${
                      announcement.isPublished
                        ? "text-green-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                        : "text-[#6b7280] hover:text-green-400 hover:bg-green-500/10"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={announcement.isPublished ? "Unpublish" : "Publish"}
                  >
                    {isLoading === "publish" ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : announcement.isPublished ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onEdit(announcement)}
                    className="p-1.5 text-[#6b7280] hover:text-[#2563eb] hover:bg-[#EEF2FF] rounded-lg transition"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(announcement._id)}
                    className="p-1.5 text-[#6b7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB]"
          >
            <Megaphone className="w-16 h-16 text-[#9ca3af] mx-auto mb-4" />
            <p className="text-[#6b7280]">No announcements found</p>
            {(searchTerm || filterCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-2 text-[#2563eb] hover:text-[#1d4ed8] transition text-sm"
              >
                Clear all filters
              </button>
            )}
            <button
              onClick={onCreate}
              className="mt-4 text-[#2563eb] hover:text-[#1d4ed8] transition block mx-auto"
            >
              + Create your first announcement
            </button>
          </motion.div>
        )}
      </div>

      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-[#6b7280]">
          Showing {filtered.length} of {announcements?.length || 0}{" "}
          announcements
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;
