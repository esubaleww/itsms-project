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
} from "lucide-react";

const AnnouncementsList = ({ announcements, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "event":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "success_story":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "opportunity":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "update":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Announcements
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage public announcements and updates (
            {announcements?.length || 0} total)
          </p>
        </div>
      </div>

      {/* Search and Filter - Inline with Add button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Dropdown */}
        <select
          className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-gray-800">
              {c === "all"
                ? "All Categories"
                : categoryLabels[c] || c.replace("_", " ")}
            </option>
          ))}
        </select>

        {/* Add Button - Inline with search */}
        <button
          onClick={onCreate}
          className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 shadow-lg whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered?.map((announcement, index) => (
          <motion.div
            key={announcement._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-gray-600 transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Megaphone className="w-4 h-4 text-emerald-400" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      announcement.isPublished
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
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
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white text-base sm:text-lg mb-2">
                  {announcement.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {announcement.content}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 flex-wrap">
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
                        {new Date(announcement.expiryDate).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-1 sm:ml-4">
                <button
                  onClick={() => onEdit(announcement)}
                  className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(announcement._id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {filtered?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700"
          >
            <Megaphone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No announcements found</p>
            {(searchTerm || filterCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-2 text-emerald-400 hover:text-emerald-300 transition text-sm"
              >
                Clear all filters
              </button>
            )}
            <button
              onClick={onCreate}
              className="mt-4 text-emerald-400 hover:text-emerald-300 transition block mx-auto"
            >
              + Create your first announcement
            </button>
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-gray-500">
          Showing {filtered.length} of {announcements?.length || 0}{" "}
          announcements
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;
