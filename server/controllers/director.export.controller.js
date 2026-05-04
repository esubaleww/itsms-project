import directorExportService from "../services/director.export.service.js";

export const exportData = async (req, res) => {
  try {
    const { format, type, dateRange } = req.body;
    const directorId = req.user.id;

    const validFormats = ["csv", "pdf", "json"];
    if (!validFormats.includes(format)) {
      return res.status(400).json({
        success: false,
        message: `Invalid format. Must be one of: ${validFormats.join(", ")}`,
      });
    }

    const directorInfo =
      await directorExportService.getDirectorateInfo(directorId);
    const availableTypes = directorExportService.getAvailableExportTypes(
      directorInfo.directorateType,
    );
    const availableTypeValues = availableTypes.map((t) => t.value);

    if (!availableTypeValues.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid export type for ${directorInfo.directorateType} directorate. Available types: ${availableTypeValues.join(", ")}`,
      });
    }

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
