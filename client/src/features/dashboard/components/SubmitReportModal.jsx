// client/src/features/dashboard/components/SubmitReportModal.jsx
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
  Save,
} from "lucide-react";

const SubmitReportModal = ({ onClose, onSubmit, formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [achievementInput, setAchievementInput] = useState("");
  const [challengeInput, setChallengeInput] = useState("");
  const [nextStepInput, setNextStepInput] = useState("");

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
        achievements: [...formData.achievements, achievementInput.trim()],
      });
      setAchievementInput("");
    }
  };

  const removeAchievement = (index) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index),
    });
  };

  const addChallenge = () => {
    if (challengeInput.trim()) {
      setFormData({
        ...formData,
        challenges: [...formData.challenges, challengeInput.trim()],
      });
      setChallengeInput("");
    }
  };

  const removeChallenge = (index) => {
    setFormData({
      ...formData,
      challenges: formData.challenges.filter((_, i) => i !== index),
    });
  };

  const addNextStep = () => {
    if (nextStepInput.trim()) {
      setFormData({
        ...formData,
        nextSteps: [...formData.nextSteps, nextStepInput.trim()],
      });
      setNextStepInput("");
    }
  };

  const removeNextStep = (index) => {
    setFormData({
      ...formData,
      nextSteps: formData.nextSteps.filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Submit Directorate Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5" id="report-form">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Report Title <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                    errors.title ? "border-red-500" : "border-gray-600"
                  }`}
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Monthly Report - March 2026"
                />
              </div>
              {errors.title && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    required
                    className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                      errors.startDate ? "border-red-500" : "border-gray-600"
                    }`}
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                </div>
                {errors.startDate && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    required
                    className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                      errors.endDate ? "border-red-500" : "border-gray-600"
                    }`}
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                  />
                </div>
                {errors.endDate && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Summary <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows="4"
                className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-y ${
                  errors.summary ? "border-red-500" : "border-gray-600"
                }`}
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="Overall summary of the reporting period..."
              />
              {errors.summary && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.summary}
                </p>
              )}
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <TrendingUp className="inline w-4 h-4 mr-1 text-emerald-400" />
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
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="e.g., Completed 5 projects"
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.achievements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.achievements.map((item, index) => (
                    <span
                      key={index}
                      className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-emerald-500/30"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <TrendingDown className="inline w-4 h-4 mr-1 text-red-400" />
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
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="e.g., Staff shortage"
                />
                <button
                  type="button"
                  onClick={addChallenge}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.challenges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.challenges.map((item, index) => (
                    <span
                      key={index}
                      className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-red-500/30"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeChallenge(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <ArrowRight className="inline w-4 h-4 mr-1 text-blue-400" />
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
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="e.g., Hire new staff"
                />
                <button
                  type="button"
                  onClick={addNextStep}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.nextSteps.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.nextSteps.map((item, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-500/30"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeNextStep(index)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Buttons */}
        <div className="p-5 border-t border-gray-700 bg-gray-800/90 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="submit"
              form="report-form"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
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
              className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200"
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
