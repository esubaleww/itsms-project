import { useState } from "react";
import { Eye, File, Image, FileText } from "lucide-react";

const DocumentItem = ({ file, label, onRemove, showDownload = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!file) return null;

  let fileUrl;
  let fileName;
  let fileSize;
  let isImage = false;
  let mimeType = "";

  if (typeof file === "string") {
    fileUrl = file;
    fileName = label;
  } else if (file.url) {
    fileUrl = file.url;
    fileName = file.name || label;
    fileSize = file.size;
    mimeType = file.mimeType || "";
    isImage = file.isImage || mimeType.startsWith("image/") || false;
  } else if (file.viewLink) {
    fileUrl = file.viewLink;
    fileName = file.name || label;
  } else {
    fileUrl = file;
    fileName = label;
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = () => {
    if (isImage) return <Image className="w-5 h-5 text-[#2563eb]" />;
    if (mimeType.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType.includes("word") || mimeType.includes("document"))
      return <FileText className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-[#6b7280]" />;
  };

  const openDocument = () => {
    if (!fileUrl) return;

    const isPDF = fileUrl.includes(".pdf") || mimeType === "application/pdf";

    if (isPDF) {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      window.open(viewerUrl, "_blank");
    } else {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div
      onClick={openDocument}
      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 hover:bg-[#F3F4F6] transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">{getFileIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-[#111827] font-medium truncate">{fileName}</p>
            <div className="flex items-center gap-2">
              {fileSize && (
                <span className="text-xs text-[#6b7280]">
                  {formatFileSize(fileSize)}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDocument();
                }}
                className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg transition"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="p-1.5 text-red-500 hover:text-red-600 rounded-lg transition"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-xs text-[#6b7280] hover:text-[#6b7280] mt-1 block truncate"
          >
            {isExpanded ? fileUrl : `${fileUrl.substring(0, 60)}...`}
          </button>

          {isImage && (
            <div className="mt-3">
              <img
                src={fileUrl}
                alt={fileName}
                className="max-h-48 rounded-lg object-contain border border-[#D1D5DB]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;
