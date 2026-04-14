// backend/services/cloudinary.service.js
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer, fileName, mimeType) => {
  return new Promise((resolve, reject) => {
    let resourceType = "auto";

    if (mimeType.startsWith("image/")) {
      resourceType = "image";
    } else if (mimeType === "application/pdf") {
      resourceType = "raw";
    } else {
      resourceType = "raw";
    }

    const timestamp = Date.now();
    const baseName = fileName.split(".")[0];
    const publicId = `itsms_documents/${timestamp}_${baseName}`;

    cloudinary.uploader
      .upload_stream(
        {
          resource_type: resourceType,
          public_id: publicId,
          folder: "itsms_documents",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));

          let viewableUrl = result.secure_url;

          if (mimeType === "application/pdf") {
            viewableUrl = result.secure_url.replace(
              "/upload/",
              "/upload/fl_attachment/",
            );
          }

          resolve({
            url: viewableUrl,
            public_id: result.public_id,
            name: fileName,
            size: result.bytes,
            mimeType: mimeType,
            isImage: result.resource_type === "image",
          });
        },
      )
      .end(fileBuffer);
  });
};
