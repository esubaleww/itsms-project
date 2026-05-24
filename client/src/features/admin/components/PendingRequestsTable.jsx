import { motion } from "framer-motion";
import {
  Eye,
  Search,
  User,
  Calendar,
  FileText,
  Briefcase,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { useState } from "react";

const PendingRequestsTable = ({
  requests,
  onViewRequest,
  onApprove,
  onReject,
  loading,
}) => {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getTypeColor = (type) => {
    switch (type) {
      case "internship":
        return "bg-green-50 text-green-600 border border-green-500/30";
      case "innovation":
        return "bg-purple-50 text-purple-600 border border-purple-500/30";
      case "startup":
        return "bg-orange-50 text-orange-600 border border-orange-500/30";
      case "service":
        return "bg-blue-50 text-blue-600 border border-blue-500/30";
      default:
        return "bg-gray-100 text-text-muted border border-gray-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "internship":
        return <Briefcase className="w-4 h-4 text-green-600" />;
      case "innovation":
        return <Lightbulb className="w-4 h-4 text-purple-600" />;
      case "startup":
        return <Rocket className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "internship":
        return "Internship";
      case "innovation":
        return "Innovation";
      case "startup":
        return "Startup";
      default:
        return "Service Request";
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (
      searchTerm &&
      !r.applicant?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !r.metadata?.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !r.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading && !requests) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-heading font-medium text-text-primary">
            Pending Requests
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Review and approve applications ({filteredRequests.length} pending)
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all" className="bg-white text-text-primary">
              All Types
            </option>
            <option value="internship" className="bg-white text-text-primary">
              Internship
            </option>
            <option value="innovation" className="bg-white text-text-primary">
              Innovation
            </option>
            <option value="startup" className="bg-white text-text-primary">
              Startup
            </option>
            <option value="service" className="bg-white text-text-primary">
              Service
            </option>
          </select>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name or description..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
            onClick={() => onViewRequest(request)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(request.type)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}
                    >
                      {getTypeLabel(request.type)}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                  {request.metadata?.priority && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        request.metadata.priority === "urgent"
                          ? "bg-red-50 text-red-600 border border-red-500/30"
                          : request.metadata.priority === "high"
                            ? "bg-orange-50 text-orange-600 border border-orange-500/30"
                            : "bg-yellow-50 text-yellow-600 border border-yellow-500/30"
                      }`}
                    >
                      {request.metadata.priority.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <User className="w-4 h-4 text-accent" />
                  <p className="font-medium text-text-primary">
                    {request.applicant?.fullName}
                  </p>
                  <span className="text-xs text-text-muted">
                    ({request.applicant?.email})
                  </span>
                </div>

                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                  {request.metadata?.description ||
                    request.description ||
                    "No description provided"}
                </p>

                {request.relatedProfile?.ideaTitle && (
                  <div className="mt-2 flex items-center gap-2">
                    <Lightbulb className="w-3 h-3 text-purple-600" />
                    <p className="text-sm text-purple-600">
                      Idea: {request.relatedProfile.ideaTitle}
                    </p>
                  </div>
                )}

                {request.relatedProfile?.companyName && (
                  <div className="mt-2 flex items-center gap-2">
                    <Rocket className="w-3 h-3 text-orange-600" />
                    <p className="text-sm text-orange-600">
                      Company: {request.relatedProfile.companyName}
                    </p>
                  </div>
                )}

                {request.relatedProfile?.university?.name && (
                  <div className="mt-2 flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-green-600" />
                    <p className="text-sm text-green-600">
                      University: {request.relatedProfile.university.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewRequest(request);
                  }}
                  className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredRequests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200"
          >
            <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No pending requests found</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              className="mt-4 text-accent hover:text-blue-700 transition"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>

      {filteredRequests.length > 0 && (
        <div className="mt-4 text-right text-sm text-text-muted">
          Showing {filteredRequests.length} of {requests?.length || 0} pending
          requests
        </div>
      )}
    </div>
  );
};

export default PendingRequestsTable;
