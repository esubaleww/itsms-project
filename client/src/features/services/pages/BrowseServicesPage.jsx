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

  const hasAppliedForInternship = user?.internProfile && !currentProgram;
  const hasAppliedForInnovator = user?.innovatorProfile && !currentProgram;
  const hasAppliedForStartup = user?.startupProfile && !currentProgram;
  const hasAppliedForTraining = user?.trainingProfile && !currentProgram;

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
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between bg-[#FFFFFF] border-b border-[#E5E7EB] py-2 px-3 sm:px-5 lg:px-6 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-8">
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/"
              className="flex items-center gap-1 text-[#4b5563] hover:text-[#2563eb] transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-[#64748b]" />
            <span className="text-[#334155]">Service Catalog</span>
          </div>

          {user && (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-[#E5E7EB] text-[#334155] hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all duration-300 text-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          )}
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#2563eb] rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#111827] mb-3">
            Service Catalog
          </h1>
          <p className="text-[#374151] text-lg max-w-2xl mx-auto">
            Browse and request technology services from the bureau
          </p>
        </div>

        {!hasActiveProgram && availablePrograms.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#2563eb]" />
              <h2 className="text-lg font-semibold text-[#111827]">
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
                        <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">
                          {program.description}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-[#2563eb]">
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

        {hasActiveProgram && (
          <div className="mb-8">
            <div className="bg-[#EEF2FF] backdrop-blur-sm rounded-xl border border-[#2563eb]/30 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-xs text-[#2563eb] font-medium">
                    Your Active Program
                  </p>
                  <h3 className="text-[#111827] font-semibold text-sm mt-1 capitalize">
                    {currentProgram}
                  </h3>
                  <p className="text-xs text-[#6b7280] mt-1">
                    You can still request services below.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2.5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/25 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/25 border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:border-[#2563eb] appearance-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
            </div>

            <div className="flex bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/25 border border-[#E5E7EB] rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition ${
                  viewMode === "grid"
                    ? "bg-[#EEF2FF] text-[#2563eb]"
                    : "text-slate-500 hover:text-[#374151]"
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition ${
                  viewMode === "list"
                    ? "bg-[#EEF2FF] text-[#2563eb]"
                    : "text-slate-500 hover:text-[#374151]"
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-[#2563eb] animate-spin" />
          </div>
        )}

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
                      bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/50 backdrop-blur-sm rounded-xl border border-[#E5E7EB] 
                      hover:border-[#2563eb]/50
                      transition-all duration-300 group
                      ${viewMode === "list" ? "flex items-center p-4" : "p-5"}
                    `}
                  >
                    {viewMode === "grid" ? (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center group-hover:bg-[#DBEAFE] transition">
                              <IconComponent className="w-6 h-6 text-[#2563eb]" />
                            </div>
                            <div>
                              <h3 className="font-bold text-[#111827] text-lg">
                                {service.name}
                              </h3>
                              {service.popular && (
                                <span className="inline-flex items-center gap-1 text-xs text-[#2563eb]">
                                  <Sparkles className="w-3 h-3" /> Popular
                                </span>
                              )}
                            </div>
                          </div>
                          <Link
                            to={`/services/${service._id}`}
                            className="p-1 text-slate-500 hover:text-[#2563eb] transition"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                        </div>
                        <p className="text-sm text-[#6b7280] line-clamp-2 mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>{service.estimatedTime}</span>
                          </div>
                          <Link
                            to={`/services/${service._id}`}
                            className="text-sm text-[#2563eb] hover:text-[#1d4ed8] transition flex items-center gap-1"
                          >
                            View Details <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center group-hover:bg-[#DBEAFE] transition shrink-0">
                            <IconComponent className="w-6 h-6 text-[#2563eb]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-[#111827]">
                                {service.name}
                              </h3>
                              {service.popular && (
                                <span className="inline-flex items-center gap-1 text-xs text-[#2563eb]">
                                  <Sparkles className="w-3 h-3" /> Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#6b7280] line-clamp-1 mt-1">
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
                          className="ml-4 flex items-center gap-1 text-sm text-[#2563eb] hover:text-[#1d4ed8] transition"
                        >
                          View Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {services.length === 0 && (
              <div className="text-center py-20">
                <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-[#6b7280] text-lg">No services found</p>
                <p className="text-slate-500 text-sm mt-1">
                  Try adjusting your search or filter
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="mt-4 text-[#2563eb] hover:text-[#1d4ed8] transition"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg border transition ${
                !pagination.hasPrev
                  ? "border-[#E5E7EB] text-slate-600 cursor-not-allowed"
                  : "border-[#D1D5DB] text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]"
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
                          ? "bg-[#2563eb] text-white"
                          : "text-[#6b7280] hover:bg-[#F3F4F6]"
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
                  ? "border-[#E5E7EB] text-slate-600 cursor-not-allowed"
                  : "border-[#D1D5DB] text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              Next
            </button>
          </div>
        )}

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
