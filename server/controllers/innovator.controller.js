// backend/controllers/innovator.controller.js
import * as innovatorService from "../services/innovator.service.js";

export const getMyMilestones = async (req, res) => {
  try {
    const result = await innovatorService.getMyMilestones(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get milestones error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMilestoneStatus = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status } = req.body;
    const result = await innovatorService.updateMilestoneStatus(
      req.user.id,
      milestoneId,
      status,
    );
    res.json(result);
  } catch (error) {
    console.error("Update milestone error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyInnovatorProfile = async (req, res) => {
  try {
    const result = await innovatorService.getMyInnovatorProfile(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const result = await innovatorService.getMyProgress(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyMentor = async (req, res) => {
  try {
    const result = await innovatorService.getMyMentor(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get mentor error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const result = await innovatorService.getMyDocuments(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getInnovatorDashboard = async (req, res) => {
  try {
    const result = await innovatorService.getInnovatorDashboard(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};
