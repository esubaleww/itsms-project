import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  Briefcase,
  FileText,
  Target,
  Calendar,
  LayoutDashboard,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle,
  Loader2,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";
import { useToast } from "../../../common/ui/Toast";
import DashboardHeader from "../components/DashboardHeader";

import QuickActions from "../components/QuickActions";
import ServiceRequestCard from "../components/ServiceRequestCard";
import EmailVerificationScreen from "../components/EmailVerificationScreen";
import StatsSection from "../components/StatsSection";
import ProgramSection from "../components/ProgramSection";

import { useIntern } from "../../../hooks/useIntern";
import { useInnovator } from "../../../hooks/useInnovator";
import { useStartup } from "../../../hooks/useStartup";
import { useTrainee } from "../../../hooks/useTrainee";
import InternReportModal from "../../internship/components/InternReportModal";
import MilestoneCard from "../components/MilestoneCard";
import MySessions from "../components/MySessions";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, resendVerification, getProfile } = useAuth();
  const {
    getMyApplications,
    applications,
    loading: appsLoading,
  } = useApplications();
  const { addToast } = useToast();

  const internHook = useIntern();
  const innovatorHook = useInnovator();
  const startupHook = useStartup();
  const traineeHook = useTrainee();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [openRequests, setOpenRequests] = useState(0);
  const [closedRequests, setClosedRequests] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [programLoading, setProgramLoading] = useState(true);

  const getProgramHook = () => {
    switch (user?.position) {
      case "intern":
        return internHook;
      case "innovator":
        return innovatorHook;
      case "startup":
        return startupHook;
      case "trainee":
        return traineeHook;
      default:
        return null;
    }
  };

  const programHook = getProgramHook();
  const userPosition = user?.position;
  const isIntern = userPosition === "intern";
  const isInnovator = userPosition === "innovator";
  const isStartup = userPosition === "startup";
  const isTrainee = userPosition === "trainee";

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "requests",
      label: "Service Requests",
      icon: <List className="w-5 h-5" />,
      count: serviceRequests.length,
    },
  ];

  if (isIntern) {
    navItems.push({
      id: "my-reports",
      label: "My Reports",
      icon: <FileText className="w-5 h-5" />,
      count: programHook?.reports?.length || 0,
    });
  }

  if (isInnovator || isStartup) {
    navItems.push({
      id: "milestones",
      label: "Milestones",
      icon: <Target className="w-5 h-5" />,
      count:
        programHook?.milestones?.filter((m) => m.status !== "completed")
          ?.length || 0,
    });
  }

  if (isTrainee) {
    navItems.push({
      id: "my-sessions",
      label: "My Sessions",
      icon: <Calendar className="w-5 h-5" />,
      count: traineeHook?.sessions?.total || 0,
    });
  }

  const loadData = async () => {
    try {
      const data = await getMyApplications();
      if (data?.applications?.service) {
        setServiceRequests(data.applications.service);
        const open = data.applications.service.filter(
          (r) => r.status !== "completed" && r.status !== "rejected",
        ).length;
        const closed = data.applications.service.filter(
          (r) => r.status === "completed" || r.status === "rejected",
        ).length;
        setOpenRequests(open);
        setClosedRequests(closed);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    }

    if (programHook) {
      setProgramLoading(true);
      try {
        if (isIntern) {
          await Promise.all([
            programHook.fetchReports(),
            programHook.fetchProgress(),
            programHook.fetchAdvisor(),
          ]);
        }
        if (isInnovator || isStartup) {
          await Promise.all([
            programHook.fetchMilestones(),
            programHook.fetchProgress(),
            programHook.fetchMentor(),
          ]);
        }
        if (isTrainee) {
          await Promise.all([
            programHook.fetchSessions(),
            programHook.fetchProgress(),
            programHook.fetchTrainer(),
          ]);
        }
      } catch (error) {
        console.error("Failed to load program data:", error);
      } finally {
        setProgramLoading(false);
      }
    } else {
      setProgramLoading(false);
    }
  };

  useEffect(() => {
    if (user?.position) {
      loadData();
    }
  }, [user?.position]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([getProfile(), getMyApplications()]);

      if (programHook) {
        if (isIntern) {
          await Promise.all([
            programHook.fetchReports(),
            programHook.fetchProgress(),
          ]);
        }
        if (isInnovator || isStartup) {
          await Promise.all([
            programHook.fetchMilestones(),
            programHook.fetchProgress(),
          ]);
        }
        if (isTrainee) {
          await Promise.all([
            programHook.fetchSessions(),
            programHook.fetchProgress(),
          ]);
        }
      }

      addToast("Dashboard refreshed!", "success");
    } catch (error) {
      addToast("Failed to refresh", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const handleResendVerification = async () => {
    setIsVerifying(true);
    try {
      await resendVerification(user?.email);
      addToast("Verification email resent!", "success");
    } catch (error) {
      addToast(
        error.message || "Failed to resend verification email.",
        "error",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isEmailVerified = user?.emailVerified === true;

  if (appsLoading && !applications) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <EmailVerificationScreen
        user={user}
        onRefresh={handleRefresh}
        onResend={handleResendVerification}
        isVerifying={isVerifying}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  const hasActiveProgram = user?.position && user?.position !== "user";

  const getStatusBadge = (status) => {
    switch (status) {
      case "advisor_reviewed":
        return {
          label: "Reviewed",
          color: "bg-blue-50 text-accent",
          icon: CheckCircle,
        };
      case "submitted":
        return {
          label: "Pending",
          color: "bg-yellow-50 text-yellow-600",
          icon: Clock,
        };
      default:
        return {
          label: status || "Draft",
          color: "bg-gray-100 text-text-muted",
          icon: Clock,
        };
    }
  };

  const renderDetailedContent = () => {
    if (!programHook || programLoading) {
      return (
        <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-12 text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
          <p className="text-text-muted">Loading your data...</p>
        </div>
      );
    }

    if (isIntern) {
      const submittedCount = programHook.reports?.length || 0;
      return (
        <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-medium text-text-primary flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Recent Reports
            </h3>
            <span className="text-xs text-text-muted">
              Total: {submittedCount} report{submittedCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600">
              You are expected to submit 1 report per week.
              {submittedCount > 0 &&
                ` You've submitted ${submittedCount} report${submittedCount > 1 ? "s" : ""} so far.`}
            </p>
          </div>
          {programHook.reports?.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">No reports submitted yet.</p>
              <button
                onClick={() => navigate("/intern/reports/new")}
                className="mt-3 text-accent hover:text-blue-700 transition text-sm"
              >
                + Submit your first report
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {programHook.reports?.slice(0, 5).map((report) => {
                const statusBadge = getStatusBadge(report.status);
                const StatusIcon = statusBadge.icon;
                return (
                  <div
                    key={report._id || report.week}
                    onClick={() => setSelectedReport(report)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-heading font-medium text-text-primary">
                            Week {report.week}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusBadge.label}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted line-clamp-2">
                          {report.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-text-muted">
                            {report.hoursWorked || 0} hours worked
                          </span>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-text-muted group-hover:text-accent transition shrink-0 ml-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (isInnovator || isStartup) {
      const completedMilestones =
        programHook.milestones?.filter((m) => m.status === "completed")
          .length || 0;
      const totalMilestones = programHook.milestones?.length || 0;
      const inProgressCount =
        programHook.milestones?.filter((m) => m.status === "in_progress")
          .length || 0;
      const pendingCount =
        programHook.milestones?.filter((m) => m.status === "pending").length ||
        0;

      return (
        <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-medium text-text-primary flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Milestones
            </h3>
            <span className="text-xs text-text-muted">
              {completedMilestones}/{totalMilestones} completed
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
              <p className="text-xs text-text-muted">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
              <p className="text-xs text-text-muted">In Progress</p>
              <p className="text-xl font-bold text-blue-600">
                {inProgressCount}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
              <p className="text-xs text-text-muted">Completed</p>
              <p className="text-xl font-bold text-accent">
                {completedMilestones}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Overall Progress</span>
              <span>
                {totalMilestones
                  ? Math.round((completedMilestones / totalMilestones) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${totalMilestones ? (completedMilestones / totalMilestones) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
          {programHook.mentor?.mentor?.fullName && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-purple-600">Your Mentor</p>
              <p className="text-sm text-text-primary font-medium">
                {programHook.mentor.mentor.fullName}
              </p>
            </div>
          )}
          {programHook.milestones?.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">No milestones assigned yet</p>
              <p className="text-xs text-text-muted mt-1">
                Your milestones will appear here once assigned by your mentor
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {programHook.milestones.map((milestone, idx) => (
                <MilestoneCard
                  key={milestone._id}
                  milestone={milestone}
                  index={idx}
                  onUpdateStatus={programHook.updateMilestoneStatus}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderMyReportsTab = () => {
    if (!isIntern) return null;
    if (programLoading) {
      return (
        <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-12 text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
          <p className="text-text-muted">Loading your reports...</p>
        </div>
      );
    }
    const reports = programHook?.reports || [];
    return (
      <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-medium text-text-primary">
                My Weekly Reports
              </h2>
              <p className="text-sm text-text-muted">
                View and manage all your submitted weekly reports
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/intern/reports/new")}
            className="btn-filled px-3 py-1.5 text-sm"
          >
            <FileText className="w-4 h-4" />
            Submit New
          </button>
        </div>
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary text-lg">
              No reports submitted yet
            </p>
            <button
              onClick={() => navigate("/intern/reports/new")}
              className="btn-filled mt-4 px-4 py-2"
            >
              Submit Your First Report
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => {
              const statusBadge = getStatusBadge(report.status);
              const StatusIcon = statusBadge.icon;
              return (
                <div
                  key={report._id || report.week}
                  onClick={() => setSelectedReport(report)}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-heading font-medium text-text-primary">
                          Week {report.week}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted line-clamp-1">
                        {report.content}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                        <span>{report.hoursWorked || 0} hours worked</span>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-text-muted group-hover:text-accent transition shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderMilestonesTab = () => {
    if (!isInnovator && !isStartup) return null;
    if (programLoading) {
      return (
        <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-12 text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
          <p className="text-text-muted">Loading your milestones...</p>
        </div>
      );
    }
    const completedMilestones =
      programHook.milestones?.filter((m) => m.status === "completed").length ||
      0;
    const totalMilestones = programHook.milestones?.length || 0;
    return (
      <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-medium text-text-primary">
              All Milestones
            </h2>
            <p className="text-sm text-text-muted">
              Track and update your journey progress
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Total Milestones</p>
            <p className="text-2xl font-bold text-text-primary">
              {totalMilestones}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Completed</p>
            <p className="text-2xl font-bold text-accent">
              {completedMilestones}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Remaining</p>
            <p className="text-2xl font-bold text-yellow-600">
              {totalMilestones - completedMilestones}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {programHook.milestones?.map((milestone, idx) => (
            <MilestoneCard
              key={milestone._id}
              milestone={milestone}
              index={idx}
              onUpdateStatus={programHook.updateMilestoneStatus}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderMySessionsTab = () => {
    if (!isTrainee) return null;
    return (
      <MySessions
        sessions={traineeHook?.sessions || {}}
        loading={programLoading}
        trainer={traineeHook?.trainer}
        onAttendanceMarked={() => {
          traineeHook.fetchSessions();
          traineeHook.fetchProgress();
        }}
      />
    );
  };

  return (
    <div className="h-screen bg-linear-to-b from-gray-50 to-gray-100 overflow-hidden flex flex-col font-body">
      <DashboardHeader
        user={user}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onLogout={handleLogout}
        onNavigate={navigate}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`hidden md:flex flex-col shrink-0 transition-all duration-300 bg-white shadow-sm border-r border-gray-200 ${sidebarCollapsed ? "w-20" : "w-64"}`}
        >
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === item.id ? "bg-blue-50 text-accent" : "text-text-muted hover:bg-gray-50 hover:text-text-primary"} ${sidebarCollapsed ? "justify-center px-2" : ""}`}
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
          <div className="p-3 border-t border-gray-200 shrink-0">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-text-muted" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-text-muted" />
              )}
            </button>
          </div>
        </aside>

        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50 md:hidden flex flex-col"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <span className="text-text-primary font-heading font-medium">
                    Menu
                  </span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id ? "bg-blue-50 text-accent" : "text-text-muted hover:bg-gray-50 hover:text-text-primary"}`}
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
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <StatsSection
                  programStatus={user?.position}
                  serviceCount={serviceRequests.length}
                  serviceStats={{ open: openRequests, closed: closedRequests }}
                />
                <QuickActions
                  onRequestService={() => navigate("/services/browse")}
                  onViewAllRequests={() => setActiveTab("requests")}
                  onApplyProgram={() => navigate("/services/browse")}
                  hasActiveProgram={hasActiveProgram}
                  programStatus={user?.position}
                />

                {hasActiveProgram && (
                  <ProgramSection
                    user={user}
                    onTabChange={(tab) => setActiveTab(tab)}
                  />
                )}

                {!isTrainee && hasActiveProgram && renderDetailedContent()}
              </div>
            )}

            {activeTab === "requests" && (
              <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-heading font-medium text-text-primary">
                    My Service Requests
                  </h2>
                  <button
                    onClick={() => navigate("/services/browse")}
                    className="btn-filled ml-auto px-4 py-2"
                  >
                    + New Request
                  </button>
                </div>
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary text-lg">
                      No service requests yet
                    </p>
                    <button
                      onClick={() => navigate("/services/browse")}
                      className="btn-filled mt-4 px-4 py-2"
                    >
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <ServiceRequestCard key={request._id} request={request} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "my-reports" && renderMyReportsTab()}
            {activeTab === "milestones" && renderMilestonesTab()}
            {activeTab === "my-sessions" && renderMySessionsTab()}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedReport && (
          <InternReportModal
            report={selectedReport}
            advisor={programHook?.advisor}
            onClose={() => setSelectedReport(null)}
            onUpdate={programHook?.updateReport}
            onRefresh={() => {
              programHook?.fetchReports();
              programHook?.fetchProgress();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
