// client/src/features/staff/pages/StaffDashboardPage.jsx
import { useState, useEffect } from "react";
import { useStaff } from "../../../hooks/useStaff";
import { useNotifications } from "../../../hooks/useNotifications";
import { useAuth } from "../../../hooks/useAuth";
import { useStaffProfile } from "../../../hooks/useStaffProfile";
import { useAdvisor } from "../../../hooks/useAdvisor";
import { useMentor } from "../../../hooks/useMentor";
import { useTrainer } from "../../../hooks/useTrainer";

import StaffHeader from "../components/StaffHeader";
import StaffStatsCards from "../components/StaffStatsCards";
import TasksList from "../components/TasksList";
import RecentActivity from "../components/RecentActivity";
import TaskDetailModal from "../components/TaskDetailModal";

// Role-specific modals
import ReportReviewModal from "../components/ReportReviewModal";
import MilestoneReviewModal from "../components/MilestoneReviewModal";
import SessionManagementModal from "../components/SessionManagementModal";
import InternProgressModal from "../components/InternProgressModal";
import MenteeProgressModal from "../components/MenteeProgressModal";
import TraineeProgressModal from "../components/TraineeProgressModal";

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
} from "lucide-react";

const StaffDashboardPage = () => {
  const { user } = useAuth();

  // Service/Technical Staff Hook - for tasks assigned by team leads
  const {
    stats: serviceStats,
    tasks,
    loading: staffLoading,
    fetchAll,
    updateTaskStatus,
  } = useStaff();

  const { notifications, unreadCount, fetchNotifications } = useNotifications();
  const {
    staffProfile,
    fetchStaffProfile,
    loading: profileLoading,
  } = useStaffProfile();

  // Advisor Hook - only if staff has canAdvise permission
  const {
    interns,
    loading: advisorLoading,
    fetchInterns,
    fetchInternProgress,
    reviewReport,
    submitSummary,
    internProgress,
    selectedIntern,
  } = useAdvisor();

  // Mentor Hook - only if staff has canMentor permission
  const {
    innovators,
    startups,
    loading: mentorLoading,
    fetchInnovators,
    fetchStartups,
    fetchMenteeProgress,
    reviewMilestone,
    addMilestone,
    menteeProgress,
    selectedMentee,
  } = useMentor();

  // Trainer Hook - only if staff has canTrain permission
  const {
    trainees,
    loading: trainerLoading,
    fetchTrainees,
    fetchTraineeProgress,
    createSession,
    recordAttendance,
    generateCertificate,
    traineeProgress,
    selectedTrainee,
  } = useTrainer();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Get permissions from staff profile
  const canAdvise = staffProfile?.canAdvise || false;
  const canMentor = staffProfile?.canMentor || false;
  const canTrain = staffProfile?.canTrain || false;
  const hasServiceTasks = tasks && tasks.length > 0;

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchStaffProfile(),
        fetchAll(), // Load service tasks
        fetchNotifications(),
      ]);

      // Load role-specific data based on permissions from StaffProfile
      if (canAdvise) {
        await fetchInterns();
      }
      if (canMentor) {
        await Promise.all([fetchInnovators(), fetchStartups()]);
      }
      if (canTrain) {
        await fetchTrainees();
      }
    };
    loadData();
  }, []);

  // Build tabs based on permissions from StaffProfile
  const getTabs = () => {
    const tabs = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
    ];

    // Service Tasks - if staff has any service tasks
    if (hasServiceTasks) {
      tabs.push({
        id: "tasks",
        label: "My Tasks",
        icon: <Briefcase className="w-4 h-4" />,
        count: tasks?.filter((t) => t.status !== "completed").length,
      });
    }

    // Advisor tab - based on canAdvise permission
    if (canAdvise && interns?.length > 0) {
      tabs.push({
        id: "advisor",
        label: "Advisor",
        icon: <GraduationCap className="w-4 h-4" />,
        count: interns?.filter((i) => i.pendingReports > 0)?.length || 0,
      });
    }

    // Mentor tab - based on canMentor permission
    if (canMentor && (innovators?.length > 0 || startups?.length > 0)) {
      tabs.push({
        id: "mentor",
        label: "Mentor",
        icon: <Lightbulb className="w-4 h-4" />,
        count:
          [...(innovators || []), ...(startups || [])].filter(
            (m) => m.pendingMilestones > 0,
          )?.length || 0,
      });
    }

    // Trainer tab - based on canTrain permission
    if (canTrain && trainees?.length > 0) {
      tabs.push({
        id: "trainer",
        label: "Trainer",
        icon: <School className="w-4 h-4" />,
        count: trainees?.filter((t) => t.upcomingSessions > 0)?.length || 0,
      });
    }

    return tabs;
  };

  const tabs = getTabs();
  const isLoading =
    staffLoading ||
    profileLoading ||
    advisorLoading ||
    mentorLoading ||
    trainerLoading;

  if (isLoading && !serviceStats && !interns && !innovators && !trainees) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      <StaffHeader
        onRefresh={async () => {
          await Promise.all([
            fetchAll(),
            fetchNotifications(),
            fetchStaffProfile(),
          ]);
          if (canAdvise) await fetchInterns();
          if (canMentor) {
            await Promise.all([fetchInnovators(), fetchStartups()]);
          }
          if (canTrain) await fetchTrainees();
        }}
        title="Staff Dashboard"
        unreadCount={unreadCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-700 mb-6 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-3 px-1 border-b-2 transition-all whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }
                `}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="animate-fadeIn">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <StaffStatsCards
                stats={serviceStats}
                canAdvise={canAdvise}
                canMentor={canMentor}
                canTrain={canTrain}
                advisorStats={{
                  totalInterns: interns?.length || 0,
                  pendingReports:
                    interns?.filter((i) => i.pendingReports > 0)?.length || 0,
                }}
                mentorStats={{
                  totalMentees:
                    (innovators?.length || 0) + (startups?.length || 0),
                  pendingMilestones:
                    [...(innovators || []), ...(startups || [])].filter(
                      (m) => m.pendingMilestones > 0,
                    )?.length || 0,
                }}
                trainerStats={{
                  totalTrainees: trainees?.length || 0,
                  pendingSessions:
                    trainees?.filter((t) => t.upcomingSessions > 0)?.length ||
                    0,
                }}
              />

              <div className="mt-6 bg-linear-to-r from-emerald-600 to-teal-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {hasServiceTasks && (
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                    >
                      <Briefcase className="w-4 h-4" /> View My Tasks
                    </button>
                  )}
                  {canAdvise && interns?.length > 0 && (
                    <button
                      onClick={() => setActiveTab("advisor")}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                    >
                      <GraduationCap className="w-4 h-4" /> Review Intern
                      Reports
                    </button>
                  )}
                  {canMentor &&
                    (innovators?.length > 0 || startups?.length > 0) && (
                      <button
                        onClick={() => setActiveTab("mentor")}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                      >
                        <Lightbulb className="w-4 h-4" /> Review Milestones
                      </button>
                    )}
                  {canTrain && trainees?.length > 0 && (
                    <button
                      onClick={() => setActiveTab("trainer")}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                    >
                      <School className="w-4 h-4" /> Manage Sessions
                    </button>
                  )}
                </div>
              </div>

              <RecentActivity activities={notifications} />
            </div>
          )}

          {/* Tasks Tab - Service Requests */}
          {activeTab === "tasks" && hasServiceTasks && (
            <TasksList
              tasks={tasks}
              loading={staffLoading}
              onUpdateStatus={updateTaskStatus}
              onViewTask={(task) => {
                setSelectedTask(task);
                setShowTaskModal(true);
              }}
            />
          )}

          {/* Advisor Tab - only if canAdvise is true */}
          {activeTab === "advisor" && canAdvise && interns?.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">My Interns</h2>
                  <p className="text-gray-400 text-sm">
                    Review reports and track intern progress
                  </p>
                </div>
                <button
                  onClick={() => fetchInterns()}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition"
                >
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interns?.map((intern) => (
                  <div
                    key={intern._id}
                    className="bg-gray-800/60 rounded-xl border border-gray-700 p-4 hover:border-emerald-500/50 transition group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition">
                          {intern.intern?.fullName || intern.fullName}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {intern.university?.name}
                        </p>
                      </div>
                      {intern.pendingReports > 0 && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                          {intern.pendingReports} Pending
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={async () => {
                          await fetchInternProgress(intern._id);
                          setShowProgressModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition text-sm flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Progress
                      </button>
                      <button
                        onClick={() => {
                          setSelectedParticipant(intern);
                          setShowReportModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition text-sm flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentor Tab - only if canMentor is true */}
          {activeTab === "mentor" && canMentor && (
            <div className="space-y-8">
              {innovators?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    My Innovators
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {innovators?.map((innovator) => (
                      <div
                        key={innovator._id}
                        className="bg-gray-800/60 rounded-xl border border-gray-700 p-4 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-purple-400 transition">
                              {innovator.user?.fullName}
                            </h3>
                            <p className="text-xs text-gray-400 line-clamp-1">
                              {innovator.ideaTitle}
                            </p>
                          </div>
                          {innovator.pendingMilestones > 0 && (
                            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                              {innovator.pendingMilestones} Pending
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={async () => {
                              await fetchMenteeProgress(
                                innovator.user?._id,
                                "innovator",
                              );
                              setSelectedType("innovator");
                              setShowProgressModal(true);
                            }}
                            className="flex-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition text-sm"
                          >
                            View Progress
                          </button>
                          <button
                            onClick={() => {
                              setSelectedParticipant(innovator);
                              setSelectedType("innovator");
                              setShowMilestoneModal(true);
                            }}
                            className="flex-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg transition text-sm"
                          >
                            Review Milestones
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {startups?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-orange-400" />
                    My Startups
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {startups?.map((startup) => (
                      <div
                        key={startup._id}
                        className="bg-gray-800/60 rounded-xl border border-gray-700 p-4 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-orange-400 transition">
                              {startup.companyName}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {startup.sector}
                            </p>
                          </div>
                          {startup.pendingMilestones > 0 && (
                            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                              {startup.pendingMilestones} Pending
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={async () => {
                              await fetchMenteeProgress(
                                startup.user?._id,
                                "startup",
                              );
                              setSelectedType("startup");
                              setShowProgressModal(true);
                            }}
                            className="flex-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition text-sm"
                          >
                            View Progress
                          </button>
                          <button
                            onClick={() => {
                              setSelectedParticipant(startup);
                              setSelectedType("startup");
                              setShowMilestoneModal(true);
                            }}
                            className="flex-1 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white rounded-lg transition text-sm"
                          >
                            Review Milestones
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trainer Tab - only if canTrain is true */}
          {activeTab === "trainer" && canTrain && trainees?.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">My Trainees</h2>
                  <p className="text-gray-400 text-sm">
                    Manage sessions and track attendance
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedParticipant(null);
                    setShowSessionModal(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm text-white transition"
                >
                  + Create Session
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainees?.map((trainee) => (
                  <div
                    key={trainee._id}
                    className="bg-gray-800/60 rounded-xl border border-gray-700 p-4 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition">
                          {trainee.user?.fullName}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {trainee.profession}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                        {trainee.progress?.completionRate || 0}% Complete
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={async () => {
                          await fetchTraineeProgress(trainee.user?._id);
                          setShowProgressModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition text-sm"
                      >
                        View Progress
                      </button>
                      <button
                        onClick={() => {
                          setSelectedParticipant(trainee);
                          setShowSessionModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition text-sm"
                      >
                        Manage Sessions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Modals - same as before */}
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

      {showReportModal && selectedParticipant && (
        <ReportReviewModal
          intern={selectedParticipant}
          onClose={() => {
            setShowReportModal(false);
            setSelectedParticipant(null);
          }}
          onReview={async (internId, week, feedback, rating) => {
            await reviewReport(internId, week, feedback, rating);
            await fetchInterns();
          }}
          onSubmitSummary={async (internId, summaryData) => {
            await submitSummary(internId, summaryData);
            await fetchInterns();
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
            if (selectedType === "innovator") {
              await fetchInnovators();
            } else {
              await fetchStartups();
            }
          }}
          onAddMilestone={async (participantId, milestoneData) => {
            await addMilestone(participantId, selectedType, milestoneData);
            if (selectedType === "innovator") {
              await fetchInnovators();
            } else {
              await fetchStartups();
            }
          }}
        />
      )}

      {showSessionModal && (
        <SessionManagementModal
          trainee={selectedParticipant}
          onClose={() => {
            setShowSessionModal(false);
            setSelectedParticipant(null);
          }}
          onCreateSession={async (sessionData) => {
            if (selectedParticipant) {
              await createSession(selectedParticipant.user?._id, sessionData);
              await fetchTrainees();
            }
          }}
          onRecordAttendance={async (sessionId, traineeId) => {
            await recordAttendance(sessionId, traineeId);
            await fetchTrainees();
          }}
          onGenerateCertificate={async (traineeId, sessionId) => {
            await generateCertificate(traineeId, sessionId);
          }}
        />
      )}

      {showProgressModal && (
        <>
          {selectedIntern && (
            <InternProgressModal
              intern={selectedIntern}
              progress={internProgress}
              onClose={() => {
                setShowProgressModal(false);
                setSelectedIntern(null);
              }}
            />
          )}
          {selectedMentee && (
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
          {selectedTrainee && (
            <TraineeProgressModal
              trainee={selectedTrainee}
              progress={traineeProgress}
              onClose={() => {
                setShowProgressModal(false);
                setSelectedTrainee(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default StaffDashboardPage;
