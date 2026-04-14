import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useRequests } from "../../../hooks/useRequests";
import StatsCard from "../cards/StatsCard";
import RequestCard from "../cards/RequestCard";

const RequesterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests, stats, loading, fetchMyRequests } = useRequests();

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // Filter requests by status
  const pendingRequests = requests.filter(
    (r) => r.status === "pending_approval",
  );
  const inProgressRequests = requests.filter((r) => r.status === "in_progress");
  const completedRequests = requests.filter((r) => r.status === "completed");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Service Requester Dashboard
        </h1>
        <p className="text-gray-600">Track and manage your service requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatsCard
          title="Total Requests"
          count={requests.length}
          color="blue"
          icon="📊"
        />
        <StatsCard
          title="Pending"
          count={stats.pending}
          color="yellow"
          icon="⏳"
        />
        <StatsCard
          title="Approved"
          count={stats.approved}
          color="green"
          icon="✅"
        />
        <StatsCard
          title="In Progress"
          count={stats.inProgress}
          color="purple"
          icon="🔧"
        />
        <StatsCard
          title="Completed"
          count={stats.completed}
          color="green"
          icon="🎉"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate("/requests/new")}
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <span className="text-xl">➕</span>
          New Service Request
        </button>
        <button
          onClick={() => navigate("/services/browse")}
          className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
        >
          <span className="text-xl">📋</span>
          Browse Services
        </button>
        <button
          onClick={() => navigate("/requests/my")}
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <span className="text-xl">📑</span>
          View All Requests
        </button>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pending Approval</h2>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
              {pendingRequests.length}
            </span>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-2">✅</p>
                <p>No pending requests</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <RequestCard key={request._id} request={request} />
              ))
            )}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">In Progress</h2>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {inProgressRequests.length}
            </span>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {inProgressRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-2">🔧</p>
                <p>No requests in progress</p>
              </div>
            ) : (
              inProgressRequests.map((request) => (
                <RequestCard key={request._id} request={request} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recently Completed */}
      {completedRequests.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recently Completed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {completedRequests.slice(0, 3).map((request) => (
              <div key={request._id} className="border rounded-lg p-3">
                <p className="text-sm text-gray-500">{request.requestNumber}</p>
                <p className="font-medium truncate">
                  {request.title || request.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Completed:{" "}
                  {new Date(request.completedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequesterDashboard;
