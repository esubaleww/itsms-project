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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-heading font-medium text-text-primary">
              Final Summary Report
            </h2>
            <p className="text-sm text-text-muted">
              {intern.intern?.fullName || intern.fullName} •{" "}
              {intern.university?.name || "University"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="text-center mb-6">
              <Award className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="text-xl font-heading font-medium text-text-primary">
                End of Internship Summary
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Complete this form at the end of the internship period
              </p>
              {hasSubmitted && (
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-accent rounded-full text-sm">
                  <CheckCircle className="w-3 h-3" />
                  Summary already submitted
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                >
                  <option value="">Select</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="needs_improvement">Needs Improvement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
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
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Key strengths observed during the internship..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Areas where improvement is needed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Additional Comments
                </label>
                <textarea
                  rows={3}
                  value={summaryData.comments}
                  onChange={(e) =>
                    setSummaryData({ ...summaryData, comments: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Any additional comments for the director..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || hasSubmitted}
                className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
