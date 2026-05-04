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
  Send,
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
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: AlertCircle,
    nextStatus: "completed",
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
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

  const handleSubmitEvidence = async () => {
    if (!evidence.description.trim()) {
      alert("Please provide a description of your work");
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
      className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
    >
      <div
        className="p-4 cursor-pointer hover:bg-gray-700/20 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-white">
                  Milestone {index + 1}: {milestone.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                {milestone.description}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-700 space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-sm text-gray-300">{milestone.description}</p>
          </div>

          {/* Show Mentor Resources if available */}
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
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                Due: {new Date(milestone.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {milestone.status === "pending" && (
            <button
              onClick={handleStartWorking}
              disabled={updating}
              className="w-full py-2 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
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
              onClick={() => setShowEvidenceForm(true)}
              className="w-full py-2 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            >
              <Upload className="w-4 h-4" />
              Submit Work for Review
            </button>
          )}

          {showEvidenceForm && (
            <div className="space-y-3 bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-white">
                  Submit Your Work
                </h4>
                <button
                  onClick={() => {
                    setShowEvidenceForm(false);
                    setEvidence({ description: "", files: [] });
                  }}
                  className="text-gray-400 hover:text-white"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
              />

              <DocumentUpload
                label="Upload Evidence"
                value={null}
                onChange={handleFileUploadComplete}
                maxSizeMB={10}
              />

              {evidence.files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Attached Files:</p>
                  {evidence.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-700/30 rounded-lg p-3 flex items-center justify-between border border-gray-600"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {file.isImage && file.url ? (
                          <img
                            src={file.url}
                            className="w-8 h-8 object-cover rounded"
                            alt="preview"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-emerald-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {file.name || "Document"}
                          </p>
                          <p className="text-xs text-gray-400">
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
                              className="p-1 text-gray-400 hover:text-emerald-400"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </>
                        )}
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleSubmitEvidence}
                disabled={!evidence.description.trim() || uploading}
                className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          )}

          {/* Show Submitted Evidence using DocumentItem */}
          {milestone.status === "completed" && milestone.evidence && (
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-emerald-400 mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Work Submitted:
              </p>
              {milestone.evidence.description && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">Description:</p>
                  <p className="text-sm text-gray-300">
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
            <div className="text-xs text-emerald-400/70 flex items-center gap-2">
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
              <p className="text-sm text-gray-300">{milestone.feedback}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MilestoneCard;
