import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";

const StartupDashboard = () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!status?.hasApplied) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold mb-4">
          No Startup Registration Found
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Register your startup to access incubation programs, funding
          opportunities, and mentorship.
        </p>
        <button
          onClick={() => navigate("/apply/startup")}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition text-lg"
        >
          Register Your Startup
        </button>
      </div>
    );
  }

  const profile = user.profile;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Startup Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
      </div>

      {/* Company Profile Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profile?.companyName}
            </h2>
            <p className="text-gray-600">
              Registration: {profile?.registrationNumber}
            </p>
            <p className="text-gray-600">Sector: {profile?.sector}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              profile?.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {profile?.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 px-1 ${activeTab === "overview" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("incubation")}
            className={`pb-2 px-1 ${activeTab === "incubation" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"}`}
          >
            Incubation
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`pb-2 px-1 ${activeTab === "team" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"}`}
          >
            Team
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`pb-2 px-1 ${activeTab === "milestones" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"}`}
          >
            Milestones
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600">Incubation Stage</p>
              <p className="text-2xl font-bold text-orange-600 capitalize">
                {profile?.incubationStatus}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600">Team Size</p>
              <p className="text-2xl font-bold text-blue-600">
                {profile?.employeeCount}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600">Funding Stage</p>
              <p className="text-2xl font-bold text-green-600 capitalize">
                {profile?.fundingStage}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600">Milestones</p>
              <p className="text-2xl font-bold text-purple-600">
                {profile?.milestones?.filter((m) => m.status === "completed")
                  .length || 0}
                /{profile?.milestones?.length || 0}
              </p>
            </div>
          </div>

          {/* Incubation Center */}
          {profile?.incubationCenter && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Incubation Center</h3>
              <p className="text-lg">{profile.incubationCenter.name}</p>
              <p className="text-gray-600">
                Started:{" "}
                {new Date(profile.incubationStartDate).toLocaleDateString()}
              </p>
              {profile.incubationEndDate && (
                <p className="text-gray-600">
                  Ends:{" "}
                  {new Date(profile.incubationEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "incubation" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Program Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Benefits:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li>Mentorship sessions: 4/12 completed</li>
                  <li>Workshops: 2/8 attended</li>
                  <li>Networking events: 1/4 attended</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Mentors</h3>
            <div className="space-y-3">
              {profile?.mentors?.map((mentor, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <p className="font-medium">
                      {mentor.mentor?.name || "Mentor"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Focus: {mentor.focus}
                    </p>
                  </div>
                </div>
              ))}
              {(!profile?.mentors || profile.mentors.length === 0) && (
                <p className="text-gray-500 text-center py-4">
                  No mentors assigned yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Founding Team</h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm">
              + Add Member
            </button>
          </div>
          <div className="space-y-4">
            {profile?.founders?.map((founder, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{founder.name}</p>
                  <p className="text-sm text-gray-600">{founder.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{founder.email}</p>
                  <p className="text-sm font-medium">{founder.share}% equity</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Milestones</h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm">
              + Add Milestone
            </button>
          </div>
          <div className="space-y-3">
            {profile?.milestones?.map((milestone, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={milestone.status === "completed"}
                  readOnly
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${milestone.status === "completed" ? "line-through text-gray-400" : ""}`}
                  >
                    {milestone.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {milestone.description}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {milestone.dueDate
                    ? new Date(milestone.dueDate).toLocaleDateString()
                    : ""}
                </div>
              </div>
            ))}
            {(!profile?.milestones || profile.milestones.length === 0) && (
              <p className="text-gray-500 text-center py-4">
                No milestones set yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupDashboard;
