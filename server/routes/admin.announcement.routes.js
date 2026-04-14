import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkAdmin } from "../middleware/permission.middleware.js";
import * as anoucementController from "../controllers/anouncement.controller.js";

const router = express.Router();

router.use(protect);
router.use(checkAdmin);

router.post("/announcements", anoucementController.createAnnouncement);
router.get("/announcements", anoucementController.getAllAnnouncements);
router.put("/announcements/:id", anoucementController.updateAnnouncement);
router.delete("/announcements/:id", anoucementController.deleteAnnouncement);

export default router;
