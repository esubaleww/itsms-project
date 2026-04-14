import { useState } from "react";
import { useToast } from "../components/ui/Toast";
import { teamLeadApi } from "../services/teamLead.service";

export const useTeamLeadExport = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const exportData = async ({ format, type, dateRange }) => {
    setLoading(true);
    try {
      const blob = await teamLeadApi.exportData({ format, type, dateRange });

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
    } catch (error) {
      addToast(error.message || "Export failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    exportData,
  };
};
