import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  X,
  FileSpreadsheet,
  FileText,
  Calendar,
  Briefcase,
  Users,
  FileIcon,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useTeamLeadExport } from "../../../hooks/useTeamLeadExport";

const TeamLeadExportModal = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState("csv");
  const [type, setType] = useState("tasks");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { exportData, loading } = useTeamLeadExport();

  const exportTypes = [
    {
      id: "tasks",
      label: "All Tasks",
      icon: Briefcase,
      description: "All tasks assigned to your team",
    },
    {
      id: "completed-tasks",
      label: "Completed Tasks",
      icon: CheckCircle,
      description: "Successfully completed tasks",
    },
    {
      id: "pending-tasks",
      label: "Pending Tasks",
      icon: Clock,
      description: "Tasks in progress or pending",
    },
    {
      id: "team-members",
      label: "Team Members",
      icon: Users,
      description: "Your team members list",
    },
    {
      id: "team-reports",
      label: "Team Reports",
      icon: FileIcon,
      description: "Reports from team members",
    },
    {
      id: "my-reports",
      label: "My Reports",
      icon: FileIcon,
      description: "Your submitted reports",
    },
  ];

  const handleExport = async () => {
    await exportData({ format, type, dateRange });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Export Team Data</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)] space-y-5">
          {/* Export Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Data Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {exportTypes.map((et) => (
                <button
                  key={et.id}
                  onClick={() => setType(et.id)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    type === et.id
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                      : "bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <et.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{et.label}</span>
                  </div>
                  <p className="text-xs opacity-70">{et.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Format
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat("csv")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  format === "csv"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => setFormat("pdf")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  format === "pdf"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500"
                }`}
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date Range (Optional)</span>
              </div>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full bg-linear-to-r from-emerald-500 to-teal-700 text-white py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Data
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamLeadExportModal;
