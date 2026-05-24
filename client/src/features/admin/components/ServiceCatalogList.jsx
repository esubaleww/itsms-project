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
        return "bg-blue-50 text-blue-600 border border-blue-500/30";
      case "development":
        return "bg-purple-50 text-purple-600 border border-purple-500/30";
      case "security":
        return "bg-red-50 text-red-600 border border-red-500/30";
      case "consulting":
        return "bg-blue-50 text-accent border border-accent/30";
      case "training":
        return "bg-orange-50 text-orange-600 border border-orange-500/30";
      default:
        return "bg-gray-100 text-text-muted border border-gray-300";
    }
  };

  if (loading && !services.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-medium text-text-primary">
            Service Catalog
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage technology services available for users to request (
            {services?.length || 0} total)
          </p>
        </div>
        <button
          onClick={onCreate}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-accent/90 transition-all duration-200 shadow-md w-full sm:w-auto font-medium"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-50">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer shadow-sm"
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
        >
          <option value="all" className="bg-white text-text-primary">
            All Categories
          </option>
          {categories
            .filter((cat) => cat.id !== "all")
            .map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
                className="bg-white text-text-primary"
              >
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => {
          const IconComponent = getIconComponent(service.icon);
          return (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 border border-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onView?.(service)}
                      className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(service)}
                      className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(service._id)}
                      className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="font-heading font-medium text-text-primary text-base sm:text-lg mb-1 line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted line-clamp-2">
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
                    <span className="text-xs bg-blue-50 text-accent border border-accent/30 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-text-muted pt-3 border-t border-gray-200">
                  <span>⏱️ {service.estimatedTime}</span>
                  <span>💰 {service.price ? `$${service.price}` : "Free"}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {services.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200"
        >
          <Briefcase className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No services found</p>
          {(searchTerm || selectedCategory !== "all") && (
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
            + Add your first service
          </button>
        </motion.div>
      )}

      {services.length > 0 && (
        <div className="mt-4 text-right text-sm text-text-muted">
          Showing {services.length} of {services.length} services
        </div>
      )}
    </div>
  );
};

export default ServiceCatalogList;
