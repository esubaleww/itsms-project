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
    color: "bg-[#EEF2FF] text-[#2563eb]",
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

  const isMilestoneCompleted = (milestone) => {
    return milestone.status === "completed";
  };

  const hasFeedback = (milestone) => {
    return milestone.feedback && milestone.feedback.trim().length > 0;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E7EB] shadow-2xl"
      >
        <div className="sticky top-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/95 border-b border-[#E5E7EB] p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#2563eb]/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#111827]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">
                Milestones - {participantName}
              </h2>
              <p className="text-xs text-[#6b7280]">
                {type === "innovator" ? "Innovator" : "Startup"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-institutional w-full py-3"
            >
              <Plus className="w-4 h-4" />
              Add New Milestone
            </button>
          ) : (
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 border border-[#E5E7EB] space-y-4">
              <h3 className="text-sm font-semibold text-[#111827]">
                Add Milestone
              </h3>

              <input
                type="text"
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
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
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
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
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb]"
              />

              <div>
                <label className="block text-xs text-[#6b7280] mb-2">
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
                    <p className="text-xs text-[#6b7280]">Attached Resources:</p>
                    {newMilestone.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-2 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-[#2563eb] shrink-0" />
                          <span className="text-sm text-[#111827] truncate">
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
                                className="text-[#6b7280] hover:text-[#2563eb]"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </>
                          )}
                          <button
                            onClick={() => removeFile(idx)}
                            className="text-red-500 hover:text-red-600"
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
                  className="flex-1 px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMilestone}
                  disabled={!newMilestone.title || submitting}
                  className="btn-institutional flex-1 py-2 disabled:opacity-50"
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
            <h3 className="text-sm font-semibold text-[#111827]">
              Existing Milestones
            </h3>
            {milestones.length === 0 ? (
              <div className="text-center py-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
                <Target className="w-10 h-10 text-[#9ca3af] mx-auto mb-2" />
                <p className="text-[#6b7280] text-sm">No milestones yet</p>
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
                    className={`bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg border ${
                      isSelected ? "border-[#2563eb]" : "border-[#E5E7EB]"
                    } overflow-hidden transition-all`}
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-[#F3F4F6]/20"
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
                            <span className="font-medium text-[#111827]">
                              Milestone {idx + 1}: {milestone.title}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-[#6b7280]">
                            {milestone.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            {milestone.dueDate && (
                              <p className="text-xs text-[#6b7280]">
                                Due:{" "}
                                {new Date(
                                  milestone.dueDate,
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {hasEvidence && (
                              <p className="text-xs text-[#2563eb] flex items-center gap-1">
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
                      <div className="px-4 pb-4 pt-2 border-t border-[#E5E7EB] space-y-3">
                        {hasEvidence && (
                          <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-lg p-3">
                            <p className="text-xs text-[#2563eb] mb-2 flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              Evidence Submitted by Mentee:
                            </p>
                            {milestone.evidence.description && (
                              <div className="mb-3">
                                <p className="text-xs text-[#6b7280] mb-1">
                                  Description:
                                </p>
                                <p className="text-sm text-[#374151]">
                                  {milestone.evidence.description}
                                </p>
                              </div>
                            )}
                            {milestone.evidence.submittedAt && (
                              <p className="text-xs text-[#6b7280] mb-2">
                                Submitted on:{" "}
                                {new Date(
                                  milestone.evidence.submittedAt,
                                ).toLocaleDateString()}
                              </p>
                            )}
                            <p className="text-xs text-[#6b7280] mb-2">
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

                        {alreadyHasFeedback && (
                          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                            <p className="text-xs text-purple-400 mb-1">
                              Previous Feedback:
                            </p>
                            <p className="text-sm text-[#374151]">
                              {milestone.feedback}
                            </p>
                            {milestone.feedbackGivenAt && (
                              <p className="text-xs text-[#6b7280] mt-1">
                                Given on:{" "}
                                {new Date(
                                  milestone.feedbackGivenAt,
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                        {completed && !alreadyHasFeedback && (
                          <div>
                            <label className="text-xs text-[#6b7280] block mb-1">
                              Add Feedback
                            </label>
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              rows={3}
                              placeholder="Add feedback for the mentee's completed work..."
                              className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] text-sm focus:outline-none focus:border-[#2563eb]"
                            />
                            <button
                              onClick={handleAddFeedback}
                              disabled={!feedback.trim() || submitting}
                              className="btn-institutional w-full mt-3 py-2 disabled:opacity-50"
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

                        {!completed && (
                          <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                            <p className="text-xs text-yellow-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Waiting for mentee to complete this milestone
                            </p>
                            <p className="text-sm text-[#6b7280] mt-1">
                              Feedback can only be given after the mentee marks
                              this milestone as completed and submits their
                              work.
                            </p>
                          </div>
                        )}

                        {completed && alreadyHasFeedback && (
                          <div className="bg-[#EEF2FF] rounded-lg p-3 border border-[#2563eb]/20">
                            <p className="text-xs text-[#2563eb] flex items-center gap-1">
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

        <div className="sticky bottom-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]/95 border-t border-[#E5E7EB] p-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MilestoneReviewModal;
