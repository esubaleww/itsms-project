import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    res.json({
      success: true,
      data: {
        url: result.url,
        public_id: result.public_id,
        name: result.name,
        size: result.size,
        mimeType: result.mimeType,
        isImage: result.isImage,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message || "Upload failed" });
  }
});

export default router;
