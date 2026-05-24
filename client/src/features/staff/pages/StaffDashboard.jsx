import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useStaff } from "../../../hooks/useStaff";
import { useNotifications } from "../../../hooks/useNotifications";
import { useStaffProfile } from "../../../hooks/useStaffProfile";
import { useAdvisor } from "../../../hooks/useAdvisor";
import { useMentor } from "../../../hooks/useMentor";
import { useTrainer } from "../../../hooks/useTrainer";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Zap,
  GraduationCap,
  Lightbulb,
  Rocket,
  School,
  Users,
  Eye,
  FileText,
  Briefcase,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  LogOut,
} from "lucide-react";

import StaffHeader from "../components/StaffHeader";
import StaffStatsCards from "../components/StaffStatsCards";
import MyTasksList from "../components/MyTasksList";
import TaskDetailModal from "../components/TaskDetailModal";
import AdvisorInternsList from "../components/AdvisorInternsList";
import MentorMenteesList from "../components/MentorMenteesList";
import TrainerTraineesList from "../components/TrainerTraineesList";
import WeeklyReportReviewModal from "../components/WeeklyReportReviewModal";
import FinalSummaryModal from "../components/FinalSummaryModal";
import TrainerFinalReviewModal from "../components/TrainerFinalReviewModal";
import MentorFinalReviewModal from "../components/MentorFinalReviewModal";
import MilestoneReviewModal from "../components/MilestoneReviewModal";
import SessionManagementModal from "../components/SessionManagementModal";
import InternProgressModal from "../components/InternProgressModal";
import MenteeProgressModal from "../components/MenteeProgressModal";
import TraineeProgressModal from "../components/TraineeProgressModal";
import SessionsList from "../components/SessionsList";
import SessionQRModal from "../components/SessionQRModal";

const StaffDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    stats: serviceStats,
    tasks,
    loading: staffLoading,
    fetchAll,
    updateTaskStatus,
  } = useStaff();

  const { fetchNotifications } = useNotifications();
  const {
    staffProfile,
    fetchStaffProfile,
    loading: profileLoading,
  } = useStaffProfile();

  const {
    interns,
    internReports,
    loading: advisorLoading,
    fetchInterns,
    fetchInternReports,
    fetchInternProgress,
    reviewReport,
    submitSummary,
    internProgress,
    selectedIntern,
    setSelectedIntern,
  } = useAdvisor();

  const {
    innovators,
    startups,
    loading: mentorLoading,
    fetchInnovators,
    fetchStartups,
    fetchMenteeProgress,
    reviewMilestone,
    addMilestone,
    submitFinalReview,
    menteeProgress,
    selectedMentee,
  } = useMentor();

  const {
    trainees,
    loading: trainerLoading,
    fetchTrainees,
    fetchTraineeProgress,
    createSession,
    generateCertificate,
    traineeProgress,
    selectedTrainee,
    setSelectedTrainee,
    getSessions,
    submitTrainerSummary,
  } = useTrainer();

  const [greeting, setGreeting] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showWeeklyReportModal, setShowWeeklyReportModal] = useState(false);
  const [showFinalSummaryModal, setShowFinalSummaryModal] = useState(false);
  const [showMentorFinalModal, setShowMentorFinalModal] = useState(false);
  const [showTrainerFinalModal, setShowTrainerFinalModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [trainerSubTab, setTrainerSubTab] = useState("sessions");

  const directorateType =
    user?.directorate?.type || staffProfile?.directorate?.type || "service";

  const isServiceStaff = directorateType === "service";
  const canAdvise = directorateType === "internship";
  const canMentor =
    directorateType === "innovation" || directorateType === "startup";
  const canTrain = directorateType === "training";
  const hasServiceTasks = isServiceStaff && tasks && tasks.length > 0;

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
  ];

  if (hasServiceTasks) {
    navItems.push({
      id: "tasks",
      label: "My Tasks",
      icon: <Briefcase className="w-5 h-5" />,
      count: tasks?.filter((t) => t.status !== "completed").length,
    });
  }

  if (canAdvise) {
    navItems.push({
      id: "advisor",
      label: "Advisor",
      icon: <GraduationCap className="w-5 h-5" />,
      count: interns?.filter((i) => i.pendingReports > 0)?.length || 0,
    });
  }

  if (canMentor) {
    navItems.push({
      id: "mentor",
      label: "Mentor",
      icon: <Lightbulb className="w-5 h-5" />,
      count:
        [...(innovators || []), ...(startups || [])].filter(
          (m) => m.pendingMilestones > 0,
        )?.length || 0,
    });
  }

  if (canTrain) {
    navItems.push({
      id: "trainer",
      label: "Trainer",
      icon: <School className="w-5 h-5" />,
      count: trainees?.filter((t) => t.upcomingSessions > 0)?.length || 0,
    });
  }

  const fetchSessions = useCallback(async () => {
    if (!canTrain) return;
    try {
      const data = await getSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  }, [canTrain, getSessions]);

  const handleCreateSession = async (sessionData) => {
    try {
      await createSession(sessionData);
      await fetchSessions();
      await fetchTrainees();
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const handleGenerateQR = (session) => {
    setSelectedSession(session);
    setShowQRModal(true);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchStaffProfile(),
          fetchAll(),
          fetchNotifications(),
        ]);
        if (canAdvise) await fetchInterns();
        if (canMentor) await Promise.all([fetchInnovators(), fetchStartups()]);
        if (canTrain) {
          await fetchTrainees();
          await fetchSessions();
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
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
        fetchAll(),
        fetchNotifications(),
        fetchStaffProfile(),
      ]);
      if (canAdvise) await fetchInterns();
      if (canMentor) await Promise.all([fetchInnovators(), fetchStartups()]);
      if (canTrain) {
        await fetchTrainees();
        await fetchSessions();
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isLoading =
    staffLoading ||
    profileLoading ||
    advisorLoading ||
    mentorLoading ||
    trainerLoading;

  const totalInterns = interns?.length || 0;
  const pendingReports =
    interns?.filter((i) => i.pendingReports > 0).length || 0;

  const allMentees = [...(innovators || []), ...(startups || [])];
  let pendingReviewsCount = 0;
  allMentees.forEach((mentee) => {
    const milestones = mentee.milestones || [];
    const pending = milestones.filter(
      (m) => m.status === "completed" && !m.feedback,
    ).length;
    pendingReviewsCount += pending;
  });

  const totalTrainees = trainees?.length || 0;

  if (isLoading && !serviceStats && !interns && !innovators && !trainees) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  const handleViewProgress = async (menteeId, type) => {
    await fetchMenteeProgress(menteeId, type);
    setSelectedType(type);
    setShowProgressModal(true);
  };

  const handleReviewMilestones = (mentee, type) => {
    setSelectedParticipant(mentee);
    setSelectedType(type);
    setShowMilestoneModal(true);
  };

  const handleFinalReview = (mentee, type) => {
    setSelectedParticipant(mentee);
    setSelectedType(type);
    setShowMentorFinalModal(true);
  };

  return (
    <div className="h-screen bg-linear-to-b from-gray-50 to-gray-100 overflow-hidden flex flex-col font-body">
      <StaffHeader
        onRefresh={handleRefresh}
        refreshing={refreshing}
        title="Staff Dashboard"
        teamName={user?.fullName?.split(" ")[0]}
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${activeTab === item.id ? "bg-blue-50 text-accent" : "text-text-muted hover:bg-gray-50 hover:text-text-primary"}`}
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
          className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-fadeIn">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {showWelcome && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative overflow-hidden bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200/50 rounded-xl"
                    >
                      <div className="relative z-10 px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-accent text-sm mb-1">
                            <Zap className="w-4 h-4" />
                            <span>{greeting}</span>
                          </div>
                          <h2 className="text-xl font-heading font-medium text-text-primary mb-1">
                            {user?.fullName?.split(" ")[0]}!
                          </h2>
                          <p className="text-text-muted text-sm">
                            {canAdvise &&
                              "Review intern reports and track progress"}
                            {canMentor &&
                              "Review milestones and guide your mentees"}
                            {canTrain &&
                              "Manage training sessions and track attendance"}
                            {isServiceStaff &&
                              hasServiceTasks &&
                              "Complete your assigned tasks"}
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

                  <StaffStatsCards
                    stats={serviceStats}
                    isServiceStaff={isServiceStaff}
                    canAdvise={canAdvise}
                    canMentor={canMentor}
                    canTrain={canTrain}
                    advisorStats={{ totalInterns, pendingReports }}
                    mentorStats={{
                      totalMentees: allMentees.length,
                      pendingReviews: pendingReviewsCount,
                    }}
                    trainerStats={{
                      totalTrainees,
                      pendingSessions:
                        trainees?.filter((t) => t.upcomingSessions > 0)
                          ?.length || 0,
                    }}
                  />

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5">
                    <h3 className="text-text-primary font-heading font-medium mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent" />
                      Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {hasServiceTasks && (
                        <button
                          onClick={() => setActiveTab("tasks")}
                          className="btn-filled px-4 py-2"
                        >
                          <Briefcase className="w-4 h-4" /> View My Tasks
                        </button>
                      )}
                      {canAdvise && interns?.length > 0 && (
                        <button
                          onClick={() => setActiveTab("advisor")}
                          className="btn-filled px-4 py-2"
                        >
                          <GraduationCap className="w-4 h-4" /> Review Reports
                        </button>
                      )}
                      {canMentor &&
                        (innovators?.length > 0 || startups?.length > 0) && (
                          <button
                            onClick={() => setActiveTab("mentor")}
                            className="btn-filled px-4 py-2"
                          >
                            <Lightbulb className="w-4 h-4" /> Review Milestones
                          </button>
                        )}
                      {canTrain && trainees?.length > 0 && (
                        <button
                          onClick={() => setActiveTab("trainer")}
                          className="btn-filled px-4 py-2"
                        >
                          <School className="w-4 h-4" /> Manage Sessions
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tasks" && hasServiceTasks && (
                <div>
                  <div className="mb-5">
                    <h2 className="text-xl font-heading font-medium text-text-primary">
                      My Tasks
                    </h2>
                    <p className="text-xs text-text-muted">
                      Tasks assigned to you
                    </p>
                  </div>
                  <MyTasksList
                    tasks={tasks}
                    loading={staffLoading}
                    onUpdateStatus={updateTaskStatus}
                    onViewTask={(task) => {
                      setSelectedTask(task);
                      setShowTaskModal(true);
                    }}
                  />
                </div>
              )}

              {activeTab === "advisor" && canAdvise && interns?.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-xl font-heading font-medium text-text-primary">
                        My Interns
                      </h2>
                      <p className="text-xs text-text-muted">
                        Review reports and track intern progress
                      </p>
                    </div>
                    <button
                      onClick={() => fetchInterns()}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-accent border border-accent/20 rounded-lg text-sm font-medium transition"
                    >
                      Refresh
                    </button>
                  </div>
                  <AdvisorInternsList
                    interns={interns}
                    onReviewReport={async (intern) => {
                      await fetchInternReports(intern._id);
                      setSelectedParticipant(intern);
                      setShowWeeklyReportModal(true);
                    }}
                    onFinalSummary={(intern) => {
                      setSelectedParticipant(intern);
                      setShowFinalSummaryModal(true);
                    }}
                    onViewProgress={async (intern) => {
                      await fetchInternProgress(intern._id);
                      setSelectedIntern(intern);
                      setShowProgressModal(true);
                    }}
                  />
                </div>
              )}

              {activeTab === "mentor" && canMentor && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-xl font-heading font-medium text-text-primary">
                        My{" "}
                        {directorateType === "innovation"
                          ? "Innovators"
                          : "Startups"}
                      </h2>
                      <p className="text-xs text-text-muted">
                        Review milestones and track progress
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        directorateType === "innovation"
                          ? fetchInnovators()
                          : fetchStartups()
                      }
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-accent border border-accent/20 rounded-lg text-sm font-medium transition"
                    >
                      Refresh
                    </button>
                  </div>
                  <MentorMenteesList
                    mentees={
                      directorateType === "innovation" ? innovators : startups
                    }
                    type={
                      directorateType === "innovation" ? "innovator" : "startup"
                    }
                    onViewProgress={handleViewProgress}
                    onReviewMilestones={handleReviewMilestones}
                    onFinalReview={handleFinalReview}
                    loading={mentorLoading}
                  />
                </div>
              )}

              {activeTab === "trainer" && canTrain && (
                <div>
                  <div className="flex gap-4 border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setTrainerSubTab("sessions")}
                      className={`pb-3 px-4 text-sm font-medium transition-all duration-200 ${
                        trainerSubTab === "sessions"
                          ? "text-accent border-b-2 border-accent"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Sessions
                      </span>
                    </button>
                    <button
                      onClick={() => setTrainerSubTab("trainees")}
                      className={`pb-3 px-4 text-sm font-medium transition-all duration-200 ${
                        trainerSubTab === "trainees"
                          ? "text-accent border-b-2 border-accent"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <School className="w-4 h-4" />
                        My Trainees
                      </span>
                    </button>
                  </div>

                  {trainerSubTab === "sessions" && (
                    <SessionsList
                      sessions={sessions}
                      loading={trainerLoading}
                      onCreateSession={handleCreateSession}
                    />
                  )}

                  {trainerSubTab === "trainees" && (
                    <TrainerTraineesList
                      trainees={trainees}
                      loading={trainerLoading}
                      onViewProgress={async (traineeId) => {
                        await fetchTraineeProgress(traineeId);
                        setShowProgressModal(true);
                      }}
                      onFinalReview={(trainee) => {
                        setSelectedParticipant(trainee);
                        setShowTrainerFinalModal(true);
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showTaskModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onUpdateStatus={updateTaskStatus}
        />
      )}

      {showWeeklyReportModal && selectedParticipant && (
        <WeeklyReportReviewModal
          intern={selectedParticipant}
          reports={internReports}
          onClose={() => {
            setShowWeeklyReportModal(false);
            setSelectedParticipant(null);
          }}
          onReview={async (week, feedback, rating) => {
            await reviewReport(selectedParticipant._id, week, feedback, rating);
            await fetchInterns();
          }}
        />
      )}

      {showFinalSummaryModal && selectedParticipant && (
        <FinalSummaryModal
          intern={selectedParticipant}
          onClose={() => {
            setShowFinalSummaryModal(false);
            setSelectedParticipant(null);
          }}
          onSubmitSummary={async (summaryData) => {
            await submitSummary(selectedParticipant._id, summaryData);
            await fetchInterns();
          }}
        />
      )}

      {showMentorFinalModal && selectedParticipant && (
        <MentorFinalReviewModal
          mentee={selectedParticipant}
          type={selectedType}
          onClose={() => {
            setShowMentorFinalModal(false);
            setSelectedParticipant(null);
            setSelectedType(null);
          }}
          onSubmit={async (reviewData) => {
            await submitFinalReview(
              selectedParticipant._id,
              selectedType,
              reviewData,
            );
            setShowMentorFinalModal(false);
            if (selectedType === "innovator") await fetchInnovators();
            else await fetchStartups();
          }}
        />
      )}
      {showTrainerFinalModal && selectedParticipant && (
        <TrainerFinalReviewModal
          trainee={selectedParticipant}
          onSubmit={async (summaryData) => {
            await submitTrainerSummary(
              selectedParticipant.trainee?._id,
              summaryData,
            );
            setShowTrainerFinalModal(false);
            await fetchTrainees();
          }}
          onClose={() => {
            setShowTrainerFinalModal(false);
            setSelectedParticipant(null);
          }}
        />
      )}

      {showMilestoneModal && selectedParticipant && (
        <MilestoneReviewModal
          participant={selectedParticipant}
          type={selectedType}
          onClose={() => {
            setShowMilestoneModal(false);
            setSelectedParticipant(null);
            setSelectedType(null);
          }}
          onReview={async (participantId, milestoneId, status, feedback) => {
            await reviewMilestone(
              participantId,
              milestoneId,
              selectedType,
              status,
              feedback,
            );
            if (selectedType === "innovator") await fetchInnovators();
            else await fetchStartups();
          }}
          onAddMilestone={async (participantId, milestoneData) => {
            await addMilestone(participantId, selectedType, milestoneData);
            if (selectedType === "innovator") await fetchInnovators();
            else await fetchStartups();
          }}
        />
      )}

      {showSessionModal && selectedParticipant && (
        <SessionManagementModal
          trainee={selectedParticipant}
          onClose={() => {
            setShowSessionModal(false);
            setSelectedParticipant(null);
          }}
          onRefresh={fetchTrainees}
        />
      )}

      {showProgressModal && selectedIntern && (
        <InternProgressModal
          intern={selectedIntern}
          progress={internProgress}
          onClose={() => {
            setShowProgressModal(false);
            setSelectedIntern(null);
          }}
        />
      )}

      {showProgressModal && selectedMentee && (
        <MenteeProgressModal
          mentee={selectedMentee}
          progress={menteeProgress}
          type={selectedType}
          onClose={() => {
            setShowProgressModal(false);
            setSelectedMentee(null);
            setSelectedType(null);
          }}
        />
      )}

      {showProgressModal && selectedTrainee && (
        <TraineeProgressModal
          trainee={selectedTrainee}
          progress={traineeProgress}
          onClose={() => {
            setShowProgressModal(false);
            setSelectedTrainee(null);
          }}
        />
      )}

      {showQRModal && selectedSession && (
        <SessionQRModal
          session={selectedSession}
          onClose={() => {
            setShowQRModal(false);
            setSelectedSession(null);
          }}
        />
      )}
    </div>
  );
};

export default StaffDashboardPage;
