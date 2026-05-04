import * as innovatorService from "../services/director.innovator.service.js";

export const getInnovatorSummaries = async (req, res) => {
  try {
    const result = await innovatorService.getDirectorInnovatorSummaries(
      req.user.id,
      req.query,
    );
    res.json(result);
  } catch (error) {
    console.error("Get innovators error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const assignMentor = async (req, res) => {
  try {
    const { innovatorId } = req.params;
    const { mentorId } = req.body;
    const result = await innovatorService.assignMentor(
      req.user.id,
      innovatorId,
      mentorId,
    );
    res.json(result);
  } catch (error) {
    console.error("Assign mentor error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getInnovatorProgress = async (req, res) => {
  try {
    const { innovatorId } = req.params;
    const result = await innovatorService.getInnovatorProgress(
      req.user.id,
      innovatorId,
    );
    res.json(result);
  } catch (error) {
    console.error("Get innovator progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeInnovatorMentor = async (req, res) => {
  try {
    const { innovatorId } = req.params;
    const result = await innovatorService.removeMentor(
      req.user.id,
      innovatorId,
    );
    res.json(result);
  } catch (error) {
    console.error("Remove mentor error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateInnovatorStatus = async (req, res) => {
  try {
    const { innovatorId } = req.params;
    const { status } = req.body;
    const result = await innovatorService.updateInnovatorStatus(
      req.user.id,
      innovatorId,
      status,
    );
    res.json(result);
  } catch (error) {
    console.error("Update innovator status error:", error);
    res.status(500).json({ message: error.message });
  }
};
