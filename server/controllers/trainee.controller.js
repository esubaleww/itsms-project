import * as traineeService from "../services/trainee.service.js";

export const getMySessions = async (req, res) => {
  try {
    const result = await traineeService.getMySessions(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await traineeService.markAttendance(req.user.id, sessionId);
    res.json(result);
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyTraineeProfile = async (req, res) => {
  try {
    const result = await traineeService.getMyTraineeProfile(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const result = await traineeService.getMyProgress(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyTrainer = async (req, res) => {
  try {
    const result = await traineeService.getMyTrainer(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get trainer error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTraineeDashboard = async (req, res) => {
  try {
    const result = await traineeService.getTraineeDashboard(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};
