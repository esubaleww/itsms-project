import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Send,
  MessageSquare,
  Paperclip,
  FileText,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import DocumentItem from "../../../common/components/DocumentItem";
import { DocumentUpload } from "../../../common/components/DocumentUpload";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-400",
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-500/20 text-blue-400",
    icon: AlertCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500/20 text-emerald-400",
    icon: CheckCircle,
  },
};

const MilestoneReviewModal = ({
  participant,
  type,
  onClose,
  onReview,
  onAddMilestone,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    files: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const milestones = participant?.milestones || [];
  const participantName =
    type === "innovator"
      ? participant?.mentee?.fullName || participant?.user?.fullName
      : participant?.companyName || participant?.mentee?.fullName;

  const handleAddFeedback = async () => {
    if (!selectedMilestone || !feedback.trim()) return;
    setSubmitting(true);
    try {
      await onReview(participant.mentee._id, selectedMilestone._id, feedback);
      setSelectedMilestone(null);
      setFeedback("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUploadComplete = (uploadedFile) => {
    setNewMilestone({
      ...newMilestone,
      files: [...newMilestone.files, uploadedFile],
    });
  };

  const removeFile = (index) => {
    const newFiles = [...newMilestone.files];
    newFiles.splice(index, 1);
    setNewMilestone({ ...newMilestone, files: newFiles });
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title) return;
    setSubmitting(true);
    try {
      await onAddMilestone(participant.mentee._id, {
        title: newMilestone.title,
        description: newMilestone.description,
        dueDate: newMilestone.dueDate,
        files: newMilestone.files,
      });
      setNewMilestone({ title: "", description: "", dueDate: "", files: [] });
      setShowAddForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const openFile = (url) => {
    if (url) window.open(url, "_blank");
  };

  // Check if milestone is completed (mentee has submitted final work)
  const isMilestoneCompleted = (milestone) => {
    return milestone.status === "completed";
  };

  // Check if milestone already has feedback
  const hasFeedback = (milestone) => {
    return milestone.feedback && milestone.feedback.trim().length > 0;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-700 shadow-2xl"
      >
        <div className="sticky top-0 bg-gray-800/95 border-b border-gray-700 p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Milestones - {participantName}
              </h2>
              <p className="text-xs text-gray-400">
                {type === "innovator" ? "Innovator" : "Startup"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 border border-dashed border-emerald-500/50 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Milestone
            </button>
          ) : (
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700 space-y-4">
              <h3 className="text-sm font-semibold text-white">
                Add Milestone
              </h3>

              <input
                type="text"
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />

              <textarea
                placeholder="Description"
                rows={2}
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />

              <input
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    dueDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />

              {/* Document Upload for Resources */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Attach Resources (Optional)
                </label>
                <DocumentUpload
                  label="Upload Resource"
                  value={null}
                  onChange={handleFileUploadComplete}
                  maxSizeMB={10}
                />

                {newMilestone.files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-400">Attached Resources:</p>
                    {newMilestone.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-700/30 rounded-lg p-2 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-sm text-white truncate">
                            {file.name || "Resource File"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {file.url && (
                            <>
                              <button
                                onClick={() => openFile(file.url)}
                                className="text-blue-400 hover:text-blue-300"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={file.url}
                                download
                                className="text-gray-400 hover:text-emerald-400"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </>
                          )}
                          <button
                            onClick={() => removeFile(idx)}
                            className="text-red-400 hover:text-red-300"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewMilestone({
                      title: "",
                      description: "",
                      dueDate: "",
                      files: [],
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMilestone}
                  disabled={!newMilestone.title || submitting}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Milestone
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">
              Existing Milestones
            </h3>
            {milestones.length === 0 ? (
              <div className="text-center py-8 bg-gray-700/30 rounded-xl">
                <Target className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No milestones yet</p>
              </div>
            ) : (
              milestones.map((milestone, idx) => {
                const status =
                  statusConfig[milestone.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const isSelected = selectedMilestone?._id === milestone._id;
                const hasEvidence =
                  milestone.evidence && milestone.evidence.files?.length > 0;
                const completed = isMilestoneCompleted(milestone);
                const alreadyHasFeedback = hasFeedback(milestone);

                return (
                  <div
                    key={milestone._id}
                    className={`bg-gray-700/30 rounded-lg border ${
                      isSelected ? "border-emerald-500" : "border-gray-700"
                    } overflow-hidden transition-all`}
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-700/20"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedMilestone(null);
                          setFeedback("");
                        } else {
                          setSelectedMilestone(milestone);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-white">
                              Milestone {idx + 1}: {milestone.title}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {milestone.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            {milestone.dueDate && (
                              <p className="text-xs text-gray-500">
                                Due:{" "}
                                {new Date(
                                  milestone.dueDate,
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {hasEvidence && (
                              <p className="text-xs text-emerald-400 flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                Evidence submitted
                              </p>
                            )}
                            {alreadyHasFeedback && (
                              <p className="text-xs text-purple-400 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                Feedback given
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-700 space-y-3">
                        {/* Evidence Section */}
                        {hasEvidence && (
                          <div className="bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-emerald-400 mb-2 flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              Evidence Submitted by Mentee:
                            </p>
                            {milestone.evidence.description && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-400 mb-1">
                                  Description:
                                </p>
                                <p className="text-sm text-gray-300">
                                  {milestone.evidence.description}
                                </p>
                              </div>
                            )}
                            {milestone.evidence.submittedAt && (
                              <p className="text-xs text-gray-500 mb-2">
                                Submitted on:{" "}
                                {new Date(
                                  milestone.evidence.submittedAt,
                                ).toLocaleDateString()}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mb-2">
                              Attached Files:
                            </p>
                            <div className="space-y-2">
                              {milestone.evidence.files.map((file, fileIdx) => (
                                <DocumentItem
                                  key={fileIdx}
                                  file={file}
                                  label={file.name || "Evidence File"}
                                  showDownload={true}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Existing Feedback */}
                        {alreadyHasFeedback && (
                          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                            <p className="text-xs text-purple-400 mb-1">
                              Previous Feedback:
                            </p>
                            <p className="text-sm text-gray-300">
                              {milestone.feedback}
                            </p>
                            {milestone.feedbackGivenAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Given on:{" "}
                                {new Date(
                                  milestone.feedbackGivenAt,
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Add New Feedback - ONLY show when milestone is COMPLETED */}
                        {completed && !alreadyHasFeedback && (
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">
                              Add Feedback
                            </label>
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              rows={3}
                              placeholder="Add feedback for the mentee's completed work..."
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              onClick={handleAddFeedback}
                              disabled={!feedback.trim() || submitting}
                              className="w-full mt-3 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {submitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <>
                                  <MessageSquare className="w-4 h-4" />
                                  Submit Feedback
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Show message when milestone is not completed */}
                        {!completed && (
                          <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                            <p className="text-xs text-yellow-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Waiting for mentee to complete this milestone
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Feedback can only be given after the mentee marks
                              this milestone as completed and submits their
                              work.
                            </p>
                          </div>
                        )}

                        {/* Show message when feedback already given */}
                        {completed && alreadyHasFeedback && (
                          <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Feedback already provided for this milestone
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-800/95 border-t border-gray-700 p-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MilestoneReviewModal;
