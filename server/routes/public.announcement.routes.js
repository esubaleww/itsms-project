import express from "express";
import * as announcementService from "../services/announcement.service.js";

const router = express.Router();

router.get("/announcements", async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    const result = await announcementService.getPublicAnnouncements({
      category,
      featured,
      limit,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
