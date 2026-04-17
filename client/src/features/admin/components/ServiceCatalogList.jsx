import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Wifi,
  Database,
  Server,
  Globe,
  Code,
  Cloud,
  Shield,
  Lock,
  Briefcase,
  Search,
  X,
} from "lucide-react";

const iconMap = {
  Wifi: Wifi,
  Database: Database,
  Server: Server,
  Globe: Globe,
  Code: Code,
  Cloud: Cloud,
  Shield: Shield,
  Lock: Lock,
  Briefcase: Briefcase,
};

const ServiceCatalogList = ({
  services,
  categories,
  loading,
  onEdit,
  onDelete,
  onCreate,
  onView,
  onFilter,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    onFilter?.(category);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    onSearch?.("");
    onFilter?.("all");
  };

  const getIconComponent = (iconName) => {
    const Icon = iconMap[iconName] || Briefcase;
    return Icon;
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case "infrastructure":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "development":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "security":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "consulting":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "training":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  if (loading && !services.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Service Catalog
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage technology services available for users to request (
            {services?.length || 0} total)
          </p>
        </div>
        <button
          onClick={onCreate}
          className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 shadow-lg w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Search and Filter - Inline row like UsersList */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-50">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Dropdown - Same as UsersList */}
        <select
          className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
        >
          <option value="all" className="bg-gray-800">
            All Categories
          </option>
          {categories
            .filter((cat) => cat.id !== "all")
            .map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-gray-800">
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* Services Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => {
          const IconComponent = getIconComponent(service.icon);
          return (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:shadow-lg hover:border-gray-600 transition-all duration-300 group"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-emerald-500/20 to-teal-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onView?.(service)}
                      className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(service)}
                      className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(service._id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="font-semibold text-white text-base sm:text-lg mb-1 line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(
                      service.category,
                    )}`}
                  >
                    {service.category}
                  </span>
                  {service.popular && (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 pt-3 border-t border-gray-700">
                  <span>⏱️ {service.estimatedTime}</span>
                  <span>💰 {service.price || "Free"}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700"
        >
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No services found</p>
          {(searchTerm || selectedCategory !== "all") && (
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
            + Add your first service
          </button>
        </motion.div>
      )}

      {/* Results Count */}
      {services.length > 0 && (
        <div className="mt-4 text-right text-sm text-gray-500">
          Showing {services.length} of {services.length} services
        </div>
      )}
    </div>
  );
};

export default ServiceCatalogList;
