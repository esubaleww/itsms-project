import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";
import LoadingScreen from "../../../features/auth/components/LoadingScreen";

const InnovatorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getApplicationStatus } = useApplications();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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

  if (loading) return <LoadingScreen />;

  // Show different UI based on application status
  const renderContent = () => {
    if (!status?.hasApplied) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="text-2xl font-bold mb-4">
            No Innovation Application Found
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Have an innovative idea? Apply for our innovation program and get
            the support you need to develop it.
          </p>
          <button
            onClick={() => navigate("/apply/innovator")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-lg"
          >
            Submit Innovation Idea
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
                Your innovation idea is waiting for bureau review. You'll be
                notified once it's processed.
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">
                  Submitted: {new Date(profile?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Idea Summary */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4">Your Innovation Idea</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="font-medium w-24">Institution:</span>
                  <span>{profile?.institution}</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium w-24">Areas:</span>
                  <div className="flex flex-wrap gap-2">
                    {profile?.areasOfInterest?.map((area, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium w-24">Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
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
                Your innovation idea is being reviewed by experts. This usually
                takes 5-7 business days.
              </p>
            </div>
          </div>
        );

      case "shortlisted":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎯</span>
                <div>
                  <h2 className="text-xl font-bold text-green-800">
                    Congratulations!
                  </h2>
                  <p className="text-green-700">
                    Your idea has been shortlisted! You'll be contacted for an
                    interview.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Next Steps</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm">
                      1
                    </span>
                    <span>Prepare your pitch deck</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                      2
                    </span>
                    <span>Attend innovation panel interview</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                      3
                    </span>
                    <span>Receive final decision</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="text-xl">📄</span>
                    Upload Pitch Deck
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    Schedule Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "approved":
        return (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🚀</span>
                <div>
                  <h2 className="text-xl font-bold">
                    Welcome to the Innovation Program!
                  </h2>
                  <p>Your idea has been approved. Let's bring it to life.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Program Progress</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    0%
                  </div>
                  <p className="text-sm text-gray-600">Just started</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Resources</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    📚 Program Guide
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    👥 Mentor Directory
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    💰 Funding Options
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Upcoming</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="font-medium">Orientation</p>
                    <p className="text-xs text-gray-500">Mar 25, 2026</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="font-medium">Mentor Matching</p>
                    <p className="text-xs text-gray-500">Mar 28, 2026</p>
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
                  "Your innovation idea was not approved at this time."}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/apply/innovator")}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Apply Again
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Get Feedback
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
        <h1 className="text-3xl font-bold text-gray-800">
          Innovator Dashboard
        </h1>
        <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 px-1 ${activeTab === "overview" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("ideas")}
            className={`pb-2 px-1 ${activeTab === "ideas" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"}`}
          >
            My Ideas
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`pb-2 px-1 ${activeTab === "resources" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"}`}
          >
            Resources
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderContent()}

      {activeTab === "ideas" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Innovation Ideas</h2>
          {profile?.previousApplications?.length > 0 ? (
            <div className="space-y-4">
              {profile.previousApplications.map((idea, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <p className="font-medium">Idea #{idx + 1}</p>
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(idea.submittedAt).toLocaleDateString()}
                  </p>{" "}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No previous ideas</p>
          )}
        </div>
      )}

      {activeTab === "resources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-3">📚 Learning Materials</h3>
            <ul className="space-y-2">
              <li className="text-blue-600 hover:underline cursor-pointer">
                How to pitch your idea
              </li>
              <li className="text-blue-600 hover:underline cursor-pointer">
                Market research guide
              </li>
              <li className="text-blue-600 hover:underline cursor-pointer">
                Prototyping basics
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-3">👥 Mentors</h3>
            <ul className="space-y-2">
              <li>Dr. Tekle Berhan - Tech Innovation</li>
              <li>W/ro Almaz Worku - Business Development</li>
              <li>Dr. Tadesse Mulugeta - Research</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnovatorDashboard;
