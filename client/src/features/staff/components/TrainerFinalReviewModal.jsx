import { useState } from "react";
import { motion } from "framer-motion";
import { X, Award } from "lucide-react";

const TrainerFinalReviewModal = ({ trainee, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    overallPerformance: "",
    skillsAcquired: [],
    certificationRecommended: false,
    recommendation: "",
    comments: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addSkill = () => {
    if (
      skillInput.trim() &&
      !formData.skillsAcquired.includes(skillInput.trim())
    ) {
      setFormData({
        ...formData,
        skillsAcquired: [...formData.skillsAcquired, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skillsAcquired: formData.skillsAcquired.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        overallPerformance:
          formData.overallPerformance.charAt(0).toUpperCase() +
          formData.overallPerformance.slice(1),
      });
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-[#E5E7EB] shadow-2xl"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Final Trainee Review
            </h2>
            <p className="text-sm text-[#6b7280]">
              {trainee?.trainee?.fullName || trainee?.fullName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Overall Performance
            </label>
            <select
              required
              value={formData.overallPerformance}
              onChange={(e) =>
                setFormData({ ...formData, overallPerformance: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-purple-500"
            >
              <option value="">Select performance</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Skills Acquired
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                placeholder="Add a skill..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-purple-600 text-[#111827] rounded-lg hover:bg-purple-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsAcquired.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-purple-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Recommendation
            </label>
            <textarea
              rows="3"
              value={formData.recommendation}
              onChange={(e) =>
                setFormData({ ...formData, recommendation: e.target.value })
              }
              placeholder="Recommendation for the trainee..."
              className="w-full px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="certificationRecommended"
              checked={formData.certificationRecommended}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  certificationRecommended: e.target.checked,
                })
              }
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label
              htmlFor="certificationRecommended"
              className="text-sm text-[#374151]"
            >
              Recommend for Certification
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Additional Comments
            </label>
            <textarea
              rows="4"
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Any additional feedback or comments..."
              className="w-full px-3 py-2 bg-gray-700 border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#F3F4F6] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-purple-600 text-[#111827] rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Final Review"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TrainerFinalReviewModal;
