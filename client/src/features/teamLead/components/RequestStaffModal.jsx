import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, Briefcase, UserPlus } from "lucide-react";

const RequestStaffModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    position: "",
    skills: [],
    reason: "",
    urgency: "medium",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const positions = [
    "Technical Staff",
    "Trainer",
    "Advisor",
    "HR Officer",
    "Innovation Officer",
  ];

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-200"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-heading font-medium text-text-primary">
              Request Staff
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Position *
            </label>
            <select
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            >
              <option value="">Select position</option>
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Required Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="Add skill..."
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-filled px-3 py-2"
              >
                Add
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-50 text-accent px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-500"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Reason *
            </label>
            <textarea
              rows={3}
              required
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="Why do you need additional staff?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Urgency
            </label>
            <div className="flex gap-2">
              {["low", "medium", "high", "urgent"].map((urgency) => (
                <button
                  key={urgency}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition ${
                    formData.urgency === urgency
                      ? urgency === "urgent"
                        ? "bg-red-50 text-red-600 ring-2 ring-red-500"
                        : urgency === "high"
                          ? "bg-orange-50 text-orange-600 ring-2 ring-orange-500"
                          : urgency === "medium"
                            ? "bg-yellow-50 text-yellow-600 ring-2 ring-yellow-500"
                            : "bg-gray-100 text-text-muted ring-2 ring-gray-400"
                      : "bg-gray-50 border border-gray-200 text-text-muted hover:bg-gray-100"
                  }`}
                >
                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-filled w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Request
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RequestStaffModal;
