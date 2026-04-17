// client/src/features/admin/components/DirectorReportsList.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Award,
  FileText,
} from "lucide-react";

const DirectorReportsList = ({
  reports,
  onView,
  onApprove,
  onReject,
  loading,
}) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "reviewed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "submitted":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "reviewed":
        return "Reviewed";
      case "submitted":
        return "Pending";
      default:
        return status || "Submitted";
    }
  };

  const filtered = reports?.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (
      searchTerm &&
      !r.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.submittedBy?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading && !reports) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No reports found</p>
        <p className="text-sm text-gray-500 mt-1">
          Reports will appear here when directors submit them
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Director Reports</h2>
          <p className="text-sm text-gray-400 mt-1">
            Review and manage reports submitted by directors
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title or director..."
              className="pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all" className="bg-gray-800">
              All Status
            </option>
            <option value="submitted" className="bg-gray-800">
              Pending
            </option>
            <option value="reviewed" className="bg-gray-800">
              Reviewed
            </option>
            <option value="approved" className="bg-gray-800">
              Approved
            </option>
            <option value="rejected" className="bg-gray-800">
              Rejected
            </option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered?.map((report, index) => (
          <motion.div
            key={report._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-gray-600 transition-all duration-300 group cursor-pointer"
            onClick={() => onView(report)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                  >
                    {getStatusLabel(report.status)}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                  <User className="w-3 h-3" />
                  By: {report.submittedBy?.fullName || "Unknown"}
                  {report.submittedBy?.position && (
                    <span className="text-xs text-gray-500">
                      ({report.submittedBy.position})
                    </span>
                  )}
                </p>
                {report.period && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Period:{" "}
                    {new Date(
                      report.period.startDate,
                    ).toLocaleDateString()} -{" "}
                    {new Date(report.period.endDate).toLocaleDateString()}
                  </p>
                )}
                {report.metrics && (
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Applications: {report.metrics.applicationsProcessed || 0}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Approved: {report.metrics.approvedApplications || 0}
                    </span>
                    {report.metrics.activeInterns !== undefined && (
                      <span className="text-blue-400 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Active Interns: {report.metrics.activeInterns || 0}
                      </span>
                    )}
                  </div>
                )}
                {report.summary && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                    {report.summary}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {report.status === "submitted" && onApprove && onReject && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(report._id);
                      }}
                      className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(report._id);
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(report);
                  }}
                  className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 mt-4"
        >
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No reports match your filters</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
            }}
            className="mt-4 text-emerald-400 hover:text-emerald-300 transition"
          >
            Clear filters
          </button>
        </motion.div>
      )}

      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-gray-500">
          Showing {filtered.length} of {reports?.length || 0} reports
        </div>
      )}
    </div>
  );
};

export default DirectorReportsList;
