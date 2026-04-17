import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useTeamLead } from "../../../hooks/useTeamLead";
import { useToast } from "../../../components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Award,
  Sparkles,
  Plus,
  ClipboardList,
  CheckCircle,
  Clock,
  Star,
  UserPlus,
} from "lucide-react";

import TeamLeadHeader from "../components/TeamLeadHeader";
import TeamStatsCards from "../components/TeamStatsCards";
import TeamTasksList from "../components/TeamTasksList";
import TeamMembersList from "../components/TeamMembersList";
import TeamReportsList from "../components/TeamReportsList";
import MyReportsList from "../components/MyReportsList";
import AssignTaskModal from "../components/AssignTaskModal";
import SubmitReportModal from "../../dashboard/components/SubmitReportModal";
import RequestStaffModal from "../components/RequestStaffModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import ReportDetailsModal from "../../dashboard/components/ReportDetailsModal";
import TeamAnalyticsWidget from "../components/TeamAnalyticsWidget";

const TeamLeadDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const {
    loading,
    team,
    members,
    tasks,
    progress,
    reports,
    myReports,
    fetchTeam,
    fetchMembers,
    fetchTasks,
    fetchProgress,
    fetchReports,
    fetchMyReports,
    assignTask,
    updateTaskStatus,
    requestStaff,
    submitReport,
  } = useTeamLead();

  const [greeting, setGreeting] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [modals, setModals] = useState({
    assignTask: false,
    submitReport: false,
    requestStaff: false,
    taskDetails: false,
    reportDetails: false,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [reportFormData, setReportFormData] = useState({
    title: "",
    periodStart: "",
    periodEnd: "",
    summary: "",
    achievements: [],
    challenges: [],
    nextSteps: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchTeam(),
          fetchMembers(),
          fetchTasks(),
          fetchProgress(),
          fetchReports(),
          fetchMyReports(),
        ]);
      } catch (error) {
        addToast("Failed to load dashboard data", "error");
      }
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
      await Promise.all([
        fetchTeam(),
        fetchMembers(),
        fetchTasks(),
        fetchProgress(),
        fetchReports(),
        fetchMyReports(),
      ]);
      addToast("Dashboard refreshed!", "success");
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const handleAssignTask = async (data) => {
    await assignTask(data);
    setModals((prev) => ({ ...prev, assignTask: false }));
    addToast("Task assigned successfully!", "success");
  };

  const handleUpdateStatus = async (taskId, taskIndex, status) => {
    await updateTaskStatus(taskId, taskIndex, status);
    addToast("Task status updated!", "success");
  };

  const handleRequestStaff = async (data) => {
    await requestStaff(data);
    setModals((prev) => ({ ...prev, requestStaff: false }));
    addToast("Staff request submitted!", "success");
  };

  const handleSubmitReport = async () => {
    await submitReport(reportFormData);
    setModals((prev) => ({ ...prev, submitReport: false }));
    setReportFormData({
      title: "",
      periodStart: "",
      periodEnd: "",
      summary: "",
      achievements: [],
      challenges: [],
      nextSteps: [],
    });
    addToast("Report submitted successfully!", "success");
  };

  const safeData = {
    team: team || {},
    members: Array.isArray(members) ? members : [],
    tasks: Array.isArray(tasks) ? tasks : [],
    reports: Array.isArray(reports) ? reports : [],
    myReports: Array.isArray(myReports) ? myReports : [],
  };

  const completedTasks = safeData.tasks.filter(
    (t) => t.status === "completed",
  ).length;
  const inProgressTasks = safeData.tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const pendingTasks = safeData.tasks.filter(
    (t) => t.status === "pending",
  ).length;

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <ClipboardList className="w-4 h-4" />,
      count: pendingTasks + inProgressTasks,
    },
    {
      id: "members",
      label: "Members",
      icon: <Users className="w-4 h-4" />,
      count: safeData.members.length,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText className="w-4 h-4" />,
      count: safeData.reports.filter((r) => r.status === "pending").length,
    },
    {
      id: "my-reports",
      label: "My Reports",
      icon: <Award className="w-4 h-4" />,
      count: safeData.myReports.length,
    },
  ];

  if (loading && !team) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <TeamLeadHeader
        onRefresh={handleRefresh}
        title="Team Lead Dashboard"
        teamName={safeData.team?.name}
        onToggleAnalytics={handleToggleAnalytics}
        showAnalytics={showAnalytics}
      />

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/40 border-b border-gray-700 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <TeamAnalyticsWidget />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-linear-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 mb-6"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{greeting}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {user?.fullName?.split(" ")[0]}!
            </h1>
            <p className="text-white/80 text-sm mb-4">
              Manage your team, assign tasks, and track progress.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-1.5">
                <p className="text-xl font-bold text-white">
                  {safeData.members.length}
                </p>
                <p className="text-xs text-white/70">Members</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-1.5">
                <p className="text-xl font-bold text-white">{completedTasks}</p>
                <p className="text-xs text-white/70">Completed</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-1.5">
                <p className="text-xl font-bold text-white">
                  {inProgressTasks}
                </p>
                <p className="text-xs text-white/70">In Progress</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-700 mb-5 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm transition ${
                  activeTab === tab.id
                    ? "bg-gray-800/60 text-emerald-400 border-b-2 border-emerald-500"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <TeamStatsCards
              stats={progress}
              membersCount={safeData.members.length}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-linear-to-r from-emerald-500/20 to-teal-700/20 rounded-xl p-3 border border-emerald-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-emerald-400 text-xs">Completion Rate</p>
                    <p className="text-xl font-bold text-white">
                      {progress?.completionRate || 0}%
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-emerald-400 opacity-50" />
                </div>
              </div>
              <div className="bg-linear-to-r from-blue-500/20 to-cyan-700/20 rounded-xl p-3 border border-blue-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-400 text-xs">Active Tasks</p>
                    <p className="text-xl font-bold text-white">
                      {inProgressTasks}
                    </p>
                  </div>
                  <Clock className="w-6 h-6 text-blue-400 opacity-50" />
                </div>
              </div>
              <div className="bg-linear-to-r from-purple-500/20 to-indigo-700/20 rounded-xl p-3 border border-purple-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-400 text-xs">Team Rating</p>
                    <p className="text-xl font-bold text-white">
                      {progress?.teamRating || "A"}
                    </p>
                  </div>
                  <Star className="w-6 h-6 text-purple-400 opacity-50" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-gray-800/60 rounded-xl border border-gray-700">
                <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-emerald-400" />
                    Recent Tasks
                  </h2>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className="text-xs text-emerald-400"
                  >
                    View all →
                  </button>
                </div>
                <TeamTasksList
                  tasks={safeData.tasks.slice(0, 4)}
                  onUpdateStatus={handleUpdateStatus}
                  onViewDetails={(task) => {
                    setSelectedItem(task);
                    setModals((prev) => ({ ...prev, taskDetails: true }));
                  }}
                />
              </div>
              <div className="bg-gray-800/60 rounded-xl border border-gray-700">
                <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Team Members
                  </h2>
                  <button
                    onClick={() => setActiveTab("members")}
                    className="text-xs text-emerald-400"
                  >
                    View all →
                  </button>
                </div>
                <TeamMembersList members={safeData.members.slice(0, 4)} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Team Tasks</h2>
                <p className="text-xs text-gray-400">
                  Manage and track tasks assigned to your team
                </p>
              </div>
              <button
                onClick={() =>
                  setModals((prev) => ({ ...prev, assignTask: true }))
                }
                className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:opacity-90 transition"
              >
                <Plus className="w-4 h-4" /> Assign Task
              </button>
            </div>
            <TeamTasksList
              tasks={safeData.tasks}
              detailed
              onUpdateStatus={handleUpdateStatus}
              onViewDetails={(task) => {
                setSelectedItem(task);
                setModals((prev) => ({ ...prev, taskDetails: true }));
              }}
            />
          </motion.div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Team Members</h2>
                <p className="text-xs text-gray-400">
                  {safeData.members.length} members in your team
                </p>
              </div>
              <button
                onClick={() =>
                  setModals((prev) => ({ ...prev, requestStaff: true }))
                }
                className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:opacity-90 transition"
              >
                <UserPlus className="w-4 h-4" /> Request Staff
              </button>
            </div>
            <TeamMembersList members={safeData.members} detailed />
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Team Reports</h2>
              <p className="text-xs text-gray-400">
                Reports submitted by your team members
              </p>
            </div>
            <TeamReportsList
              reports={safeData.reports}
              onViewDetails={(report) => {
                setSelectedItem(report);
                setModals((prev) => ({ ...prev, reportDetails: true }));
              }}
            />
          </motion.div>
        )}

        {/* My Reports Tab */}
        {activeTab === "my-reports" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">My Reports</h2>
                <p className="text-xs text-gray-400">
                  Reports you've submitted to the director
                </p>
              </div>
              <button
                onClick={() =>
                  setModals((prev) => ({ ...prev, submitReport: true }))
                }
                className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:opacity-90 transition"
              >
                <Plus className="w-4 h-4" /> Submit Report
              </button>
            </div>
            <MyReportsList
              reports={safeData.myReports}
              onViewDetails={(report) => {
                setSelectedItem(report);
                setModals((prev) => ({ ...prev, reportDetails: true }));
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {modals.assignTask && (
        <AssignTaskModal
          onClose={() => setModals((prev) => ({ ...prev, assignTask: false }))}
          onSubmit={handleAssignTask}
          members={safeData.members}
        />
      )}
      {modals.submitReport && (
        <SubmitReportModal
          onClose={() =>
            setModals((prev) => ({ ...prev, submitReport: false }))
          }
          onSubmit={handleSubmitReport}
          formData={reportFormData}
          setFormData={setReportFormData}
        />
      )}
      {modals.requestStaff && (
        <RequestStaffModal
          onClose={() =>
            setModals((prev) => ({ ...prev, requestStaff: false }))
          }
          onSubmit={handleRequestStaff}
        />
      )}
      {modals.taskDetails && selectedItem && (
        <TaskDetailsModal
          task={selectedItem}
          onClose={() => setModals((prev) => ({ ...prev, taskDetails: false }))}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      {modals.reportDetails && selectedItem && (
        <ReportDetailsModal
          report={selectedItem}
          onClose={() =>
            setModals((prev) => ({ ...prev, reportDetails: false }))
          }
        />
      )}
    </div>
  );
};

export default TeamLeadDashboard;
