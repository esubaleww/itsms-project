import * as internService from "../services/intern.service.js";

export const getMyWeeklyReports = async (req, res) => {
  try {
    const result = await internService.getMyWeeklyReports(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const submitWeeklyReport = async (req, res) => {
  try {
    const result = await internService.submitWeeklyReport(
      req.user.id,
      req.body,
    );
    res.json(result);
  } catch (error) {
    console.error("Submit report error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getReportByWeek = async (req, res) => {
  try {
    const { week } = req.params;
    const result = await internService.getReportByWeek(
      req.user.id,
      parseInt(week),
    );
    res.json(result);
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { week } = req.params;
    const result = await internService.updateReport(
      req.user.id,
      parseInt(week),
      req.body,
    );
    res.json(result);
  } catch (error) {
    console.error("Update report error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyInternProfile = async (req, res) => {
  try {
    const result = await internService.getMyInternProfile(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const result = await internService.getMyProgress(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyAdvisor = async (req, res) => {
  try {
    const result = await internService.getMyAdvisor(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get advisor error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getInternDashboard = async (req, res) => {
  try {
    const result = await internService.getInternDashboard(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};
