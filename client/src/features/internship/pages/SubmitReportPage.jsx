import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useIntern } from "../../../hooks/useIntern";
import { useToast } from "../../../common/ui/Toast";
import { motion } from "framer-motion";
import {
  FileText,
  Send,
  ChevronLeft,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

const SubmitReportPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const {
    submitReport,
    fetchDashboard,
    loading: hookLoading,
    profile,
    progress,
    reports,
  } = useIntern();

  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [formData, setFormData] = useState({
    week: "",
    content: "",
    challenges: "",
    learnings: "",
    nextPlan: "",
    hoursWorked: "",
  });

  useEffect(() => {
    const loadData = async () => {
      await fetchDashboard();
    };
    loadData();
  }, []);

  useEffect(() => {
    // Calculate next week number based on existing reports
    if (reports && reports.length > 0) {
      // Get the highest week number from existing reports
      const submittedWeeks = reports.map((r) => r.week);
      const maxWeek = Math.max(...submittedWeeks);
      const nextWeek = maxWeek + 1;
      setCurrentWeek(nextWeek);
      setFormData((prev) => ({ ...prev, week: nextWeek }));
    } else {
      // No reports yet, start from week 1
      setCurrentWeek(1);
      setFormData((prev) => ({ ...prev, week: 1 }));
    }
  }, [reports]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitReport(formData);
      addToast("Weekly report submitted successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      addToast(error.message || "Failed to submit report", "error");
    } finally {
      setLoading(false);
    }
  };

  const reportsSubmitted = reports?.length || 0;
  const nextWeekNumber = currentWeek || 1;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6] py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6b7280] hover:text-[#111827] mb-6 transition group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-2xl border border-[#E5E7EB] p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#2563eb]" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827]">
              Submit Weekly Report
            </h1>
            <p className="text-[#6b7280] mt-2">
              Share your progress for this week
            </p>
          </div>

          {/* Internship Progress Card */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 mb-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">
                    Internship Progress
                  </p>
                  <p className="text-xs text-[#6b7280]">Week {nextWeekNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6b7280]" />
                <span className="text-xs text-[#6b7280]">
                  {reportsSubmitted} report{reportsSubmitted !== 1 ? "s" : ""}{" "}
                  submitted
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((reportsSubmitted / (reportsSubmitted + 1)) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-[#6b7280] mt-2">
              {reportsSubmitted === 0
                ? "First report - Welcome!"
                : `${reportsSubmitted} week${reportsSubmitted !== 1 ? "s" : ""} completed`}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300 font-medium">
                  Report Guidelines
                </p>
                <p className="text-xs text-blue-300/70 mt-1">
                  Be detailed about your tasks and accomplishments. Include
                  specific metrics when possible. Your advisor will review and
                  provide feedback.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Week Number - Auto-calculated, read-only */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Week Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="number"
                  name="week"
                  required
                  value={formData.week}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] opacity-75 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>
              <p className="text-xs text-[#6b7280] mt-1">
                Week number is automatically calculated based on your submitted
                reports
              </p>
            </div>

            {/* Work Content */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                What did you work on? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                required
                rows={5}
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                placeholder="Describe your tasks and accomplishments this week..."
              />
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Challenges faced
              </label>
              <textarea
                name="challenges"
                rows={3}
                value={formData.challenges}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                placeholder="Any obstacles you encountered?"
              />
            </div>

            {/* Key Learnings */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Key Learnings
              </label>
              <textarea
                name="learnings"
                rows={3}
                value={formData.learnings}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                placeholder="What new skills or knowledge did you gain?"
              />
            </div>

            {/* Next Week Plan */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Plan for next week
              </label>
              <textarea
                name="nextPlan"
                rows={3}
                value={formData.nextPlan}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                placeholder="What are your goals for next week?"
              />
            </div>

            {/* Hours Worked */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Hours worked this week <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="number"
                  name="hoursWorked"
                  required
                  value={formData.hoursWorked}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  placeholder="e.g., 40"
                  min="1"
                  max="168"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || hookLoading}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] font-medium shadow-md text-[#111827] py-3 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-xs text-[#6b7280] text-center mt-6">
            Your report will be reviewed by your advisor. You'll be notified
            once reviewed.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitReportPage;
