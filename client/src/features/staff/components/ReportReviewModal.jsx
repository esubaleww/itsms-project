// client/src/features/staff/components/ReportReviewModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Star, Send, FileText, Calendar, Clock, User } from "lucide-react";
import { useToast } from "../../../components/ui/Toast";
import { advisorService } from "../../../services/advisor.service";

const ReportReviewModal = ({ intern, onClose, onReview, onSubmitSummary }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [summaryData, setSummaryData] = useState({
    overallPerformance: "",
    strengths: "",
    weaknesses: "",
    recommendation: "",
    comments: "",
  });

  useEffect(() => {
    loadReports();
  }, [intern._id]);

  const loadReports = async () => {
    try {
      const data = await advisorService.getInternReports(intern._id);
      setReports(data.reports || []);
    } catch (error) {
      addToast("Failed to load reports", "error");
    }
  };

  const handleReview = async () => {
    if (!selectedReport) {
      addToast("Please select a report to review", "error");
      return;
    }
    if (!feedback) {
      addToast("Please provide feedback", "error");
      return;
    }
    if (rating === 0) {
      addToast("Please provide a rating", "error");
      return;
    }

    setLoading(true);
    try {
      await onReview(intern._id, selectedReport.week, feedback, rating);
      addToast("Report reviewed successfully!", "success");
      setSelectedReport(null);
      setFeedback("");
      setRating(0);
      await loadReports();
    } catch (error) {
      addToast(error.message || "Failed to review report", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSummary = async () => {
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
      addToast("Summary submitted to director!", "success");
      onClose();
    } catch (error) {
      addToast(error.message || "Failed to submit summary", "error");
    } finally {
      setLoading(false);
    }
  };

  const pendingReports = reports.filter((r) => r.status === "submitted");

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
              Review Intern Reports
            </h2>
            <p className="text-sm text-gray-400">
              {intern.intern?.fullName || intern.fullName}
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
          {/* Pending Reports Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Pending Reports ({pendingReports.length})
            </h3>
            <div className="space-y-2">
              {pendingReports.map((report) => (
                <div
                  key={report.week}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedReport?.week === report.week
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700 hover:border-gray-600 bg-gray-700/30"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">
                        Week {report.week}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {report.content}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                      Pending Review
                    </span>
                  </div>
                </div>
              ))}
              {pendingReports.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  No pending reports
                </p>
              )}
            </div>
          </div>

          {/* Review Form */}
          {selectedReport && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Review Week {selectedReport.week}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Feedback *
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Provide feedback on the report..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 rounded-lg transition ${
                          rating >= star ? "text-yellow-400" : "text-gray-500"
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
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

          {/* Final Summary Section */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Final Summary (End of Internship)
            </h3>
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
                  Strengths
                </label>
                <textarea
                  rows={2}
                  value={summaryData.strengths}
                  onChange={(e) =>
                    setSummaryData({
                      ...summaryData,
                      strengths: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  placeholder="Key strengths observed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Areas for Improvement
                </label>
                <textarea
                  rows={2}
                  value={summaryData.weaknesses}
                  onChange={(e) =>
                    setSummaryData({
                      ...summaryData,
                      weaknesses: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  placeholder="Areas needing improvement..."
                />
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
                  <option value="hire">Hire - Strongly recommend</option>
                  <option value="consider">Consider - With reservations</option>
                  <option value="do_not_hire">
                    Do Not Hire - Not recommended
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Comments
                </label>
                <textarea
                  rows={2}
                  value={summaryData.comments}
                  onChange={(e) =>
                    setSummaryData({ ...summaryData, comments: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  placeholder="Any additional comments for the director..."
                />
              </div>

              <button
                onClick={handleSubmitSummary}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Summary to Director
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportReviewModal;
