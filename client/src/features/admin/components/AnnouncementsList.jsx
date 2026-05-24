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
        return "bg-blue-50 text-blue-600 border border-blue-500/30";
      case "news":
        return "bg-blue-50 text-accent border border-accent/30";
      case "event":
        return "bg-purple-50 text-purple-600 border border-purple-500/30";
      case "success_story":
        return "bg-green-50 text-green-600 border border-green-500/30";
      case "opportunity":
        return "bg-orange-50 text-orange-600 border border-orange-500/30";
      case "update":
        return "bg-cyan-50 text-cyan-600 border border-cyan-500/30";
      default:
        return "bg-gray-50 text-text-muted border border-gray-500/30";
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
          <h2 className="text-xl sm:text-2xl font-heading font-medium text-text-primary">
            Announcements
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage public announcements and updates (
            {announcements?.length || 0} total)
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-white text-text-primary">
              {c === "all"
                ? "All Categories"
                : categoryLabels[c] || c.replace("_", " ")}
            </option>
          ))}
        </select>

        <button
          onClick={onCreate}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-accent/90 transition-all duration-200 shadow-md whitespace-nowrap"
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
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Megaphone className="w-4 h-4 text-accent" />
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        announcement.isPublished
                          ? "bg-blue-50 text-accent border border-accent/30"
                          : "bg-gray-100 text-text-muted border border-gray-300"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {announcement.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Draft
                          </>
                        )}
                      </span>
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getCategoryBadge(announcement.category)}`}
                    >
                      {categoryLabels[announcement.category] ||
                        announcement.category}
                    </span>
                    {announcement.isFeatured && (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-600 border border-yellow-500/30">
                        <Star className="w-3 h-3 inline mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-medium text-text-primary text-base sm:text-lg mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-text-muted flex-wrap">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(
                        announcement.publishedDate || announcement.createdAt,
                      ).toLocaleDateString()}
                    </span>
                    {announcement.expiryDate && (
                      <>
                        <span className="text-text-muted">•</span>
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
                        ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                        : "text-text-muted hover:text-yellow-500 hover:bg-yellow-50"
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
                        ? "text-green-600 hover:text-yellow-500 hover:bg-yellow-50"
                        : "text-text-muted hover:text-green-600 hover:bg-green-50"
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
                    className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(announcement._id)}
                    className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
            className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200"
          >
            <Megaphone className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No announcements found</p>
            {(searchTerm || filterCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-2 text-accent hover:text-blue-700 transition text-sm"
              >
                Clear all filters
              </button>
            )}
            <button
              onClick={onCreate}
              className="mt-4 text-accent hover:text-blue-700 transition block mx-auto"
            >
              + Create your first announcement
            </button>
          </motion.div>
        )}
      </div>

      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-text-muted">
          Showing {filtered.length} of {announcements?.length || 0}{" "}
          announcements
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;
