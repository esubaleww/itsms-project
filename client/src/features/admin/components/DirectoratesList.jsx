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
} from "lucide-react";

const DirectoratesList = ({ directorates, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = directorates?.filter(
    (dir) =>
      dir.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dir.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getTypeColor = (type) => {
    switch (type) {
      case "technical":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "administrative":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "innovation":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "research":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Directorates</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage regional directorates and their teams
          </p>
        </div>
        <button
          onClick={onCreate}
          className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Directorate
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search directorates by name or type..."
            className="w-full md:w-80 pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((dir, index) => (
          <motion.div
            key={dir._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-gray-600 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getTypeColor(dir.type)}`}
                  >
                    {dir.type || "General"}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">
                  {dir.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {dir.description || "No description provided"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{dir.teams?.length || 0} Teams</span>
                  </div>
                  {dir.head && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Head: {dir.head.fullName}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => onEdit(dir)}
                  className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(dir._id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
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
            className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 col-span-3"
          >
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No directorates found</p>
            <button
              onClick={onCreate}
              className="mt-4 text-emerald-400 hover:text-emerald-300 transition"
            >
              + Add your first directorate
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DirectoratesList;
