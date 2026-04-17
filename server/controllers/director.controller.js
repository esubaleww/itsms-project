import * as directorService from "../services/director.service.js";

export const getDirectorStats = async (req, res) => {
  try {
    const result = await directorService.getDirectorStats(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAssignedRequests = async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const result = await directorService.getAssignedRequests(req.user.id, {
      status,
      type,
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

export const getRequestById = async (req, res) => {
  try {
    const result = await directorService.getRequestById(
      req.params.id,
      req.user.id,
    );
    res.json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignToTeam = async (req, res) => {
  try {
    const { teamId, instructions } = req.body;
    const result = await directorService.assignToTeam(
      req.params.id,
      req.user.id,
      teamId,
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

export const createTeam = async (req, res) => {
  try {
    const result = await directorService.createTeam(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeams = async (req, res) => {
  try {
    const result = await directorService.getTeams(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const result = await directorService.getTeamById(
      req.user.id,
      req.params.teamId,
    );
    res.json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const result = await directorService.updateTeam(
      req.user.id,
      req.params.teamId,
      req.body,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const result = await directorService.deleteTeam(
      req.user.id,
      req.params.teamId,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignTeamLead = async (req, res) => {
  try {
    const { staffId } = req.body;
    const result = await directorService.assignTeamLead(
      req.user.id,
      req.params.teamId,
      staffId,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignToTeamMember = async (req, res) => {
  try {
    const { staffId } = req.body;
    const result = await directorService.assignToTeamMember(
      req.user.id,
      req.params.teamId,
      staffId,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromTeam = async (req, res) => {
  try {
    const result = await directorService.removeFromTeam(
      req.user.id,
      req.params.teamId,
      req.params.staffId,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAvailableStaff = async (req, res) => {
  try {
    const result = await directorService.getAvailableStaff(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
