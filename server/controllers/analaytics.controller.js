// server/controllers/analytics.controller.js
import analyticsService from "../services/analytics.service.js";

export const getAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getAllAnalytics();
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
    const data = await analyticsService.getDailyActivity();
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
    const data = await analyticsService.getUserStats();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestStats = async (req, res) => {
  try {
    const data = await analyticsService.getRequestStats();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProgramStats = async (req, res) => {
  try {
    const data = await analyticsService.getProgramStats();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceMetrics = async (req, res) => {
  try {
    const data = await analyticsService.getPerformanceMetrics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
