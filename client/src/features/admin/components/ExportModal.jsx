// client/src/features/admin/components/ExportModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  X,
  FileSpreadsheet,
  FileText,
  Calendar,
  Briefcase,
  TrendingUp,
  Users,
  Award,
  Activity,
} from "lucide-react";

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState("csv");
  const [type, setType] = useState("requests");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    { id: "requests", label: "Service Requests", icon: Briefcase },
    { id: "applications", label: "Applications", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "reports", label: "Director Reports", icon: Award },
    { id: "staff", label: "Staff Activity", icon: Activity },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await onExport({ format, type, dateRange });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}_export_${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden border border-gray-700"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Export Data</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {reportTypes.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => setType(rt.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      type === rt.id
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    <rt.icon className="w-4 h-4" />
                    <span className="text-sm">{rt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Format
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormat("csv")}
                  className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${
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
                  className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date Range (Optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="End Date"
                />
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExportModal;
