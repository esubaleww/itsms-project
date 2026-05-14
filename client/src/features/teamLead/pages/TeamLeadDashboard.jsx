import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useTeamLead } from "../../../hooks/useTeamLead";
import { useTeamLeadExport } from "../../../hooks/useTeamLeadExport";

import { useToast } from "../../../common/ui/Toast";
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
  Settings,
  LogOut,
  RefreshCw,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Eye,
} from "lucide-react";

import TeamLeadHeader from "../components/TeamLeadHeader";
import TeamStatsCards from "../components/TeamStatsCards";
import TeamTasksList from "../components/TeamTasksList";
import TeamMembersList from "../components/TeamMembersList";
import TeamReportsList from "../components/TeamReportsList";
import MyReportsList from "../components/MyReportsList";
import AssignTaskModal from "../components/AssignTaskModal";
import SubmitReportModal from "../../../common/components/SubmitReportModal";
import RequestStaffModal from "../components/RequestStaffModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import ReportDetailsModal from "../../../common/components/ReportDetailsModal";

const TeamLeadDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
  const { exportData } = useTeamLeadExport();

  const [greeting, setGreeting] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  const pendingTasksCount = tasks?.pending?.length || 0;
  const inProgressTasksCount = tasks?.in_progress?.length || 0;
  const completedTasksCount = tasks?.completed?.length || 0;
  const totalActiveTasks = pendingTasksCount + inProgressTasksCount;

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <ClipboardList className="w-5 h-5" />,
      count: totalActiveTasks,
    },
    {
      id: "members",
      label: "Members",
      icon: <Users className="w-5 h-5" />,
      count: members?.length || 0,
    },
    {
      id: "my-reports",
      label: "My Reports",
      icon: <Award className="w-5 h-5" />,
      count: myReports?.length || 0,
    },
  ];

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

  const handleAssignTask = async (taskId, memberId, instructions) => {
    await assignTask(taskId, memberId, instructions);
    setModals((prev) => ({ ...prev, assignTask: false }));
  };

  const handleUpdateStatus = async (taskId, taskIndex, status, notes) => {
    await updateTaskStatus(taskId, taskIndex, status, notes);
  };

  const handleRequestStaff = async (data) => {
    await requestStaff(data);
    setModals((prev) => ({ ...prev, requestStaff: false }));
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
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const safeData = {
    team: team || {},
    members: Array.isArray(members) ? members : [],
    tasks: tasks || { pending: [], in_progress: [], completed: [] },
    reports: Array.isArray(reports) ? reports : [],
    myReports: Array.isArray(myReports) ? myReports : [],
  };

  if (loading && !team) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto"></div>
          <p className="mt-4 text-[#6b7280]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6] overflow-hidden flex flex-col">
      <TeamLeadHeader
        onRefresh={handleRefresh}
        refreshing={refreshing}
        title="Team Lead Dashboard"
        onExport={exportData}
        teamName={safeData.team?.name}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-r border-[#E5E7EB] ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
          style={{ zIndex: 40 }}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap
                    ${
                      activeTab === item.id
                        ? "bg-[#EEF2FF] text-[#2563eb] border-l-2 border-[#2563eb]"
                        : "text-[#6b7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
                    }
                    ${sidebarCollapsed ? "justify-center px-2" : ""}
                  `}
                  title={sidebarCollapsed ? item.label : ""}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium flex-1 text-left truncate">
                      {item.label}
                    </span>
                  )}
                  {!sidebarCollapsed && item.count > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-[#EEF2FF] text-[#2563eb] rounded-full shrink-0">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-lg z-20 transition-colors border border-[#E5E7EB]"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#334155]" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-[#334155]" />
            )}
          </button>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-r border-[#E5E7EB] z-50 md:hidden"
              >
                <div className="flex justify-between items-center p-4 border-b border-[#E5E7EB]">
                  <span className="text-[#111827] font-bold">Menu</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 hover:bg-[#F3F4F6] rounded-lg"
                  >
                    <X className="w-5 h-5 text-[#6b7280]" />
                  </button>
                </div>
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${
                          activeTab === item.id
                            ? "bg-[#EEF2FF] text-[#2563eb]"
                            : "text-[#6b7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
                        }
                      `}
                    >
                      {item.icon}
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {item.count > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-[#EEF2FF] text-[#2563eb] rounded-full">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content - Scrollable */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-fadeIn">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {showWelcome && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative overflow-hidden bg-linear-to-r from-emerald-600/20 to-teal-600/20 border border-[#2563eb]/20 rounded-xl"
                    >
                      <div className="relative z-10 px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[#2563eb] text-sm mb-1">
                            <Sparkles className="w-4 h-4" />
                            <span>{greeting}</span>
                          </div>
                          <h2 className="text-xl font-bold text-[#111827] mb-1">
                            {user?.fullName?.split(" ")[0]}!
                          </h2>
                          <p className="text-[#6b7280] text-sm">
                            Manage your team, assign tasks, and track progress.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowWelcome(false)}
                          className="text-[#6b7280] hover:text-[#6b7280] transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Stats Cards */}
                  <TeamStatsCards
                    stats={progress}
                    membersCount={safeData.members.length}
                  />

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-xl border border-[#E5E7EB] p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[#2563eb] text-xs">
                            Completion Rate
                          </p>
                          <p className="text-2xl font-bold text-[#111827]">
                            {progress?.completionRate.toFixed(2) || 0}%
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-[#2563eb] opacity-50" />
                      </div>
                    </div>
                    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-xl border border-[#E5E7EB] p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-blue-400 text-xs">Active Tasks</p>
                          <p className="text-2xl font-bold text-[#111827]">
                            {inProgressTasksCount}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-400 opacity-50" />
                      </div>
                    </div>
                    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-xl border border-[#E5E7EB] p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-purple-400 text-xs">
                            Pending Tasks
                          </p>
                          <p className="text-2xl font-bold text-[#111827]">
                            {pendingTasksCount}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-400 opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Tasks & Members Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Tasks - Show first 3 from each category */}
                    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-xl border border-[#E5E7EB] overflow-hidden">
                      <div className="px-5 py-3 border-b border-[#E5E7EB] flex justify-between items-center">
                        <h2 className="font-semibold text-[#111827] flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-[#2563eb]" />
                          Recent Tasks
                        </h2>
                        <button
                          onClick={() => setActiveTab("tasks")}
                          className="text-xs text-[#2563eb] hover:text-[#1d4ed8] transition"
                        >
                          View all →
                        </button>
                      </div>
                      <TeamTasksList
                        tasks={{
                          pending: safeData.tasks.pending?.slice(0, 3) || [],
                          in_progress:
                            safeData.tasks.in_progress?.slice(0, 3) || [],
                          completed: [],
                        }}
                        onUpdateStatus={handleUpdateStatus}
                        onViewDetails={(task) => {
                          setSelectedItem(task);
                          setModals((prev) => ({ ...prev, taskDetails: true }));
                        }}
                      />
                    </div>

                    {/* Team Members */}
                    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-xl border border-[#E5E7EB] overflow-hidden">
                      <div className="px-5 py-3 border-b border-[#E5E7EB] flex justify-between items-center">
                        <h2 className="font-semibold text-[#111827] flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#2563eb]" />
                          Team Members
                        </h2>
                        <button
                          onClick={() => setActiveTab("members")}
                          className="text-xs text-[#2563eb] hover:text-[#1d4ed8] transition"
                        >
                          View all →
                        </button>
                      </div>
                      <TeamMembersList
                        members={safeData.members.slice(0, 5)}
                        tasks={safeData.tasks}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks Tab */}
              {activeTab === "tasks" && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-[#111827]">
                        Team Tasks
                      </h2>
                      <p className="text-xs text-[#6b7280]">
                        Manage and track tasks assigned to your team
                      </p>
                    </div>
                  </div>
                  <TeamTasksList
                    tasks={safeData.tasks}
                    detailed
                    teamMembers={safeData.members}
                    onAssignTask={handleAssignTask}
                    onUpdateStatus={handleUpdateStatus}
                    onViewDetails={(task) => {
                      setSelectedItem(task);
                      setModals((prev) => ({ ...prev, taskDetails: true }));
                    }}
                  />
                </div>
              )}

              {/* Members Tab */}
              {activeTab === "members" && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-[#111827]">
                        Team Members
                      </h2>
                      <p className="text-xs text-[#6b7280]">
                        {safeData.members.length} members in your team
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, requestStaff: true }))
                      }
                      className="bg-linear-to-r from-emerald-500 to-teal-700 text-[#111827] px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90 transition shadow-lg"
                    >
                      <UserPlus className="w-4 h-4" /> Request Staff
                    </button>
                  </div>
                  <TeamMembersList
                    members={safeData.members}
                    tasks={safeData.tasks}
                    detailed
                  />
                </div>
              )}

              {activeTab === "my-reports" && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-[#111827]">
                        My Reports
                      </h2>
                      <p className="text-xs text-[#6b7280]">
                        Reports you've submitted to the director
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, submitReport: true }))
                      }
                      className="bg-linear-to-r from-emerald-500 to-teal-700 text-[#111827] px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90 transition shadow-lg"
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
                </div>
              )}
            </div>
          </div>
        </main>
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
