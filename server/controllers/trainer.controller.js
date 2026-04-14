import * as trainerService from "../services/trainer.service.js";

export const getMyTrainees = async (req, res) => {
  try {
    const result = await trainerService.getMyTrainees(req.user.id, req.query);
    res.json(result);
  } catch (error) {
    console.error("Get trainees error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTraineeProgress = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const result = await trainerService.getTraineeProgress(
      req.user.id,
      traineeId,
    );
    res.json(result);
  } catch (error) {
    console.error("Get trainee progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const sessionData = req.body;
    const result = await trainerService.createSession(
      req.user.id,
      traineeId,
      sessionData,
    );
    res.json(result);
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const recordAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { traineeId } = req.body;
    const result = await trainerService.recordAttendance(
      req.user.id,
      sessionId,
      traineeId,
    );
    res.json(result);
  } catch (error) {
    console.error("Record attendance error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const generateCertificate = async (req, res) => {
  try {
    const { traineeId, sessionId } = req.params;
    const result = await trainerService.generateCertificate(
      req.user.id,
      traineeId,
      sessionId,
    );
    res.json(result);
  } catch (error) {
    console.error("Generate certificate error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTrainerStats = async (req, res) => {
  try {
    const result = await trainerService.getTrainerStats(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get trainer stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTrainerDashboard = async (req, res) => {
  try {
    const result = await trainerService.getTrainerDashboard(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get trainer dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const submitTrainerSummary = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const result = await trainerService.submitTrainerSummary(
      req.user.id,
      traineeId,
      req.body,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTraineeStatus = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const { status } = req.body;
    const result = await trainerService.updateTraineeStatus(
      req.user.id,
      traineeId,
      status,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
