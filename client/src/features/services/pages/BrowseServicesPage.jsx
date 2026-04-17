import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useServiceCatalog } from "../../../hooks/useServiceCatalog";
import { useAuth } from "../../../hooks/useAuth";
import { motion } from "framer-motion";
import {
  Search,
  Briefcase,
  Clock,
  Sparkles,
  ChevronRight,
  Loader2,
  Grid3x3,
  List,
  Filter,
  Users,
  Lightbulb,
  Rocket,
  GraduationCap,
  TrendingUp,
  Eye,
  ArrowRight,
  CheckCircle,
  Wifi,
  Database,
  Server,
  Globe,
  Code,
  Cloud,
  Shield,
  Lock,
  Home,
  LayoutDashboard,
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

const BrowseServicesPage = () => {
  const { user } = useAuth();
  const { services, categories, pagination, loading, fetchServices } =
    useServiceCatalog();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchServices({ search, category, page, limit: 10 });
  }, [search, category, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  // Check what program the user is currently enrolled in
  const currentProgram =
    user?.position === "intern"
      ? "internship"
      : user?.position === "innovator"
        ? "innovation"
        : user?.position === "startup"
          ? "startup"
          : user?.position === "trainee"
            ? "training"
            : null;

  // Check if user has already applied
  const hasAppliedForInternship = user?.internProfile && !currentProgram;
  const hasAppliedForInnovator = user?.innovatorProfile && !currentProgram;
  const hasAppliedForStartup = user?.startupProfile && !currentProgram;
  const hasAppliedForTraining = user?.trainingProfile && !currentProgram;

  // Available programs (mutually exclusive)
  const getAvailablePrograms = () => {
    if (currentProgram) return [];

    const programs = [];

    if (!hasAppliedForInternship && !user?.internProfile) {
      programs.push({
        id: "internship",
        title: "Internship Program",
        description: "Gain hands-on experience and develop professional skills",
        icon: Users,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400",
        borderColor: "border-blue-500/30",
        route: "/applications/apply/internship",
      });
    }
    if (!hasAppliedForInnovator && !user?.innovatorProfile) {
      programs.push({
        id: "innovation",
        title: "Innovation Program",
        description: "Transform your ideas into reality with mentorship",
        icon: Lightbulb,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
        textColor: "text-purple-400",
        borderColor: "border-purple-500/30",
        route: "/applications/apply/innovation",
      });
    }
    if (!hasAppliedForStartup && !user?.startupProfile) {
      programs.push({
        id: "startup",
        title: "Startup Program",
        description: "Get incubation support for your startup",
        icon: Rocket,
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-500/10",
        textColor: "text-orange-400",
        borderColor: "border-orange-500/30",
        route: "/applications/apply/startup",
      });
    }
    if (!hasAppliedForTraining && !user?.trainingProfile) {
      programs.push({
        id: "training",
        title: "Digital Literacy Training",
        description: "Hands-on practical training in technology labs",
        icon: GraduationCap,
        color: "from-teal-500 to-emerald-500",
        bgColor: "bg-teal-500/10",
        textColor: "text-teal-400",
        borderColor: "border-teal-500/30",
        route: "/applications/apply/training",
      });
    }

    return programs;
  };

  const availablePrograms = getAvailablePrograms();
  const hasActiveProgram = !!currentProgram;

  const getIconComponent = (iconName) => {
    const Icon = iconMap[iconName] || Briefcase;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb - Back to Home / Dashboard */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-slate-300">Service Catalog</span>
          </div>

          {user && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-300 text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-linear-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Service Catalog
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Browse and request technology services from the bureau
          </p>
        </div>

        {/* Available Programs Section - At the top */}
        {!hasActiveProgram && availablePrograms.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">
                Available Programs
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availablePrograms.map((program) => {
                const ProgramIcon = program.icon;
                return (
                  <Link
                    key={program.id}
                    to={program.route}
                    className={`p-4 rounded-xl border ${program.borderColor} ${program.bgColor} hover:shadow-lg transition-all duration-300 group block`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-linear-to-r ${program.color} flex items-center justify-center shrink-0`}
                      >
                        <ProgramIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${program.textColor}`}>
                          {program.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {program.description}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                          Apply Now <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Program Badge */}
        {hasActiveProgram && (
          <div className="mb-8">
            <div className="bg-emerald-500/10 backdrop-blur-sm rounded-xl border border-emerald-500/30 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-emerald-400 font-medium">
                    Your Active Program
                  </p>
                  <h3 className="text-white font-semibold text-sm mt-1 capitalize">
                    {currentProgram}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    You can still request services below.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition ${
                  viewMode === "grid"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition ${
                  viewMode === "list"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        )}

        {/* Services Grid/List */}
        {!loading && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  : "space-y-3"
              }
            >
              {services.map((service, index) => {
                const IconComponent = getIconComponent(service.icon);
                return (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 
                      hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 
                      transition-all duration-300 group
                      ${viewMode === "list" ? "flex items-center p-4" : "p-5"}
                    `}
                  >
                    {viewMode === "grid" ? (
                      // Grid View
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition">
                              <IconComponent className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">
                                {service.name}
                              </h3>
                              {service.popular && (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                                  <Sparkles className="w-3 h-3" /> Popular
                                </span>
                              )}
                            </div>
                          </div>
                          <Link
                            to={`/services/${service._id}`}
                            className="p-1 text-slate-500 hover:text-emerald-400 transition"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>{service.estimatedTime}</span>
                          </div>
                          <Link
                            to={`/services/${service._id}`}
                            className="text-sm text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                          >
                            View Details <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </>
                    ) : (
                      // List View
                      <>
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition shrink-0">
                            <IconComponent className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-white">
                                {service.name}
                              </h3>
                              {service.popular && (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                                  <Sparkles className="w-3 h-3" /> Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-1 mt-1">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {service.estimatedTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/services/${service._id}`}
                          className="ml-4 flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition"
                        >
                          View Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {services.length === 0 && (
              <div className="text-center py-20">
                <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No services found</p>
                <p className="text-slate-500 text-sm mt-1">
                  Try adjusting your search or filter
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="mt-4 text-emerald-400 hover:text-emerald-300 transition"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg border transition ${
                !pagination.hasPrev
                  ? "border-slate-700 text-slate-600 cursor-not-allowed"
                  : "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg transition ${
                        pagination.page === pageNum
                          ? "bg-emerald-600 text-white"
                          : "text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                },
              )}
            </div>
            <button
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg border transition ${
                !pagination.hasNext
                  ? "border-slate-700 text-slate-600 cursor-not-allowed"
                  : "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Results Count */}
        {pagination && (
          <div className="text-center text-sm text-slate-500 mt-4">
            Showing {services.length} of {pagination.total} services
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseServicesPage;
