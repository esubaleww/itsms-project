import * as startupService from "../services/director.startup.service.js";

export const getStartupSummaries = async (req, res) => {
  try {
    const result = await startupService.getDirectorStartupSummaries(
      req.user.id,
      req.query,
    );
    res.json(result);
  } catch (error) {
    console.error("Get startups error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getStartupProgress = async (req, res) => {
  try {
    const { startupId } = req.params;
    const result = await startupService.getStartupProgress(
      req.user.id,
      startupId,
    );
    res.json(result);
  } catch (error) {
    console.error("Get startup progress error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const assignStartupMentor = async (req, res) => {
  try {
    const { startupId, mentorId } = req.body;
    const result = await startupService.assignMentor(
      req.user.id,
      startupId,
      mentorId,
    );
    res.json(result);
  } catch (error) {
    console.error("Assign mentor error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeStartupMentor = async (req, res) => {
  try {
    const { startupId } = req.params;
    const result = await startupService.removeMentor(req.user.id, startupId);
    res.json(result);
  } catch (error) {
    console.error("Remove mentor error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateStartupStatus = async (req, res) => {
  try {
    const { startupId } = req.params;
    const { status } = req.body;
    const result = await startupService.updateStartupStatus(
      req.user.id,
      startupId,
      status,
    );
    res.json(result);
  } catch (error) {
    console.error("Update startup status error:", error);
    res.status(500).json({ message: error.message });
  }
};
