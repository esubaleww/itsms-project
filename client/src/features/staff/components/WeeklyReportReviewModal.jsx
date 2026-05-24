import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Star,
  Send,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useToast } from "../../../common/ui/Toast";

const WeeklyReportReviewModal = ({ intern, reports, onClose, onReview }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (reports && reports.length > 0) {
      const pending = reports.find((r) => r.status === "submitted");
      if (pending) {
        setSelectedReport(pending);
      }
    }
  }, [reports]);

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
    } catch (error) {
      addToast(error.message || "Failed to review report", "error");
    } finally {
      setLoading(false);
    }
  };

  const pendingReports = reports?.filter((r) => r.status === "submitted") || [];
  const reviewedReports = reports?.filter((r) => r.status === "reviewed") || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-heading font-medium text-text-primary">
              Review Weekly Reports
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-medium text-text-primary mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Pending Reports ({pendingReports.length})
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {pendingReports.map((report) => (
                    <div
                      key={report.week}
                      onClick={() => setSelectedReport(report)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        selectedReport?.week === report.week
                          ? "border-accent bg-blue-50"
                          : "border-gray-200 hover:shadow-md hover:-translate-y-0.5 bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-text-primary">
                            Week {report.week}
                          </p>
                          <p className="text-xs text-text-muted mt-1 line-clamp-2">
                            {report.content}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted" />
                      </div>
                    </div>
                  ))}
                  {pendingReports.length === 0 && (
                    <p className="text-text-muted text-center py-4">
                      No pending reports
                    </p>
                  )}
                </div>
              </div>

              {reviewedReports.length > 0 && (
                <div>
                  <h3 className="text-lg font-heading font-medium text-text-primary mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    Reviewed Reports ({reviewedReports.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {reviewedReports.map((report) => (
                      <div
                        key={report.week}
                        className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-text-secondary">
                              Week {report.week}
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                              Rating: {report.rating}/5
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-50 text-accent rounded-full">
                            Reviewed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {selectedReport ? (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-heading font-medium text-text-primary">
                        Week {selectedReport.week} Report
                      </h3>
                      <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full">
                        Pending Review
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-accent" />
                          What I did
                        </p>
                        <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
                          <p className="text-text-primary text-sm whitespace-pre-wrap">
                            {selectedReport.content || "No content"}
                          </p>
                        </div>
                      </div>

                      {selectedReport.challenges && (
                        <div>
                          <p className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            Challenges
                          </p>
                          <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
                            <p className="text-text-primary text-sm">
                              {selectedReport.challenges}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedReport.learnings && (
                        <div>
                          <p className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4 text-accent" />
                            Learnings
                          </p>
                          <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
                            <p className="text-text-primary text-sm">
                              {selectedReport.learnings}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedReport.nextPlan && (
                        <div>
                          <p className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            Next Plan
                          </p>
                          <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200">
                            <p className="text-text-primary text-sm">
                              {selectedReport.nextPlan}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Hours:{" "}
                          {selectedReport.hoursWorked || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{" "}
                          {new Date(
                            selectedReport.submittedAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
                      Review Report
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Feedback *
                        </label>
                        <textarea
                          rows={4}
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                          placeholder="Provide detailed feedback..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Rating *
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className={`p-1 rounded-lg transition ${rating >= star ? "text-yellow-400" : "text-text-muted"}`}
                            >
                              <Star className="w-6 h-6 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={handleReview}
                        disabled={loading}
                        className="btn-filled w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Submit Review
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-xl">
                  <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted">Select a report to review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeeklyReportReviewModal;
