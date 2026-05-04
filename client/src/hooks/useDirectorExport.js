import { useState } from "react";
import { useToast } from "../common/ui/Toast";
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

      let filename = `${type}_export_${new Date().toISOString().split("T")[0]}.${format}`;

      const contentDisposition = blob.headers?.get?.("content-disposition");
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const typeLabels = {
        "service-requests": "Service Requests",
        "program-applications": "Program Applications",
        interns: "Interns",
        innovators: "Innovators",
        startups: "Startups",
        trainees: "Trainees",
        teams: "Teams",
        "team-reports": "Team Reports",
        "participant-reports": "Participant Reports",
        "my-reports": "My Reports",
      };

      const displayType = typeLabels[type] || type.replace("-", " ");
      addToast(`${displayType} exported successfully!`, "success");
      return { success: true };
    } catch (err) {
      console.error("Export error:", err);
      let errorMessage = "Export failed. Please try again.";

      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const errorJson = JSON.parse(text);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {}
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      addToast(errorMessage, "error");
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
