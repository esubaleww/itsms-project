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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-700"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Request Staff</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Position *
            </label>
            <select
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
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
            <label className="block text-sm font-medium text-gray-300 mb-1">
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
                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="Add skill..."
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Reason *
            </label>
            <textarea
              rows={3}
              required
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              placeholder="Why do you need additional staff?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
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
                        ? "bg-red-500/20 text-red-400 ring-2 ring-red-500"
                        : urgency === "high"
                          ? "bg-orange-500/20 text-orange-400 ring-2 ring-orange-500"
                          : urgency === "medium"
                            ? "bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500"
                            : "bg-gray-500/20 text-gray-400 ring-2 ring-gray-500"
                      : "bg-gray-700/30 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {urgency}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
