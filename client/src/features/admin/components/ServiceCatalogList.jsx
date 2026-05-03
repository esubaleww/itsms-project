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
        return "bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30";
      case "training":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      default:
        return "bg-gray-500/20 text-[#4b5563] border border-gray-500/30";
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
            Service Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-1">
            Manage technology services available for users to request (
            {services?.length || 0} total)
          </p>
        </div>
        <button
          onClick={onCreate}
          className="bg-[#2563eb] text-[#0f172a] px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 shadow-lg w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Search and Filter - Inline row like UsersList */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-50">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-9 pr-4 py-2 bg-white/60 border border-[#E5E7EB] rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#334155]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Dropdown - Same as UsersList */}
        <select
          className="px-4 py-2 bg-white/60 border border-[#E5E7EB] rounded-lg text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all cursor-pointer"
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
        >
          <option value="all" className="bg-white">
            All Categories
          </option>
          {categories
            .filter((cat) => cat.id !== "all")
            .map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-white">
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
              className="bg-white/60 backdrop-blur-sm rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:border-[#E5E7EB] transition-all duration-300 group"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-emerald-500/20 to-teal-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563eb]" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onView?.(service)}
                      className="p-1.5 text-[#64748b] hover:text-[#2563eb] hover:bg-[#2563eb]/10 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(service)}
                      className="p-1.5 text-[#64748b] hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(service._id)}
                      className="p-1.5 text-[#64748b] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="font-semibold text-[#0f172a] text-base sm:text-lg mb-1 line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4b5563] line-clamp-2">
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
                    <span className="text-xs bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-[#4b5563] pt-3 border-t border-[#E5E7EB]">
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
          className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E5E7EB]"
        >
          <Briefcase className="w-16 h-16 text-[#64748b] mx-auto mb-4" />
          <p className="text-[#4b5563]">No services found</p>
          {(searchTerm || selectedCategory !== "all") && (
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
            + Add your first service
          </button>
        </motion.div>
      )}

      {/* Results Count */}
      {services.length > 0 && (
        <div className="mt-4 text-right text-sm text-[#64748b]">
          Showing {services.length} of {services.length} services
        </div>
      )}
    </div>
  );
};

export default ServiceCatalogList;
