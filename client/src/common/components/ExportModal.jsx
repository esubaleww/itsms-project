import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  X,
  FileSpreadsheet,
  FileText,
  Calendar,
  Briefcase,
  Users,
  GraduationCap,
  Lightbulb,
  Rocket,
  FileIcon,
  Award,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
} from "lucide-react";

const EXPORT_TYPES = {
  admin: [
    { id: "requests", label: "Service Requests", icon: Briefcase },
    { id: "applications", label: "Applications", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "reports", label: "Director Reports", icon: Award },
    { id: "staff", label: "Staff Activity", icon: Activity },
  ],
  director: {
    service: [
      { id: "service-requests", label: "Service Requests", icon: Briefcase },
      { id: "teams", label: "Teams", icon: Users },
      { id: "team-reports", label: "Team Reports", icon: FileIcon },
      { id: "my-reports", label: "My Reports", icon: Award },
    ],
    internship: [
      { id: "program-applications", label: "Applications", icon: FileIcon },
      { id: "interns", label: "Interns", icon: GraduationCap },
      { id: "participant-reports", label: "Advisor Reports", icon: FileIcon },
      { id: "my-reports", label: "My Reports", icon: Award },
    ],
    innovation: [
      { id: "program-applications", label: "Applications", icon: FileIcon },
      { id: "innovators", label: "Innovators", icon: Lightbulb },
      { id: "participant-reports", label: "Mentor Reports", icon: FileIcon },
      { id: "my-reports", label: "My Reports", icon: Award },
    ],
    startup: [
      { id: "program-applications", label: "Applications", icon: FileIcon },
      { id: "startups", label: "Startups", icon: Rocket },
      { id: "participant-reports", label: "Mentor Reports", icon: FileIcon },
      { id: "my-reports", label: "My Reports", icon: Award },
    ],
    training: [
      { id: "program-applications", label: "Applications", icon: FileIcon },
      { id: "trainees", label: "Trainees", icon: GraduationCap },
      { id: "participant-reports", label: "Trainer Reports", icon: FileIcon },
      { id: "my-reports", label: "My Reports", icon: Award },
    ],
  },
  teamlead: [
    { id: "tasks", label: "All Tasks", icon: Briefcase },
    { id: "completed-tasks", label: "Completed Tasks", icon: CheckCircle },
    { id: "pending-tasks", label: "Pending Tasks", icon: Clock },
    { id: "team-members", label: "Team Members", icon: Users },
    { id: "team-reports", label: "Team Reports", icon: FileIcon },
    { id: "my-reports", label: "My Reports", icon: FileIcon },
  ],
};

const ExportModal = ({
  isOpen,
  onClose,
  onExport,
  role = "admin",
  directorateType = null,
}) => {
  const [format, setFormat] = useState("csv");
  const [type, setType] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isExporting, setIsExporting] = useState(false);

  const getExportTypes = () => {
    if (role === "admin") {
      return EXPORT_TYPES.admin;
    }
    if (role === "director" && directorateType) {
      return (
        EXPORT_TYPES.director[directorateType] || EXPORT_TYPES.director.service
      );
    }
    if (role === "teamlead") {
      return EXPORT_TYPES.teamlead;
    }
    return [];
  };

  const exportTypes = getExportTypes();

  useEffect(() => {
    if (isOpen && exportTypes.length > 0 && !type) {
      setType(exportTypes[0].id);
    }
  }, [isOpen, exportTypes, type]);

  const handleExport = async () => {
    if (!type) return;

    setIsExporting(true);
    try {
      const result = await onExport({ format, type, dateRange });

      if (result instanceof Blob) {
        const url = window.URL.createObjectURL(result);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${type}_export_${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      onClose();
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-heading font-medium text-text-primary">
              Export Data
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)] space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Data Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {exportTypes.map((et) => (
                <button
                  key={et.id}
                  onClick={() => setType(et.id)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    type === et.id
                      ? "bg-blue-50 border-accent/50 text-accent"
                      : "bg-gray-50 border border-gray-200 text-text-muted hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <et.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{et.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Format
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat("csv")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  format === "csv"
                    ? "bg-blue-50 border-accent/50 text-accent"
                    : "bg-gray-50 border border-gray-200 text-text-muted hover:border-gray-400"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => setFormat("pdf")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  format === "pdf"
                    ? "bg-blue-50 border-accent/50 text-accent"
                    : "bg-gray-50 border border-gray-200 text-text-muted hover:border-gray-400"
                }`}
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
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
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting || !type}
            className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
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

export default ExportModal;
