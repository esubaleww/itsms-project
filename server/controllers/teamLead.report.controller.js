import * as reportService from "../services/report.service.js";

export const submitTeamReport = async (req, res) => {
  try {
    const result = await reportService.createTeamReport(req.user, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyTeamReports = async (req, res) => {
  try {
    const result = await reportService.getReports(
      {
        team: req.user.team,
        type: "team_report",
      },
      req.query,
    );
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
    const result = await reportService.getReportById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const result = await reportService.getReports(
      {
        submittedBy: req.user._id,
        type: "team_report",
      },
      req.query,
    );

    res.json({
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
