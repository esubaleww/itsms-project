import directorAnalyticsService from "../services/directorAnalytics.service.js";

export const getAnalytics = async (req, res) => {
  try {
    const data = await directorAnalyticsService.getAllAnalytics(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Director analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWeeklyActivity = async (req, res) => {
  try {
    const data = await directorAnalyticsService.getWeeklyActivity(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Get weekly activity error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestDistribution = async (req, res) => {
  try {
    const data = await directorAnalyticsService.getRequestDistribution(
      req.user.id,
    );
    res.json({ success: true, data });
  } catch (error) {
    console.error("Get request distribution error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStatusDistribution = async (req, res) => {
  try {
    const data = await directorAnalyticsService.getStatusDistribution(
      req.user.id,
    );
    res.json({ success: true, data });
  } catch (error) {
    console.error("Get status distribution error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamPerformance = async (req, res) => {
  try {
    const data = await directorAnalyticsService.getTeamPerformance(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Get team performance error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInternProgress = async (req, res) => {
  try {
    const data = await directorAnalyticsService.getInternProgress(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Get intern progress error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInnovatorProgress = async (req, res) => {
  try {
    const data = await directorAnalyticsService.getInnovatorProgress(
      req.user.id,
    );
    res.json({ success: true, data });
  } catch (error) {
    console.error("Get innovator progress error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStartupProgress = async (req, res) => {
  try {
    const data = await directorAnalyticsService.getStartupProgress(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Get startup progress error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
