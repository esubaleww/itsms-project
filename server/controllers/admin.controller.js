import * as adminService from "../services/admin.service.js";
import ExportService from "../services/admin.export.service.js";

export const getPendingRequests = async (req, res) => {
  try {
    const result = await adminService.getPendingRequests();
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
    const result = await adminService.getRequestById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { comments } = req.body;
    const result = await adminService.approveRequest(
      req.params.id,
      req.user,
      comments,
      req,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await adminService.rejectRequest(
      req.params.id,
      req.user,
      reason,
      req,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const result = await adminService.getAdminStats();
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createDirectorate = async (req, res) => {
  try {
    const result = await adminService.createDirectorate(
      req.user,
      req.body,
      req,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllDirectorates = async (req, res) => {
  try {
    const result = await adminService.getAllDirectorates();
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDirectorateById = async (req, res) => {
  try {
    const result = await adminService.getDirectorateById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDirectorate = async (req, res) => {
  try {
    const result = await adminService.updateDirectorate(
      req.params.id,
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

export const deleteDirectorate = async (req, res) => {
  try {
    const result = await adminService.deleteDirectorate(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createStaff = async (req, res) => {
  try {
    const result = await adminService.createStaff(req.user, req.body, req);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const result = await adminService.getAllStaff();
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const result = await adminService.updateStaff(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const result = await adminService.deleteStaff(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetStaffPassword = async (req, res) => {
  try {
    const result = await adminService.resetStaffPassword(
      req.params.id,
      req.user,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDirectorateHead = async (req, res) => {
  try {
    const result = await adminService.updateDirectorateHead(
      req.params.directorateId,
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

export const getAllUsers = async (req, res) => {
  try {
    const { role, verified, search } = req.query;
    const result = await adminService.getAllUsers({ role, verified, search });
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await adminService.getUserById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = await adminService.updateUser(
      req.params.id,
      req.body,
      req.user,
      req,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.id, req.user, req);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const result = await adminService.resendVerification(
      req.params.id,
      req.user,
      req,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAuditLogs = async (req, res) => {
  try {
    const { action, entity, userId, startDate, endDate, limit, skip } =
      req.query;
    const result = await adminService.getAuditLogs({
      action,
      entity,
      userId,
      startDate,
      endDate,
      limit,
      skip,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSettings = async (req, res) => {
  try {
    const result = await adminService.getSettings();
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const result = await adminService.updateSettings(req.body, req.user, req);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const exportData = async (req, res) => {
  try {
    const { format, type, dateRange } = req.body;

    const result = await ExportService.exportData({ format, type, dateRange });

    res.setHeader("Content-Type", result.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`,
    );
    res.setHeader("Content-Length", result.data.length);

    res.send(result.data);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
