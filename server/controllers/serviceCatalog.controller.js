// server/controllers/serviceCatalog.controller.js
import * as serviceCatalogService from "../services/serviceCatalog.service.js";

export const getAllServices = async (req, res) => {
  try {
    const result = await serviceCatalogService.getAllServices(req.query);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await serviceCatalogService.getServiceById(req.params.id);
    res.json({ success: true, service });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPopularServices = async (req, res) => {
  try {
    const services = await serviceCatalogService.getPopularServices(
      req.query.limit,
    );
    res.json({ success: true, services });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getServiceStats = async (req, res) => {
  try {
    const stats = await serviceCatalogService.getServiceStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await serviceCatalogService.createService(req.body);
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await serviceCatalogService.updateService(
      req.params.id,
      req.body,
    );
    res.json({ success: true, service });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    await serviceCatalogService.deleteService(req.params.id);
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
