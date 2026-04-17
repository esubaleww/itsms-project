import * as teamleadService from "../services/teamLead.service.js";

export const getMyTeam = async (req, res) => {
  try {
    const result = await teamleadService.getMyTeam(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const result = await teamleadService.getTeamMembers(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeamTasks = async (req, res) => {
  try {
    const { status, type, assignedTo, search } = req.query;
    const result = await teamleadService.getTeamTasks(req.user.id, {
      status,
      type,
      assignedTo,
      search,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const result = await teamleadService.getTaskById(
      req.user.id,
      req.params.taskId,
    );
    res.json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { memberId, instructions } = req.body;
    const result = await teamleadService.assignTask(
      req.user.id,
      req.params.taskId,
      memberId,
      instructions,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const result = await teamleadService.updateTaskStatus(
      req.user.id,
      req.params.taskId,
      req.params.taskIndex,
      status,
      notes,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeamProgress = async (req, res) => {
  try {
    const result = await teamleadService.getTeamProgress(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const requestStaff = async (req, res) => {
  try {
    const result = await teamleadService.requestStaff(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
