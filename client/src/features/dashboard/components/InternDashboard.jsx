import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";

const InternDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getApplicationStatus } = useApplications();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await getApplicationStatus();
      setStatus(data);
    } catch (error) {
      console.error("Failed to load status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show different UI based on application status
  const renderContent = () => {
    if (!status?.hasApplied) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold mb-4">No Application Found</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't submitted an internship application yet. Start your
            journey with us today!
          </p>
          <button
            onClick={() => navigate("/apply/intern")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg"
          >
            Apply for Internship
          </button>
        </div>
      );
    }

    const profile = user.profile;
    const appStatus = profile?.applicationStatus;

    switch (appStatus) {
      case "pending":
        return (
          <div className="max-w-3xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center mb-6">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-yellow-800 mb-2">
                Application Pending
              </h2>
              <p className="text-yellow-700 mb-4">
                Your application is waiting for bureau review. You'll be
                notified once it's processed.
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">
                  Submitted: {new Date(profile?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4">Application Timeline</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-gray-500">
                      {new Date(profile?.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 opacity-50">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Under Review</p>
                    <p className="text-sm text-gray-500">
                      Waiting for bureau review
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "under_review":
        return (
          <div className="max-w-3xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-blue-800 mb-2">
                Under Review
              </h2>
              <p className="text-blue-700">
                Your application is being reviewed by the bureau team. We'll
                update you soon!
              </p>
            </div>
          </div>
        );

      case "approved":
        return (
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎉</span>
                <div>
                  <h2 className="text-xl font-bold">Congratulations!</h2>
                  <p>Your internship application has been approved.</p>
                </div>
              </div>
            </div>

            {/* Intern Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Your Internship Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Student ID:</span>
                    <span className="font-medium">{profile?.studentId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Institution:</span>
                    <span className="font-medium">{profile?.institution}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">
                      {profile?.internship?.preferences?.department}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">
                      {profile?.internship?.startDate
                        ? new Date(
                            profile.internship.startDate,
                          ).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Supervisor:</span>
                    <span className="font-medium">
                      {profile?.internship?.supervisor?.name ||
                        "To be assigned"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition flex items-center gap-3">
                    <span className="text-xl">📝</span>
                    <div>
                      <p className="font-medium">Submit Weekly Report</p>
                      <p className="text-sm text-gray-500">
                        Share your progress
                      </p>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <div>
                      <p className="font-medium">View Schedule</p>
                      <p className="text-sm text-gray-500">
                        Check your timeline
                      </p>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition flex items-center gap-3">
                    <span className="text-xl">💬</span>
                    <div>
                      <p className="font-medium">Message Supervisor</p>
                      <p className="text-sm text-gray-500">
                        Get guidance and feedback
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Progress Tracker</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Week 1 of 12</span>
                    <span className="text-sm">8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "8%" }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">Reports Submitted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">2</p>
                    <p className="text-sm text-gray-600">Tasks Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">4</p>
                    <p className="text-sm text-gray-600">Hours This Week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "rejected":
        return (
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Application Update
              </h2>
              <p className="text-red-700 mb-6">
                {profile?.reviewNotes?.slice(-1)[0]?.comment ||
                  "Your application was not approved at this time."}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/apply/intern")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Apply Again
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Intern Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
      </div>

      {renderContent()}
    </div>
  );
};

export default InternDashboard;
