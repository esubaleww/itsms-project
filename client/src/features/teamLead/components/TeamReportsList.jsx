import { motion } from "framer-motion";
import {
  Eye,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

const TeamReportsList = ({ reports, onViewDetails }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200">
        <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <p className="text-text-secondary">No team reports found</p>
        <p className="text-sm text-text-muted mt-1">
          Reports from team members will appear here
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-blue-50 text-accent border border-accent/30";
      case "rejected":
        return "bg-red-50 text-red-600 border border-red-500/30";
      case "reviewed":
        return "bg-blue-50 text-blue-600 border border-blue-500/30";
      default:
        return "bg-yellow-50 text-yellow-600 border border-yellow-500/30";
    }
  };

  return (
    <div className="space-y-3">
      {reports.map((report, idx) => (
        <motion.div
          key={report._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          onClick={() => onViewDetails(report)}
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                  >
                    {report.status || "pending"}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-heading font-medium text-text-primary">
                  {report.title}
                </h3>
                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                  {report.summary}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {report.submittedBy?.fullName}
                  </span>
                  {report.period && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{" "}
                      {new Date(report.period.startDate).toLocaleDateString()} -{" "}
                      {new Date(report.period.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onViewDetails(report)}
                className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamReportsList;
