// client/src/features/intern/pages/SubmitReportPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useIntern } from "../../../hooks/useIntern";
import { useToast } from "../../../components/ui/Toast";
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
    // Calculate current week based on start date from profile
    if (profile?.placement?.startDate) {
      const startDate = new Date(profile.placement.startDate);
      const today = new Date();
      const diffWeeks = Math.floor(
        (today - startDate) / (1000 * 60 * 60 * 24 * 7),
      );
      const weekNumber = Math.min(diffWeeks + 1, progress?.totalWeeks || 12);
      setCurrentWeek(weekNumber > 0 ? weekNumber : 1);
      setFormData((prev) => ({
        ...prev,
        week: weekNumber > 0 ? weekNumber : 1,
      }));
    }

    // Get existing reports to determine next week number
    if (reports && reports.length > 0) {
      const lastReport = reports[reports.length - 1];
      const nextWeek = (lastReport.week || 0) + 1;
      if (nextWeek <= (progress?.totalWeeks || 12)) {
        setCurrentWeek(nextWeek);
        setFormData((prev) => ({ ...prev, week: nextWeek }));
      }
    }
  }, [profile, progress, reports]);

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

  const totalWeeks = progress?.totalWeeks || 12;
  const startDate = profile?.placement?.startDate;
  const reportsSubmitted = reports?.length || 0;
  const remainingWeeks = totalWeeks - reportsSubmitted;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Submit Weekly Report
            </h1>
            <p className="text-gray-400 mt-2">
              Share your progress for this week
            </p>
          </div>

          {/* Internship Progress Card */}
          {startDate && (
            <div className="bg-gray-700/30 rounded-xl p-4 mb-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Internship Progress
                    </p>
                    <p className="text-xs text-gray-400">
                      Week {currentWeek || formData.week || 1} of {totalWeeks}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">
                    {reportsSubmitted} reports submitted
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(reportsSubmitted / totalWeeks) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {remainingWeeks} weeks remaining
              </p>
            </div>
          )}

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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Week Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  name="week"
                  required
                  value={formData.week}
                  onChange={handleChange}
                  readOnly={!!currentWeek}
                  className={`w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${
                    currentWeek ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  placeholder="Week number"
                />
              </div>
              {currentWeek && (
                <p className="text-xs text-gray-500 mt-1">
                  Week automatically calculated based on your internship start
                  date
                </p>
              )}
            </div>

            {/* Work Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What did you work on? <span className="text-red-400">*</span>
              </label>
              <textarea
                name="content"
                required
                rows={5}
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Describe your tasks and accomplishments this week..."
              />
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Challenges faced
              </label>
              <textarea
                name="challenges"
                rows={3}
                value={formData.challenges}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Any obstacles you encountered?"
              />
            </div>

            {/* Key Learnings */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Learnings
              </label>
              <textarea
                name="learnings"
                rows={3}
                value={formData.learnings}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="What new skills or knowledge did you gain?"
              />
            </div>

            {/* Next Week Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plan for next week
              </label>
              <textarea
                name="nextPlan"
                rows={3}
                value={formData.nextPlan}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="What are your goals for next week?"
              />
            </div>

            {/* Hours Worked */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hours worked this week <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  name="hoursWorked"
                  required
                  value={formData.hoursWorked}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
              className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
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
          <p className="text-xs text-gray-500 text-center mt-6">
            Your report will be reviewed by your advisor. You'll be notified
            once reviewed.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitReportPage;
