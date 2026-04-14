// server/controllers/teamLeadAnalytics.controller.js
import teamLeadAnalyticsService from "../services/teamLeadAnalytics.service.js";

export const getAnalytics = async (req, res) => {
  try {
    const data = await teamLeadAnalyticsService.getAllAnalytics(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Team lead analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWeeklyActivity = async (req, res) => {
  try {
    const { teamId } = await teamLeadAnalyticsService.getTeamInfo(req.user.id);
    const data = await teamLeadAnalyticsService.getWeeklyActivity(teamId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamPerformance = async (req, res) => {
  try {
    const { teamId } = await teamLeadAnalyticsService.getTeamInfo(req.user.id);
    const data = await teamLeadAnalyticsService.getTeamPerformance(teamId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMemberPerformance = async (req, res) => {
  try {
    const { teamId } = await teamLeadAnalyticsService.getTeamInfo(req.user.id);
    const data = await teamLeadAnalyticsService.getMemberPerformance(teamId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
