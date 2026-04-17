import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkAdmin } from "../middleware/permission.middleware.js";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceCatalog.controller.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);

router.post("/", protect, checkAdmin, createService);
router.put("/:id", protect, checkAdmin, updateService);
router.delete("/:id", protect, checkAdmin, deleteService);

export default router;
