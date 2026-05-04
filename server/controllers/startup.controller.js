import * as startupService from "../services/startup.service.js";

export const getMyMilestones = async (req, res) => {
  try {
    const result = await startupService.getMyMilestones(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get milestones error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMilestoneStatus = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status, evidenceData } = req.body;
    const result = await startupService.updateMilestoneStatus(
      req.user.id,
      milestoneId,
      status,
      evidenceData,
    );
    res.json(result);
  } catch (error) {
    console.error("Update milestone error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyStartupProfile = async (req, res) => {
  try {
    const result = await startupService.getMyStartupProfile(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const result = await startupService.getMyProgress(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyMentor = async (req, res) => {
  try {
    const result = await startupService.getMyMentor(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get mentor error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateFounders = async (req, res) => {
  try {
    const { founders } = req.body;
    const result = await startupService.updateFounders(req.user.id, founders);
    res.json(result);
  } catch (error) {
    console.error("Update founders error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addFounder = async (req, res) => {
  try {
    const founderData = req.body;
    const result = await startupService.addFounder(req.user.id, founderData);
    res.json(result);
  } catch (error) {
    console.error("Add founder error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeFounder = async (req, res) => {
  try {
    const { founderId } = req.params;
    const result = await startupService.removeFounder(req.user.id, founderId);
    res.json(result);
  } catch (error) {
    console.error("Remove founder error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const result = await startupService.getMyDocuments(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getStartupDashboard = async (req, res) => {
  try {
    const result = await startupService.getStartupDashboard(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};
