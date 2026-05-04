import { useRef, useState } from "react";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { Upload, X, Loader, Eye, Download, FileText } from "lucide-react";

export const DocumentUpload = ({
  label,
  value,
  onChange,
  required = false,
  maxSizeMB = 20,
}) => {
  const { uploadFile, isLoading, progress, resetProgress } =
    useCloudinaryUpload();
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);

    if (file.size / 1024 / 1024 > maxSizeMB) {
      setError(`File exceeds ${maxSizeMB} MB limit`);
      return;
    }

    try {
      const uploaded = await uploadFile(file);
      onChange(uploaded);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeFile = () => {
    onChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    resetProgress();
  };

  const openFile = () => {
    if (value?.url) window.open(value.url, "_blank");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {!value ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="group cursor-pointer bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 hover:border-emerald-500/50 hover:bg-gray-700 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader className="w-5 h-5 text-emerald-400 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition" />
              )}
              <span className="text-sm text-gray-300 group-hover:text-white transition">
                {isLoading
                  ? `Uploading... ${progress}%`
                  : `Upload ${label.toLowerCase()}`}
              </span>
            </div>
            {!isLoading && (
              <span className="text-xs text-gray-500 group-hover:text-gray-400 transition">
                {`≤${maxSizeMB}MB`}
              </span>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {value.isImage && (
              <img src={value.url} className="w-10 h-10 object-cover rounded" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {value.name}
              </p>
              <p className="text-xs text-gray-400">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openFile}
              className="p-1 text-blue-400 hover:text-blue-300"
            >
              <Eye className="w-4 h-4" />
            </button>
            <a
              href={value.url}
              download
              className="p-1 text-gray-400 hover:text-emerald-400"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={removeFile}
              className="p-1 text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};
