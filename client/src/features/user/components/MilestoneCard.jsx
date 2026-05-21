import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  X,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import { DocumentUpload } from "../../../common/components/DocumentUpload";
import DocumentItem from "../../../common/components/DocumentItem";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Clock,
    nextStatus: "in_progress",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-[#EEF2FF] text-[#2563eb] border-[#2563eb]/30",
    icon: AlertCircle,
    nextStatus: "completed",
  },
  completed: {
    label: "Completed",
    color: "bg-[#EEF2FF] text-[#2563eb] border-[#2563eb]/30",
    icon: CheckCircle,
    nextStatus: null,
  },
};

const MilestoneCard = ({ milestone, onUpdateStatus, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [evidence, setEvidence] = useState({
    description: "",
    files: [],
  });
  const [uploading, setUploading] = useState(false);

  const status = statusConfig[milestone.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const canUpdate = milestone.status !== "completed";
  const isInProgress = milestone.status === "in_progress";

  const handleStartWorking = async () => {
    if (milestone.status !== "pending") return;
    setUpdating(true);
    try {
      await onUpdateStatus(milestone._id, "in_progress");
    } catch (error) {
      console.error("Failed to update milestone:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleFileUploadComplete = (uploadedFile) => {
    setEvidence({
      ...evidence,
      files: [...evidence.files, uploadedFile],
    });
  };

  const removeFile = (index) => {
    const newFiles = [...evidence.files];
    newFiles.splice(index, 1);
    setEvidence({ ...evidence, files: newFiles });
  };

  const canSubmitEvidence =
    evidence.description.trim().length > 0 || evidence.files.length > 0;

  const openFile = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmitEvidence = async (e) => {
    e?.stopPropagation?.();
    if (!canSubmitEvidence) {
      alert("Please provide a description or upload evidence");
      return;
    }

    setUploading(true);
    try {
      await onUpdateStatus(milestone._id, "completed", {
        description: evidence.description,
        files: evidence.files,
      });

      setShowEvidenceForm(false);
      setEvidence({ description: "", files: [] });
    } catch (error) {
      console.error("Failed to submit evidence:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200"
    >
      <div
        className="p-4 cursor-pointer hover:bg-[#F3F4F6]/20 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] border border-[#2563eb]/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#2563eb]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-[#111827]">
                  Milestone {index + 1}: {milestone.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-[#6b7280] mt-1 line-clamp-1">
                {milestone.description}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-[#6b7280]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#6b7280]" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-[#E5E7EB] space-y-3">
          <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-lg p-3">
            <p className="text-sm text-[#374151]">{milestone.description}</p>
          </div>

          {milestone.resources && milestone.resources.length > 0 && (
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <p className="text-xs text-blue-400 mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Resources Provided by Mentor:
              </p>
              <div className="space-y-2">
                {milestone.resources.map((file, idx) => (
                  <DocumentItem
                    key={idx}
                    file={file}
                    label={file.name || "Resource File"}
                    showDownload={true}
                  />
                ))}
              </div>
            </div>
          )}

          {milestone.dueDate && (
            <div className="flex items-center gap-2 text-xs text-[#6b7280]">
              <Clock className="w-3 h-3" />
              <span>
                Due: {new Date(milestone.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {milestone.status === "pending" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStartWorking();
              }}
              disabled={updating}
              className="btn-institutional w-full py-2 disabled:opacity-50"
            >
              {updating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              ) : (
                <>Start Working</>
              )}
            </button>
          )}

          {isInProgress && !showEvidenceForm && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowEvidenceForm(true);
              }}
              className="btn-institutional w-full py-2"
            >
              <Upload className="w-4 h-4" />
              Submit Work for Review
            </button>
          )}

          {showEvidenceForm && (
            <div
              className="space-y-3 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-[#111827]">
                  Submit Your Work
                </h4>
                <button
                  onClick={() => {
                    setShowEvidenceForm(false);
                    setEvidence({ description: "", files: [] });
                  }}
                  className="text-[#6b7280] hover:text-[#111827]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                placeholder="Describe what you accomplished for this milestone..."
                value={evidence.description}
                onChange={(e) =>
                  setEvidence({ ...evidence, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] text-sm focus:outline-none focus:border-[#2563eb]"
              />

              <DocumentUpload
                label="Upload Evidence"
                value={null}
                onChange={handleFileUploadComplete}
                maxSizeMB={10}
              />

              {evidence.files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-[#6b7280]">Attached Files:</p>
                  {evidence.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 flex items-center justify-between border border-[#D1D5DB]"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {file.isImage && file.url ? (
                          <img
                            src={file.url}
                            className="w-8 h-8 object-cover rounded"
                            alt="preview"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-[#2563eb]" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[#111827] text-sm font-medium truncate">
                            {file.name || "Document"}
                          </p>
                          <p className="text-xs text-[#6b7280]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.url && (
                          <>
                            <button
                              onClick={() => openFile(file.url)}
                              className="p-1 text-blue-400 hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={file.url}
                              download
                              className="p-1 text-[#6b7280] hover:text-[#2563eb]"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </>
                        )}
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-1 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitEvidence}
                disabled={!canSubmitEvidence || uploading}
                className="btn-institutional w-full py-2 disabled:opacity-50"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          )}

          {milestone.status === "completed" && milestone.evidence && (
            <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-lg p-3">
              <p className="text-xs text-[#2563eb] mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Work Submitted:
              </p>
              {milestone.evidence.description && (
                <div className="mb-3">
                  <p className="text-xs text-[#6b7280] mb-1">Description:</p>
                  <p className="text-sm text-[#374151]">
                    {milestone.evidence.description}
                  </p>
                </div>
              )}
              {milestone.evidence.files &&
                milestone.evidence.files.length > 0 && (
                  <div className="space-y-2">
                    {milestone.evidence.files.map((file, idx) => (
                      <DocumentItem
                        key={idx}
                        file={file}
                        label={file.name || "Evidence File"}
                        showDownload={true}
                      />
                    ))}
                  </div>
                )}
            </div>
          )}

          {milestone.status === "completed" && milestone.completedAt && (
            <div className="text-xs text-[#2563eb]/70 flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              <span>
                Completed on:{" "}
                {new Date(milestone.completedAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {milestone.feedback && (
            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <p className="text-xs text-purple-400 mb-1">Mentor Feedback:</p>
              <p className="text-sm text-[#374151]">{milestone.feedback}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MilestoneCard;
