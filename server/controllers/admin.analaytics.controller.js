import analyticsService from "../services/admin.analytics.service.js";

export const getAnalytics = async (req, res) => {
  try {
    const { dateRange = "30days" } = req.query;
    const data = await analyticsService.getAllAnalytics(dateRange);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDailyActivity = async (req, res) => {
  try {
    const { dateRange = "30days" } = req.query;
    const data = await analyticsService.getDailyActivity(dateRange);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestDistribution = async (req, res) => {
  try {
    const data = await analyticsService.getRequestDistribution();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStatusDistribution = async (req, res) => {
  try {
    const data = await analyticsService.getStatusDistribution();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { dateRange = "30days" } = req.query;
    const data = await analyticsService.getUserStats(dateRange);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestStats = async (req, res) => {
  try {
    const { dateRange = "30days" } = req.query;
    const data = await analyticsService.getRequestStats(dateRange);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProgramStats = async (req, res) => {
  try {
    const { dateRange = "30days" } = req.query;
    const data = await analyticsService.getProgramStats(dateRange);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceMetrics = async (req, res) => {
  try {
    const { dateRange = "30days" } = req.query;
    const data = await analyticsService.getPerformanceMetrics(dateRange);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
