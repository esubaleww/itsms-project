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
        return "bg-blue-50 text-blue-600 border border-blue-500/30";
      case "administrative":
        return "bg-purple-50 text-purple-600 border border-purple-500/30";
      case "innovation":
        return "bg-blue-50 text-accent border border-accent/30";
      case "research":
        return "bg-orange-50 text-orange-600 border border-orange-500/30";
      default:
        return "bg-gray-100 text-text-muted border border-gray-300";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-medium text-text-primary">
            Directorates
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage regional directorates and their teams (
            {directorates?.length || 0} total)
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search directorates by name or type..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onCreate}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-accent/90 transition-all duration-200 shadow-md whitespace-nowrap font-medium"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((dir, index) => (
          <motion.div
            key={dir._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Building2 className="w-5 h-5 text-accent" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(dir.type)}`}
                  >
                    {dir.type || "General"}
                  </span>
                </div>
                <h3 className="font-heading font-medium text-text-primary text-base sm:text-lg mb-1">
                  {dir.name}
                </h3>
                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                  {dir.description || "No description provided"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-text-muted flex-wrap">
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
                  className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(dir._id)}
                  className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200 col-span-3"
          >
            <Building2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No directorates found</p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-2 text-accent hover:text-blue-700 transition text-sm"
              >
                Clear search
              </button>
            )}
            <button
              onClick={onCreate}
              className="mt-4 text-accent hover:text-blue-700 transition block mx-auto"
            >
              + Add your first directorate
            </button>
          </motion.div>
        )}
      </div>

      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-text-muted">
          Showing {filtered.length} of {directorates?.length || 0} directorates
        </div>
      )}
    </div>
  );
};

export default DirectoratesList;
