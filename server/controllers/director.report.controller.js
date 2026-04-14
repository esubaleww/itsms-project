import * as reportService from "../services/report.service.js";

export const getTeamReports = async (req, res) => {
  try {
    const filters = {
      type: "team_report",
      directorate: req.user.directorate,
    };

    if (req.query.status) filters.status = req.query.status;
    if (req.query.teamId) filters.team = req.query.teamId;

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

export const getReportById = async (req, res) => {
  try {
    const result = await reportService.getReportById(req.params.reportId);

    res.status(200).json({
      success: true,
      report: result.report,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewTeamReport = async (req, res) => {
  try {
    const result = await reportService.reviewTeamReport(
      req.params.reportId,
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

export const createDirectorReport = async (req, res) => {
  try {
    const result = await reportService.createDirectorReport(req.user, req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyDirectorReports = async (req, res) => {
  try {
    const result = await reportService.getReports({
      type: "director_report",
      submittedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      reports: result.reports,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const approveTeamReport = async (req, res) => {
  try {
    const { comments } = req.body;

    const result = await reportService.approveTeamReport(
      req.params.reportId,
      req.user,
      comments,
      req,
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectTeamReport = async (req, res) => {
  try {
    const { reason } = req.body;

    const result = await reportService.rejectTeamReport(
      req.params.reportId,
      req.user,
      reason,
      req,
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
