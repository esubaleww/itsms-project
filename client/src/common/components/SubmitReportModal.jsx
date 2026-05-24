import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  FileText,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Send,
  File,
  Eye,
  Download,
} from "lucide-react";
import { DocumentUpload } from "./DocumentUpload";

const SubmitReportModal = ({ onClose, onSubmit, formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [achievementInput, setAchievementInput] = useState("");
  const [challengeInput, setChallengeInput] = useState("");
  const [nextStepInput, setNextStepInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.summary?.trim()) newErrors.summary = "Summary is required";

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [
          ...(formData.achievements || []),
          achievementInput.trim(),
        ],
      });
      setAchievementInput("");
    }
  };

  const removeAchievement = (index) => {
    setFormData({
      ...formData,
      achievements: (formData.achievements || []).filter((_, i) => i !== index),
    });
  };

  const addChallenge = () => {
    if (challengeInput.trim()) {
      setFormData({
        ...formData,
        challenges: [...(formData.challenges || []), challengeInput.trim()],
      });
      setChallengeInput("");
    }
  };

  const removeChallenge = (index) => {
    setFormData({
      ...formData,
      challenges: (formData.challenges || []).filter((_, i) => i !== index),
    });
  };

  const addNextStep = () => {
    if (nextStepInput.trim()) {
      setFormData({
        ...formData,
        nextSteps: [...(formData.nextSteps || []), nextStepInput.trim()],
      });
      setNextStepInput("");
    }
  };

  const removeNextStep = (index) => {
    setFormData({
      ...formData,
      nextSteps: (formData.nextSteps || []).filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleFileUploadComplete = (uploadedFile) => {
    const newAttachments = [...(formData.attachments || []), uploadedFile];
    setFormData({ ...formData, attachments: newAttachments });
  };

  const removeFile = (index) => {
    const newAttachments = (formData.attachments || []).filter(
      (_, i) => i !== index,
    );
    setFormData({ ...formData, attachments: newAttachments });
  };

  const openFile = (url) => {
    if (url) window.open(url, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit();
      onClose();
    } catch (error) {
      console.error("Failed to submit report:", error);
    } finally {
      setLoading(false);
    }
  };

  const attachments = formData.attachments || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-lg border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 border border-accent/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-text-primary" />
            </div>
            <h2 className="text-xl font-heading font-medium text-text-primary">
              Submit Your Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5" id="report-form">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Report Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Monthly Report - March 2026"
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="date"
                    required
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.startDate || ""}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                </div>
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="date"
                    required
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.endDate || ""}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                  />
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="4"
                className={`w-full px-3 py-2 bg-white border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y ${
                  errors.summary ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.summary || ""}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="Overall summary of the reporting period..."
              />
              {errors.summary && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.summary}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <TrendingUp className="inline w-4 h-4 mr-1 text-accent" />
                Achievements
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addAchievement())
                  }
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="e.g., Completed 5 projects"
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {(formData.achievements || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.achievements || []).map((item, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-accent/30"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-accent hover:text-blue-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <TrendingDown className="inline w-4 h-4 mr-1 text-red-500" />
                Challenges
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={challengeInput}
                  onChange={(e) => setChallengeInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addChallenge())
                  }
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="e.g., Staff shortage"
                />
                <button
                  type="button"
                  onClick={addChallenge}
                  className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {(formData.challenges || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.challenges || []).map((item, index) => (
                    <span
                      key={index}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-red-500/30"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeChallenge(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <ArrowRight className="inline w-4 h-4 mr-1 text-blue-500" />
                Next Steps
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nextStepInput}
                  onChange={(e) => setNextStepInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addNextStep())
                  }
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="e.g., Hire new staff"
                />
                <button
                  type="button"
                  onClick={addNextStep}
                  className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {(formData.nextSteps || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.nextSteps || []).map((item, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-500/30"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeNextStep(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text-secondary">
                  <File className="inline w-4 h-4 mr-1 text-accent" />
                  Attachments
                </label>
                <button
                  type="button"
                  onClick={() => setShowUpload(!showUpload)}
                  className="text-xs text-accent hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Attachment
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2 mb-3">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {file.isImage && file.url ? (
                          <img
                            src={file.url}
                            className="w-8 h-8 object-cover rounded"
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
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showUpload && (
                <div className="mt-2">
                  <DocumentUpload
                    label="Upload Document"
                    value={null}
                    onChange={(file) => {
                      handleFileUploadComplete(file);
                      setShowUpload(false);
                    }}
                    maxSizeMB={10}
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="submit"
              form="report-form"
              disabled={loading}
              className="flex-1 bg-accent text-white hover:bg-accent/90 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-text-secondary py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmitReportModal;
