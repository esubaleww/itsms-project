import teamLeadExportService from "../services/teamLead.export.service.js";

export const exportData = async (req, res) => {
  try {
    const { format, type, dateRange } = req.body;
    const teamLeadId = req.user.id;

    const result = await teamLeadExportService.exportData({
      format,
      type,
      dateRange,
      teamLeadId,
    });

    res.setHeader("Content-Type", result.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`,
    );
    res.send(result.data);
  } catch (error) {
    console.error("Team lead export error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
