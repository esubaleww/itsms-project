import googleDriveService from "../services/googleDrive.service.js";
import Application from "../models/Application.js";

export const verifyDocument = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { accessToken } = req.body;

    const result = await googleDriveService.verifyFile(fileId, accessToken);

    if (result.success) {
      res.json({ success: true, file: result.file });
    } else {
      res.status(400).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateDocument = async (req, res) => {
  try {
    const { url } = req.body;

    const isValid = googleDriveService.validateDriveLink(url);

    if (isValid) {
      const fileId = googleDriveService.extractFileId(url);
      const embedUrl = googleDriveService.getEmbedUrl(url);

      res.json({
        success: true,
        isValid: true,
        fileId,
        embedUrl,
        viewLink: url,
      });
    } else {
      res.json({
        success: true,
        isValid: false,
        message: "Invalid Google Drive link",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationDocument = async (req, res) => {
  try {
    const { applicationId, documentType } = req.params;
    const { fileId, fileName, fileUrl } = req.body;
    const userId = req.user.id;

    const application = await Application.findOne({
      _id: applicationId,
      applicant: userId,
    });

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (application.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot update documents after approval",
      });
    }

    if (application.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot update rejected applications",
      });
    }

    application.documents = application.documents || {};
    application.documents[documentType] = {
      fileId,
      fileName,
      fileUrl,
      uploadedAt: new Date(),
    };

    await application.save();

    res.json({
      success: true,
      message: "Document updated successfully",
      document: application.documents[documentType],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
