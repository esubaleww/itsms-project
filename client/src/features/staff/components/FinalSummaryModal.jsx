import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, Award, CheckCircle } from "lucide-react";
import { useToast } from "../../../common/ui/Toast";

const FinalSummaryModal = ({ intern, onSubmitSummary, onClose }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState({
    overallPerformance: "",
    strengths: "",
    weaknesses: "",
    recommendation: "",
    comments: "",
  });

  const handleSubmit = async () => {
    if (!summaryData.overallPerformance) {
      addToast("Please select overall performance", "error");
      return;
    }
    if (!summaryData.recommendation) {
      addToast("Please select recommendation", "error");
      return;
    }

    setLoading(true);
    try {
      await onSubmitSummary(intern._id, summaryData);
      addToast("Final summary submitted to director!", "success");
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to submit summary", "error");
    } finally {
      setLoading(false);
    }
  };

  const hasSubmitted = intern.advisorSummary?.submitted;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl"
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800/90 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">
              Final Summary Report
            </h2>
            <p className="text-sm text-gray-400">
              {intern.intern?.fullName || intern.fullName} •{" "}
              {intern.university?.name || "University"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
            <div className="text-center mb-6">
              <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white">
                End of Internship Summary
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Complete this form at the end of the internship period
              </p>
              {hasSubmitted && (
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                  <CheckCircle className="w-3 h-3" />
                  Summary already submitted
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Overall Performance *
                </label>
                <select
                  value={summaryData.overallPerformance}
                  onChange={(e) =>
                    setSummaryData({
                      ...summaryData,
                      overallPerformance: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="needs_improvement">Needs Improvement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recommendation *
                </label>
                <select
                  value={summaryData.recommendation}
                  onChange={(e) =>
                    setSummaryData({
                      ...summaryData,
                      recommendation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select</option>
                  <option value="hire">
                    Hire - Strongly recommend for employment
                  </option>
                  <option value="consider">Consider - With reservations</option>
                  <option value="do_not_hire">
                    Do Not Hire - Not recommended
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Strengths
                </label>
                <textarea
                  rows={3}
                  value={summaryData.strengths}
                  onChange={(e) =>
                    setSummaryData({
                      ...summaryData,
                      strengths: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  placeholder="Key strengths observed during the internship..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Areas for Improvement
                </label>
                <textarea
                  rows={3}
                  value={summaryData.weaknesses}
                  onChange={(e) =>
                    setSummaryData({
                      ...summaryData,
                      weaknesses: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  placeholder="Areas where improvement is needed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Comments
                </label>
                <textarea
                  rows={3}
                  value={summaryData.comments}
                  onChange={(e) =>
                    setSummaryData({ ...summaryData, comments: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  placeholder="Any additional comments for the director..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || hasSubmitted}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Final Summary
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinalSummaryModal;
