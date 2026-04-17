import * as reportService from "../services/report.service.js";

export const getDirectorReports = async (req, res) => {
  try {
    const filters = {
      type: "director_report",
    };

    if (req.query.status) filters.status = req.query.status;
    if (req.query.directorateId) filters.directorate = req.query.directorateId;

    const result = await reportService.getReports(filters, req.query);

    res.status(200).json({
      success: true,
      reports: result.reports,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDirectorReportById = async (req, res) => {
  try {
    const result = await reportService.getReportById(req.params.id);

    res.status(200).json({
      success: true,
      data: result.report,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewDirectorReport = async (req, res) => {
  try {
    const result = await reportService.reviewDirectorReport(
      req.params.id,
      req.user,
      req.body.feedback,
      req,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveDirectorReport = async (req, res) => {
  try {
    const result = await reportService.approveDirectorReport(
      req.params.id,
      req.user,
      req.body.comments,
      req,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔹 Reject
export const rejectDirectorReport = async (req, res) => {
  try {
    const result = await reportService.rejectDirectorReport(
      req.params.id,
      req.user,
      req.body.reason,
      req,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
