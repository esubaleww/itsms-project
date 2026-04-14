import * as applicationService from "../services/application.service.js";
import { logAction } from "../utils/auditLogger.js";

export const apply = async (req, res) => {
  try {
    const { type } = req.params;

    const result = await applicationService.apply(type, req.user._id, req.body);

    await logAction({
      user: req.user,
      action: "CREATE",
      entity: "Request",
      entityId: result.request._id,
      request: result.request._id,
      metadata: { type },
      req,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const result = await applicationService.getMyApplications(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
