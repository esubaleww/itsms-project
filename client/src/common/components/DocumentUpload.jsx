import { useRef, useState } from "react";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { Upload, X, Loader, Eye, Download, FileText } from "lucide-react";

export const DocumentUpload = ({
  label,
  value,
  onChange,
  required = false,
  maxSizeMB = 10,
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
      <label className="block text-sm font-medium text-text-secondary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {!value ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="group cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-3 hover:border-accent/50 hover:bg-gray-50 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader className="w-5 h-5 text-accent animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-text-muted group-hover:text-accent transition" />
              )}
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition">
                {isLoading
                  ? `Uploading... ${progress}%`
                  : `Upload ${label.toLowerCase()}`}
              </span>
            </div>
            {!isLoading && (
              <span className="text-xs text-text-muted group-hover:text-text-secondary transition">
                {`<=${maxSizeMB}MB`}
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
        <div className="bg-blue-50 border border-accent/30 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {value.isImage && (
              <img src={value.url} className="w-10 h-10 object-cover rounded" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm font-medium truncate">
                {value.name}
              </p>
              <p className="text-xs text-text-muted">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openFile}
              className="p-1 text-blue-500 hover:text-blue-600 transition"
            >
              <Eye className="w-4 h-4" />
            </button>
            <a
              href={value.url}
              download
              className="p-1 text-text-muted hover:text-accent transition"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={removeFile}
              className="p-1 text-red-500 hover:text-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
