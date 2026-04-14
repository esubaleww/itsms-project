// client/src/features/intern/pages/TrackProgressPage.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";
import {
  ChevronLeft,
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
  Calendar,
  FileText,
} from "lucide-react";

const TrackProgressPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications } = useApplications();
  const internProfile = applications?.internship;

  const reports = internProfile?.reports || [];
  const progress = internProfile?.progress || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Your Progress</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {reports.length}
              </p>
              <p className="text-sm text-gray-600">Reports Submitted</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{progress}%</p>
              <p className="text-sm text-gray-600">Overall Progress</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {internProfile?.weeksRemaining || 8}
              </p>
              <p className="text-sm text-gray-600">Weeks Remaining</p>
            </div>
          </div>

          <h2 className="font-semibold text-lg mb-4">Weekly Reports</h2>
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No reports submitted yet
              </p>
            ) : (
              reports.map((report, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Week {report.week}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${report.status === "advisor_reviewed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {report.status === "advisor_reviewed"
                        ? "Reviewed"
                        : "Submitted"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {report.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(report.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackProgressPage;
