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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-heading font-medium text-text-primary flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Final Trainee Review
            </h2>
            <p className="text-sm text-text-muted">
              {trainee?.trainee?.fullName || trainee?.fullName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Overall Performance
            </label>
            <select
              required
              value={formData.overallPerformance}
              onChange={(e) =>
                setFormData({ ...formData, overallPerformance: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            >
              <option value="">Select performance</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
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
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsAcquired.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Recommendation
            </label>
            <textarea
              rows="3"
              value={formData.recommendation}
              onChange={(e) =>
                setFormData({ ...formData, recommendation: e.target.value })
              }
              placeholder="Recommendation for the trainee..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
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
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
            />
            <label
              htmlFor="certificationRecommended"
              className="text-sm text-text-secondary"
            >
              Recommend for Certification
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Additional Comments
            </label>
            <textarea
              rows="4"
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Any additional feedback or comments..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
