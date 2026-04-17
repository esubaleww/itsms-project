import express from "express";
import {
  apply,
  getMyApplications,
} from "../controllers/application.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/apply/:type", protect, apply);

router.get("/my", protect, getMyApplications);

export default router;
