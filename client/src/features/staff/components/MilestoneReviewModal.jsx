import { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, Clock, Target, Send, Plus } from "lucide-react";
import { useToast } from "../../../components/ui/Toast";

const MilestoneReviewModal = ({
  participant,
  type,
  onClose,
  onReview,
  onAddMilestone,
}) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const milestones = participant.milestones || [];
  const pendingMilestones = milestones.filter(
    (m) => m.status === "pending" || m.status === "in_progress",
  );

  const handleReview = async () => {
    if (!selectedMilestone) {
      addToast("Please select a milestone", "error");
      return;
    }
    if (!status) {
      addToast("Please select status", "error");
      return;
    }

    setLoading(true);
    try {
      await onReview(
        participant.user?._id,
        selectedMilestone._id,
        status,
        feedback,
      );
      addToast(`Milestone marked as ${status}!`, "success");
      setSelectedMilestone(null);
      setFeedback("");
      setStatus("");
    } catch (error) {
      addToast(error.message || "Failed to review milestone", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title) {
      addToast("Please enter milestone title", "error");
      return;
    }

    setLoading(true);
    try {
      await onAddMilestone(participant.user?._id, newMilestone);
      addToast("Milestone added!", "success");
      setShowAddForm(false);
      setNewMilestone({ title: "", description: "", dueDate: "" });
    } catch (error) {
      addToast(error.message || "Failed to add milestone", "error");
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
        className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl"
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90">
          <div>
            <h2 className="text-xl font-bold text-white">
              {type === "innovator"
                ? "Review Innovator Milestones"
                : "Review Startup Milestones"}
            </h2>
            <p className="text-sm text-gray-400">
              {type === "innovator"
                ? participant.user?.fullName
                : participant.companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Pending Milestones */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Pending Milestones ({pendingMilestones.length})
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Milestone
              </button>
            </div>

            {showAddForm && (
              <div className="mb-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600 space-y-3">
                <input
                  type="text"
                  placeholder="Milestone title *"
                  value={newMilestone.title}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
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
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
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
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                />
                <button
                  onClick={handleAddMilestone}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition"
                >
                  Add Milestone
                </button>
              </div>
            )}

            <div className="space-y-2">
              {pendingMilestones.map((milestone) => (
                <div
                  key={milestone._id}
                  onClick={() => setSelectedMilestone(milestone)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedMilestone?._id === milestone._id
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700 hover:border-gray-600 bg-gray-700/30"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">
                        {milestone.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {milestone.description}
                      </p>
                      {milestone.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        milestone.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {milestone.status === "in_progress"
                        ? "In Progress"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
              {pendingMilestones.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  All milestones completed!
                </p>
              )}
            </div>
          </div>

          {/* Review Form */}
          {selectedMilestone && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Review: {selectedMilestone.title}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status *
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStatus("completed")}
                      className={`flex-1 px-4 py-2 rounded-lg transition ${
                        status === "completed"
                          ? "bg-green-600 text-white"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" /> Completed
                    </button>
                    <button
                      onClick={() => setStatus("in_progress")}
                      className={`flex-1 px-4 py-2 rounded-lg transition ${
                        status === "in_progress"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-2" /> In Progress
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                    placeholder="Provide feedback on this milestone..."
                  />
                </div>

                <button
                  onClick={handleReview}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MilestoneReviewModal;
