import { useState } from "react";
import API from "../services/api";

export const useCloudinaryUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file) => {
    setIsLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total)
            setProgress(Math.round((event.loaded * 100) / event.total));
        },
      });
      console.log("Upload response:", res.data);
      return res.data.data;
    } catch (err) {
      throw err.response?.data || err.message;
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const resetProgress = () => setProgress(0);

  return { uploadFile, isLoading, progress, resetProgress };
};
