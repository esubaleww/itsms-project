// client/src/features/dashboard/components/MyReportsList.jsx
import { motion } from "framer-motion";
import { Eye, Calendar, FileText, CheckCircle, XCircle } from "lucide-react";

const MyReportsList = ({ reports, onViewDetails }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No reports found</p>
        <p className="text-sm text-gray-500 mt-1">
          Your submitted reports will appear here
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "reviewed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
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
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all cursor-pointer"
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
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-white">{report.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {report.summary}
                </p>
                {report.feedback && (
                  <div className="mt-2 p-2 bg-gray-700/30 rounded-lg">
                    <p className="text-xs text-gray-500">Feedback:</p>
                    <p className="text-sm text-gray-300">{report.feedback}</p>
                  </div>
                )}
              </div>
              <button className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MyReportsList;
