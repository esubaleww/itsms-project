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
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-[#E5E7EB]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#2563eb]" />
              <h2 className="text-xl font-bold text-[#0f172a]">Export Data</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white rounded-lg transition"
            >
              <X className="w-5 h-5 text-[#4b5563]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                Data Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {reportTypes.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => setType(rt.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      type === rt.id
                        ? "bg-[#2563eb]/10 border-[#2563eb]/30 text-[#2563eb]"
                        : "bg-white/30 border-[#E5E7EB] text-[#4b5563] hover:border-gray-500"
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
              <label className="block text-sm font-medium text-[#334155] mb-2">
                Format
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormat("csv")}
                  className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${
                    format === "csv"
                      ? "bg-[#2563eb]/10 border-[#2563eb]/30 text-[#2563eb]"
                      : "bg-white/30 border-[#E5E7EB] text-[#4b5563] hover:border-gray-500"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => setFormat("pdf")}
                  className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${
                    format === "pdf"
                      ? "bg-[#2563eb]/10 border-[#2563eb]/30 text-[#2563eb]"
                      : "bg-white/30 border-[#E5E7EB] text-[#4b5563] hover:border-gray-500"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                Date Range (Optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-[#0f172a] text-sm focus:outline-none focus:border-[#2563eb]"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="px-3 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-[#0f172a] text-sm focus:outline-none focus:border-[#2563eb]"
                  placeholder="End Date"
                />
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-[#2563eb] text-[#0f172a] py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
