import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  Briefcase,
  FileText,
  Target,
  Calendar,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  User,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";
import { useToast } from "../../../components/ui/Toast";

import QuickActions from "../components/QuickActions";
import ServiceRequestCard from "../components/ServiceRequestCard";
import EmailVerificationScreen from "../components/EmailVerificationScreen";
import StatsSection from "../components/StatsSection";
import ProgramSection from "../components/ProgramSection";

import { useIntern } from "../../../hooks/useIntern";
import { useInnovator } from "../../../hooks/useInnovator";
import { useStartup } from "../../../hooks/useStartup";
import { useTrainee } from "../../../hooks/useTrainee";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMyApplications();
        if (data?.applications?.service) {
          setServiceRequests(data.applications.service);
          const open = data.applications.service.filter(
            (r) => r.status !== "completed",
          ).length;
          const closed = data.applications.service.filter(
            (r) => r.status === "completed",
          ).length;
          setOpenRequests(open);
          setClosedRequests(closed);
        }
      } catch (error) {
        console.error("Failed to load applications:", error);
      }

      if (programHook) {
        if (userPosition === "intern") {
          await programHook.fetchReports();
          await programHook.fetchProgress();
          await programHook.fetchAdvisor();
        }
        if (userPosition === "innovator") {
          await programHook.fetchMilestones();
          await programHook.fetchProgress();
          await programHook.fetchMentor();
        }
        if (userPosition === "startup") {
          await programHook.fetchMilestones();
          await programHook.fetchProgress();
          await programHook.fetchMentor();
        }
        if (userPosition === "trainee") {
          await programHook.fetchSessions();
          await programHook.fetchProgress();
          await programHook.fetchTrainer();
        }
      }
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([getProfile(), getMyApplications()]);

      if (programHook) {
        if (userPosition === "intern") {
          await programHook.fetchReports();
          await programHook.fetchProgress();
        }
        if (userPosition === "innovator" || userPosition === "startup") {
          await programHook.fetchMilestones();
          await programHook.fetchProgress();
        }
        if (userPosition === "trainee") {
          await programHook.fetchSessions();
          await programHook.fetchProgress();
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
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
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

  const renderAdditionalFeatures = () => {
    if (!programHook) return null;

    switch (userPosition) {
      case "intern":
        const submittedCount = programHook.reports?.length || 0;

        return (
          <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Weekly Reports
              </h3>
              <button
                onClick={() => navigate("/intern/reports/new")}
                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30"
              >
                + Submit Report
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400">
                You are expected to submit 1 report per week during your
                internship.
                {submittedCount > 0 &&
                  ` You've submitted ${submittedCount} report${submittedCount > 1 ? "s" : ""} so far.`}
              </p>
            </div>

            {programHook.reports?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No reports submitted yet
              </p>
            ) : (
              <div className="space-y-3">
                {programHook.reports?.slice(0, 5).map((report) => (
                  <div
                    key={report.week}
                    className="bg-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          Week {report.week}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {report.content}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          report.status === "advisor_reviewed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {report.status === "advisor_reviewed"
                          ? "Reviewed"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "innovator":
      case "startup":
        const completedMilestones =
          programHook.milestones?.filter((m) => m.status === "completed")
            .length || 0;
        const totalMilestones = programHook.milestones?.length || 0;

        return (
          <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6 mt-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-emerald-400" />
              Milestones
            </h3>

            {totalMilestones > 0 && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-400">
                  🎯 {completedMilestones}/{totalMilestones} milestones
                  completed
                </p>
              </div>
            )}

            {programHook.milestones?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No milestones added yet
              </p>
            ) : (
              <div className="space-y-3">
                {programHook.milestones?.map((milestone, idx) => (
                  <div key={idx} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          {milestone.title}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {milestone.description}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          milestone.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : milestone.status === "in_progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {milestone.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "trainee":
        const sessionsArray = Array.isArray(programHook.sessions)
          ? programHook.sessions
          : [];
        const attendedCount =
          sessionsArray.filter((s) => s.attended).length || 0;
        const totalSessions = sessionsArray.length || 0;

        return (
          <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6 mt-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Training Sessions
            </h3>

            {totalSessions > 0 && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-400">
                  📅 {attendedCount}/{totalSessions} sessions attended
                </p>
              </div>
            )}

            {sessionsArray.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No sessions scheduled yet
              </p>
            ) : (
              <div className="space-y-3">
                {sessionsArray.map((session, idx) => (
                  <div key={idx} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          {session.title}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {session.date
                            ? new Date(session.date).toLocaleDateString()
                            : "Date TBD"}{" "}
                          • {session.duration || 0} hours
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          session.attended
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {session.attended ? "Attended" : "Upcoming"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-400" />
              </button>

              <div className="w-10 h-10 bg-linear-to-r from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  User Dashboard
                </h1>
                <p className="text-xs text-gray-400 hidden md:block">
                  Welcome back, {user?.fullName?.split(" ")[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-emerald-400 transition-all duration-200"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-emerald-400 transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block relative transition-all duration-300 bg-gray-800/50 border-r border-gray-700 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
          style={{ height: "calc(100vh - 73px)" }}
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
                        ? "bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-500"
                        : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
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
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full shrink-0">
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
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 shadow-lg z-20 transition-colors border border-gray-600"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-300" />
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
                className="fixed left-0 top-0 bottom-0 w-64 bg-gray-800 border-r border-gray-700 z-50 md:hidden"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <span className="text-white font-bold">Menu</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-400" />
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
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                        }
                      `}
                    >
                      {item.icon}
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {item.count > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
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

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

            {activeTab === "overview" && (
              <div className="space-y-6">
                <ProgramSection user={user} />
                {hasActiveProgram && renderAdditionalFeatures()}
              </div>
            )}

            {activeTab === "requests" && (
              <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    My Service Requests
                  </h2>
                  <button
                    onClick={() => navigate("/services/browse")}
                    className="ml-auto px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition text-sm"
                  >
                    + New Request
                  </button>
                </div>

                {serviceRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No service requests yet
                    </p>
                    <button
                      onClick={() => navigate("/services/browse")}
                      className="mt-4 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-700 text-white rounded-lg hover:opacity-90 transition"
                    >
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <ServiceRequestCard
                        key={request._id}
                        request={request}
                        onClick={(id) => navigate(`/services/request/${id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
