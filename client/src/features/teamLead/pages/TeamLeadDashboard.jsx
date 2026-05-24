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
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-linear-to-b from-gray-50 to-gray-100 overflow-hidden flex flex-col font-body">
      <TeamLeadHeader
        onRefresh={handleRefresh}
        refreshing={refreshing}
        title="Team Lead Dashboard"
        onExport={exportData}
        teamName={safeData.team?.name}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={`hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 bg-white shadow-sm border-r border-gray-200 ${
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
                        ? "bg-blue-50 text-accent border-l-2 border-accent"
                        : "text-text-muted hover:bg-gray-50 hover:text-text-primary"
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
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-accent rounded-full shrink-0">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap text-red-500 hover:bg-red-50 ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                  title={sidebarCollapsed ? "Sign Out" : ""}
                >
                  <div className="shrink-0">
                    <LogOut className="w-5 h-5" />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium flex-1 text-left">
                      Sign Out
                    </span>
                  )}
                </button>
              </div>
            </nav>
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-md z-20 transition-colors border border-gray-200"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-text-muted" />
            )}
          </button>
        </aside>

        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-md border-r border-gray-200 z-50 md:hidden"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <span className="text-text-primary font-heading font-medium">
                    Menu
                  </span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-text-muted" />
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
                            ? "bg-blue-50 text-accent"
                            : "text-text-muted hover:bg-gray-50 hover:text-text-primary"
                        }
                      `}
                    >
                      {item.icon}
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {item.count > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-accent rounded-full">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-fadeIn">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {showWelcome && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative overflow-hidden bg-linear-to-r from-blue-50 to-blue-100 border border-accent/20 rounded-xl"
                    >
                      <div className="relative z-10 px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-accent text-sm mb-1">
                            <Sparkles className="w-4 h-4" />
                            <span>{greeting}</span>
                          </div>
                          <h2 className="text-xl font-heading font-medium text-text-primary mb-1">
                            {user?.fullName?.split(" ")[0]}!
                          </h2>
                          <p className="text-text-muted text-sm">
                            Manage your team, assign tasks, and track progress.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowWelcome(false)}
                          className="text-text-muted hover:text-text-primary transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <TeamStatsCards
                    stats={progress}
                    membersCount={safeData.members.length}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white border-l border-r border-b border-gray-200 border-t-2 border-t-accent rounded-xl p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-text-muted text-xs">
                            Completion Rate
                          </p>
                          <p className="text-2xl font-bold text-text-primary">
                            {progress?.completionRate?.toFixed(2) || 0}%
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-accent opacity-50" />
                      </div>
                    </div>
                    <div className="bg-white border-l border-r border-b border-gray-200 border-t-2 border-t-amber-500 rounded-xl p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-text-muted text-xs">
                            Active Tasks
                          </p>
                          <p className="text-2xl font-bold text-text-primary">
                            {inProgressTasksCount}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-amber-500 opacity-50" />
                      </div>
                    </div>
                    <div className="bg-white border-l border-r border-b border-gray-200 border-t-2 border-t-purple-500 rounded-xl p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-text-muted text-xs">
                            Pending Tasks
                          </p>
                          <p className="text-2xl font-bold text-text-primary">
                            {pendingTasksCount}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-500 opacity-50" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5">
                      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-heading font-medium text-text-primary flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-accent" />
                          Recent Tasks
                        </h2>
                        <button
                          onClick={() => setActiveTab("tasks")}
                          className="text-xs text-accent hover:text-blue-700 transition"
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

                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5">
                      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-heading font-medium text-text-primary flex items-center gap-2">
                          <Users className="w-4 h-4 text-accent" />
                          Team Members
                        </h2>
                        <button
                          onClick={() => setActiveTab("members")}
                          className="text-xs text-accent hover:text-blue-700 transition"
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

              {activeTab === "tasks" && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-xl font-heading font-medium text-text-primary">
                        Team Tasks
                      </h2>
                      <p className="text-xs text-text-muted">
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

              {activeTab === "members" && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-xl font-heading font-medium text-text-primary">
                        Team Members
                      </h2>
                      <p className="text-xs text-text-muted">
                        {safeData.members.length} members in your team
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, requestStaff: true }))
                      }
                      className="btn-filled px-4 py-2"
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
                      <h2 className="text-xl font-heading font-medium text-text-primary">
                        My Reports
                      </h2>
                      <p className="text-xs text-text-muted">
                        Reports you've submitted to the director
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, submitReport: true }))
                      }
                      className="btn-filled px-4 py-2"
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
