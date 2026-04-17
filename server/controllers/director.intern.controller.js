import * as directorInternService from "../services/director.intern.service.js";
import User from "../models/User.js";
export const assignAdvisor = async (req, res) => {
  try {
    const { internId } = req.params;
    const { advisorId } = req.body;

    const result = await directorInternService.assignAdvisor(
      req.user.id,
      internId,
      advisorId,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInternSummaries = async (req, res) => {
  try {
    const result = await directorInternService.getDirectorInternSummaries(
      req.user.id,
      req.query,
    );
    res.status(200).json({
      success: true,
      data: result,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInternProgress = async (req, res) => {
  try {
    const result = await directorInternService.getInternProgress(
      req.user.id,
      req.params.internId,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateInternStatus = async (req, res) => {
  try {
    const { internId } = req.params;
    const { status } = req.body;

    const result = await directorInternService.updateInternStatus(
      internId,
      status,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
