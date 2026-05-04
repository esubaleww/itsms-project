import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, AlertCircle } from "lucide-react";

const MentorFinalReviewModal = ({ mentee, type, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    overallProgress: "",
    strengths: "",
    areasForImprovement: "",
    recommendation: "",
    comments: "",
    milestonesCompleted: 0,
    investmentReadiness: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.overallProgress.trim())
      newErrors.overallProgress = "Overall progress is required";
    if (!formData.recommendation.trim())
      newErrors.recommendation = "Recommendation is required";
    if (type === "startup" && !formData.investmentReadiness) {
      newErrors.investmentReadiness = "Investment readiness is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const strengthsArray = formData.strengths
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      const areasArray = formData.areasForImprovement
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);

      const submitData = {
        overallProgress: formData.overallProgress,
        strengths: strengthsArray,
        areasForImprovement: areasArray,
        recommendation: formData.recommendation,
        comments: formData.comments,
      };

      if (type === "startup") {
        submitData.investmentReadiness = formData.investmentReadiness;
        submitData.milestonesCompleted = formData.milestonesCompleted;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Failed to submit final review:", error);
    } finally {
      setLoading(false);
    }
  };

  const menteeName =
    type === "innovator"
      ? mentee?.fullName || mentee?.mentee?.fullName || "Unknown"
      : mentee?.companyName || mentee?.mentee?.fullName || "Unknown";

  const totalMilestones = mentee?.milestones?.length || 0;
  const completedMilestones =
    mentee?.milestones?.filter((m) => m.status === "completed").length || 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl"
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div>
            <h2 className="text-xl font-bold text-white">
              Final Review - {type === "innovator" ? "Innovator" : "Startup"}
            </h2>
            <p className="text-sm text-gray-400">{menteeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Overall Progress <span className="text-red-400">*</span>
              </label>
              <select
                name="overallProgress"
                value={formData.overallProgress}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select progress level</option>
                <option value="Excellent">
                  Excellent - Exceeded expectations
                </option>
                <option value="Good">Good - Met all expectations</option>
                <option value="Satisfactory">
                  Satisfactory - Met most expectations
                </option>
                <option value="Needs Improvement">
                  Needs Improvement - Below expectations
                </option>
                <option value="Poor">
                  Poor - Significantly below expectations
                </option>
              </select>
              {errors.overallProgress && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.overallProgress}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Strengths (comma separated)
              </label>
              <textarea
                name="strengths"
                rows={2}
                value={formData.strengths}
                onChange={handleChange}
                placeholder="e.g., Technical skills, Leadership, Problem solving"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple strengths with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Areas for Improvement (comma separated)
              </label>
              <textarea
                name="areasForImprovement"
                rows={2}
                value={formData.areasForImprovement}
                onChange={handleChange}
                placeholder="e.g., Time management, Communication, Documentation"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple areas with commas
              </p>
            </div>

            {type === "startup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Milestones Completed
                  </label>
                  <input
                    type="number"
                    name="milestonesCompleted"
                    value={formData.milestonesCompleted}
                    onChange={handleChange}
                    min="0"
                    max={totalMilestones}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total milestones: {totalMilestones} | Completed:{" "}
                    {completedMilestones}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Investment Readiness <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="investmentReadiness"
                    value={formData.investmentReadiness}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select readiness level</option>
                    <option value="Not Ready">
                      Not Ready - Needs significant work
                    </option>
                    <option value="Early Stage">
                      Early Stage - Some potential
                    </option>
                    <option value="Investment Ready">
                      Investment Ready - Ready for funding
                    </option>
                    <option value="Funded">
                      Funded - Already secured investment
                    </option>
                  </select>
                  {errors.investmentReadiness && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.investmentReadiness}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Recommendation <span className="text-red-400">*</span>
              </label>
              <select
                name="recommendation"
                value={formData.recommendation}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select recommendation</option>
                <option value="Graduate">Graduate from program</option>
                <option value="Extend">Extend incubation period</option>
                <option value="Conditional">Conditional continuation</option>
                <option value="Terminate">Terminate from program</option>
              </select>
              {errors.recommendation && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.recommendation}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Additional Comments
              </label>
              <textarea
                name="comments"
                rows={3}
                value={formData.comments}
                onChange={handleChange}
                placeholder="Any additional feedback..."
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-700 bg-gray-800/90 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Submit Final Review
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MentorFinalReviewModal;
