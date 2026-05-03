import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Search,
  Users,
  User,
  X,
} from "lucide-react";

const DirectoratesList = ({ directorates, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = directorates?.filter(
    (dir) =>
      dir.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dir.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "technical":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "administrative":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "innovation":
        return "bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30";
      case "research":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      default:
        return "bg-gray-500/20 text-[#4b5563] border border-gray-500/30";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
            Directorates
          </h2>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-1">
            Manage regional directorates and their teams (
            {directorates?.length || 0} total)
          </p>
        </div>
      </div>

      {/* Search and Add Button - Inline */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search directorates by name or type..."
            className="w-full pl-9 pr-4 py-2 bg-white/60 border border-[#E5E7EB] rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#334155]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={onCreate}
          className="bg-[#2563eb] text-[#0f172a] px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 shadow-lg whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Directorates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((dir, index) => (
          <motion.div
            key={dir._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white/60 backdrop-blur-sm border border-[#E5E7EB] rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-[#E5E7EB] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Building2 className="w-5 h-5 text-[#2563eb]" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getTypeColor(dir.type)}`}
                  >
                    {dir.type || "General"}
                  </span>
                </div>
                <h3 className="font-semibold text-[#0f172a] text-base sm:text-lg mb-1">
                  {dir.name}
                </h3>
                <p className="text-sm text-[#4b5563] mt-1 line-clamp-2">
                  {dir.description || "No description provided"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-[#64748b] flex-wrap">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{dir.teams?.length || 0} Teams</span>
                  </div>
                  {dir.head && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">
                        Head: {dir.head.fullName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => onEdit(dir)}
                  className="p-1.5 text-[#64748b] hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(dir._id)}
                  className="p-1.5 text-[#64748b] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
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
            className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E5E7EB] col-span-3"
          >
            <Building2 className="w-16 h-16 text-[#64748b] mx-auto mb-4" />
            <p className="text-[#4b5563]">No directorates found</p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-2 text-[#2563eb] hover:text-[#1d4ed8] transition text-sm"
              >
                Clear search
              </button>
            )}
            <button
              onClick={onCreate}
              className="mt-4 text-[#2563eb] hover:text-[#1d4ed8] transition block mx-auto"
            >
              + Add your first directorate
            </button>
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-[#64748b]">
          Showing {filtered.length} of {directorates?.length || 0} directorates
        </div>
      )}
    </div>
  );
};

export default DirectoratesList;
