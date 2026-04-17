import { useState } from "react";
import { useToast } from "../components/ui/Toast";
import { directorService } from "../services/director.service";

export const useDirectorExport = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportData = async ({ format, type, dateRange, directorId }) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await directorService.exportData({
        format,
        type,
        dateRange,
        directorId,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `${type}_export_${timestamp}.${format}`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast(`${type.replace("-", " ")} exported successfully!`, "success");
      return { success: true };
    } catch (err) {
      console.error("Export error:", err);
      setError(err.message);
      addToast(err.message || "Export failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    exportData,
  };
};
