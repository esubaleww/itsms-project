import directorExportService from "../services/directorExport.service.js";

export const exportData = async (req, res) => {
  try {
    const { format, type, dateRange } = req.body;
    const directorId = req.user.id;
    console.log(directorId);

    const result = await directorExportService.exportData({
      format,
      type,
      dateRange,
      directorId,
    });

    res.setHeader("Content-Type", result.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`,
    );
    res.send(result.data);
  } catch (error) {
    console.error("Director export error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
