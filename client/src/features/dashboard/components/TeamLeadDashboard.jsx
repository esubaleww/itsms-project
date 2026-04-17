// client/src/features/dashboard/components/TeamLeadDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useTeamLead } from "../../../hooks/useTeamLead";
import { useToast } from "../../../components/ui/Toast";
import NotificationBell from "../../../components/common/NotificationBell";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  LogOut,
  RefreshCw,
  Sparkles,
  Award,
} from "lucide-react";

const TeamLeadDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const {
    team,
    tasks,
    members,
    progress,
    getTeam,
    getTasks,
    getMembers,
    getProgress,
    assignTask,
  } = useTeamLead();

  const [greeting, setGreeting] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([getTeam(), getTasks(), getMembers(), getProgress()]);
    };
    loadData();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([getTeam(), getTasks(), getMembers(), getProgress()]);
      addToast("Dashboard refreshed!", "success");
    } catch (error) {
      addToast("Failed to refresh", "error");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Team Lead Dashboard
              </h1>
              <p className="text-gray-500 text-sm">
                {greeting}, {user?.fullName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
              <NotificationBell />
              <button
                onClick={() => navigate("/profile")}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-green-600 via-teal-600 to-cyan-600 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Sparkles className="w-4 h-4" />
            <span>{greeting}, Team Lead</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.fullName}!
          </h1>
          <p className="text-white/80 mb-6">
            Manage your team, assign tasks, and track progress.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-2xl font-bold text-white">
                {members?.length || 0}
              </p>
              <p className="text-xs text-white/70">Team Members</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-2xl font-bold text-white">
                {tasks?.pending?.length || 0}
              </p>
              <p className="text-xs text-white/70">Pending Tasks</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-2xl font-bold text-white">
                {progress?.completionRate || 0}%
              </p>
              <p className="text-xs text-white/70">Completion Rate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<FileText />}
            title="Total Tasks"
            value={tasks?.total || 0}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle />}
            title="Completed"
            value={tasks?.completed || 0}
            color="green"
          />
          <StatCard
            icon={<Clock />}
            title="In Progress"
            value={tasks?.inProgress || 0}
            color="yellow"
          />
          <StatCard
            icon={<Award />}
            title="Team Rating"
            value="4.5"
            color="purple"
          />
        </div>
      </div>

      {/* Team & Tasks */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-4">Team Members</h2>
            {members?.map((member) => (
              <div
                key={member._id}
                className="flex justify-between items-center py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{member.fullName}</p>
                  <p className="text-sm text-gray-500">{member.position}</p>
                </div>
                <p className="text-sm font-medium">
                  {member.activeTasks || 0} tasks
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-4">Pending Tasks</h2>
            {tasks?.pending?.slice(0, 5).map((task) => (
              <div key={task._id} className="py-3 border-b last:border-0">
                <p className="font-medium">{task.title || task.type}</p>
                <p className="text-sm text-gray-500">
                  Assigned to: {task.assignedTo?.fullName || "Unassigned"}
                </p>
                <button className="text-sm text-blue-600 mt-1">Assign →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
