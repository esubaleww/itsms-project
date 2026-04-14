import express from "express";
import * as statsService from "../services/stats.service.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const result = await statsService.getDashboardStats();
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
