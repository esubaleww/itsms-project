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
    color: "bg-yellow-50 text-yellow-600 border-yellow-500/30",
    icon: Clock,
    nextStatus: "in_progress",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-50 text-accent border-accent/30",
    icon: AlertCircle,
    nextStatus: "completed",
  },
  completed: {
    label: "Completed",
    color: "bg-blue-50 text-accent border-accent/30",
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
      className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="p-4 cursor-pointer hover:bg-gray-100/20 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-accent/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-medium text-text-primary">
                  Milestone {index + 1}: {milestone.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-text-muted mt-1 line-clamp-1">
                {milestone.description}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-200 space-y-3">
          <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-text-secondary">
              {milestone.description}
            </p>
          </div>

          {milestone.resources && milestone.resources.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-600 mb-2 flex items-center gap-1">
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
            <div className="flex items-center gap-2 text-xs text-text-muted">
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
              className="btn-filled w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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
              className="btn-filled w-full py-2"
            >
              <Upload className="w-4 h-4" />
              Submit Work for Review
            </button>
          )}

          {showEvidenceForm && (
            <div
              className="space-y-3 bg-white shadow-sm rounded-lg p-4 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-heading font-medium text-text-primary">
                  Submit Your Work
                </h4>
                <button
                  onClick={() => {
                    setShowEvidenceForm(false);
                    setEvidence({ description: "", files: [] });
                  }}
                  className="text-text-muted hover:text-text-primary"
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
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />

              <DocumentUpload
                label="Upload Evidence"
                value={null}
                onChange={handleFileUploadComplete}
                maxSizeMB={10}
              />

              {evidence.files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-text-muted">Attached Files:</p>
                  {evidence.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {file.isImage && file.url ? (
                          <img
                            src={file.url}
                            className="w-8 h-8 object-cover rounded"
                            alt="preview"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-accent" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary text-sm font-medium truncate">
                            {file.name || "Document"}
                          </p>
                          <p className="text-xs text-text-muted">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.url && (
                          <>
                            <button
                              onClick={() => openFile(file.url)}
                              className="p-1 text-blue-500 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={file.url}
                              download
                              className="p-1 text-text-muted hover:text-accent"
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
                className="btn-filled w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-accent mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Work Submitted:
              </p>
              {milestone.evidence.description && (
                <div className="mb-3">
                  <p className="text-xs text-text-muted mb-1">Description:</p>
                  <p className="text-sm text-text-secondary">
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
            <div className="text-xs text-accent/70 flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              <span>
                Completed on:{" "}
                {new Date(milestone.completedAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {milestone.feedback && (
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <p className="text-xs text-purple-600 mb-1">Mentor Feedback:</p>
              <p className="text-sm text-text-secondary">
                {milestone.feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MilestoneCard;
