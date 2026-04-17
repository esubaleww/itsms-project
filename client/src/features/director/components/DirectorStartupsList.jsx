import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Rocket,
  Eye,
  Building2,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Briefcase,
} from "lucide-react";

const DirectorStartupsList = ({
  startups = [],
  onViewDetails,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const getStartupData = useCallback((item) => {
    if (!item) return null;

    return {
      id: item.startup?._id || item._id,
      companyName: item.companyName || item.startup?.companyName || "Unknown",
      email: item.startup?.email || item.email,
      phone: item.startup?.phone || item.phone,
      registrationNumber: item.registrationNumber,
      sector: item.sector,
      description: item.description,
      website: item.website,
      founders: item.founders || [],
      employeeCount: item.employeeCount || 1,
      status: item.status,
      documents: item.documents,
      incubation: item.incubation,
    };
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">
            Approved
          </span>
        );
      case "incubating":
        return (
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
            Incubating
          </span>
        );
      case "graduated":
        return (
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-500/30">
            Graduated
          </span>
        );
      default:
        return (
          <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-500/30">
            {status || "Pending"}
          </span>
        );
    }
  };

  const getSectorIcon = (sector) => {
    switch (sector) {
      case "software":
        return "💻";
      case "fintech":
        return "💰";
      case "healthtech":
        return "🏥";
      case "agritech":
        return "🌾";
      case "edtech":
        return "📚";
      default:
        return "🚀";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl border border-gray-700 p-4 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-64"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!startups || startups.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4 border border-gray-700">
          <Rocket className="w-10 h-10 text-gray-600" />
        </div>
        <p className="text-gray-400 text-lg">No startups found</p>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Startups will appear here after their applications are approved and
          assigned to your directorate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {startups.map((item, index) => {
        const startupData = getStartupData(item);
        if (!startupData) return null;

        const isExpanded = expandedId === startupData.id;

        return (
          <motion.div
            key={startupData.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
          >
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-700 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {startupData.companyName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white text-lg">
                          {startupData.companyName}
                        </p>
                        {getStatusBadge(startupData.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                        {startupData.sector && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {getSectorIcon(startupData.sector)}{" "}
                            {startupData.sector}
                          </span>
                        )}
                        {startupData.employeeCount && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {startupData.employeeCount} employees
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {startupData.description && (
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                      {startupData.description}
                    </p>
                  )}

                  {/* Stats Row */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{startupData.founders?.length || 1} founders</span>
                    </div>
                    {startupData.incubation?.stage && (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>{startupData.incubation.stage} stage</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:ml-4">
                  <button
                    onClick={() => onViewDetails?.(startupData.id)}
                    className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-700 transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : startupData.id)
                    }
                    className={`p-1.5 rounded-lg transition ${isExpanded ? "text-emerald-400 bg-emerald-500/20" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Section */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-700 overflow-hidden"
                >
                  <div className="p-5 bg-gray-800/50 space-y-5">
                    {/* Company Details */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Building2 className="w-3 h-3" />
                        Company Details
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {startupData.registrationNumber && (
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <span className="text-gray-400 text-xs">
                              Registration Number
                            </span>
                            <p className="text-white text-sm mt-1">
                              {startupData.registrationNumber}
                            </p>
                          </div>
                        )}
                        {startupData.website && (
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <span className="text-gray-400 text-xs">
                              Website
                            </span>
                            <a
                              href={startupData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 text-sm mt-1 block hover:underline"
                            >
                              {startupData.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Founders */}
                    {startupData.founders &&
                      startupData.founders.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            Founders ({startupData.founders.length})
                          </h4>
                          <div className="space-y-2">
                            {startupData.founders.map((founder, idx) => (
                              <div
                                key={idx}
                                className="bg-gray-700/30 rounded-lg p-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-white">
                                      {founder.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {founder.role}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {founder.email}
                                    </p>
                                  </div>
                                  {founder.share && (
                                    <span className="text-sm text-emerald-400">
                                      {founder.share}% equity
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Documents */}
                    {startupData.documents && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Documents
                        </h4>
                        <div className="space-y-2">
                          {startupData.documents.businessLicense && (
                            <a
                              href={startupData.documents.businessLicense}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
                            >
                              <FileText className="w-4 h-4 text-emerald-400" />
                              <span className="text-sm text-white">
                                Business License
                              </span>
                            </a>
                          )}
                          {startupData.documents.memorandum && (
                            <a
                              href={startupData.documents.memorandum}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
                            >
                              <FileText className="w-4 h-4 text-emerald-400" />
                              <span className="text-sm text-white">
                                Memorandum of Association
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DirectorStartupsList;
