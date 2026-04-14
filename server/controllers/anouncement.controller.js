import * as announcementService from "../services/announcement.service.js";

export const createAnnouncement = async (req, res) => {
  try {
    const result = await announcementService.createAnnouncement(
      req.user,
      req.body,
      req,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const result = await announcementService.getAllAnnouncements();
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const result = await announcementService.updateAnnouncement(
      req.params.id,
      req.user,
      req.body,
      req,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const result = await announcementService.deleteAnnouncement(
      req.params.id,
      req.user,
      req,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
