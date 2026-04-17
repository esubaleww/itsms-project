import * as traineeService from "../services/director.trainee.service.js";

export const getTraineeSummaries = async (req, res) => {
  try {
    const result = await traineeService.getDirectorTraineeSummaries(
      req.user.id,
      req.query,
    );
    res.json(result);
  } catch (error) {
    console.error("Get trainees error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTraineeProgress = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const result = await traineeService.getTraineeProgress(
      req.user.id,
      traineeId,
    );
    res.json(result);
  } catch (error) {
    console.error("Get trainee progress error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const assignTrainer = async (req, res) => {
  try {
    const { traineeId, trainerId } = req.body;
    const result = await traineeService.assignTrainer(
      req.user.id,
      traineeId,
      trainerId,
    );
    res.json(result);
  } catch (error) {
    console.error("Assign trainer error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTraineeSessions = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const result = await traineeService.getTraineeSessions(
      req.user.id,
      traineeId,
    );
    res.json(result);
  } catch (error) {
    console.error("Get trainee sessions error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeTrainer = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const result = await traineeService.removeTrainer(req.user.id, traineeId);
    res.json(result);
  } catch (error) {
    console.error("Remove trainer error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTraineeStatus = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const { status } = req.body;
    const result = await traineeService.updateTraineeStatus(
      req.user.id,
      traineeId,
      status,
    );
    res.json(result);
  } catch (error) {
    console.error("Update trainee status error:", error);
    res.status(500).json({ message: error.message });
  }
};
