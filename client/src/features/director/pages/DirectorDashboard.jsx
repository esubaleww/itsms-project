import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useDirector } from "../../../hooks/useDirector";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Award,
  Sparkles,
  UserPlus,
  Plus,
  ClipboardList,
  GraduationCap,
  Lightbulb,
  Rocket,
  School,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  ChevronRight,
  ThumbsUp,
  ArrowRight,
  X,
  Zap,
  ChevronLeft,
} from "lucide-react";

import DirectorHeader from "../components/DirectorHeader";
import DirectorRequestsList from "../components/DirectorRequestsList";
import DirectorTeamsList from "../components/DirectorTeamsList";
import DirectorInternsList from "../components/DirectorInternsList";
import DirectorInnovatorsList from "../components/DirectorInnovatorsList";
import DirectorStartupsList from "../components/DirectorStartupsList";
import DirectorTraineesList from "../components/DirectorTraineesList";
import DirectorReportsList from "../components/DirectorReportsList";
import DirectorMyReportsList from "../components/DirectorMyReportsList";
import AnalyticsWidget from "../components/AnalyticsWidget";

import CreateTeamModal from "../components/CreateTeamModal";
import AssignAdvisorModal from "../components/AssignAdvisorModal";
import SubmitReportModal from "../../dashboard/components/SubmitReportModal";
import AssignTeamLeadModal from "../components/AssignTeamLeadModal";
import AddMemberModal from "../components/AddMemberModal";
import RequestDetailsModal from "../components/RequestDetailsModal";
import ReportDetailsModal from "../../dashboard/components/ReportDetailsModal";

const DirectorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    loading,
    stats,
    requests,
    teams,
    internSummaries,
    innovatorSummaries,
    startupSummaries,
    traineeSummaries,
    teamReports,
    myReports,
    availableStaff,
    fetchStats,
    fetchRequests,
    fetchTeams,
    fetchInternSummaries,
    fetchInnovatorSummaries,
    fetchStartupSummaries,
    fetchTraineeSummaries,
    fetchTeamReports,
    fetchMyDirectorReports,
    assignRequestToTeam,
    createTeam,
    deleteTeam,
    assignTeamLead,
    assignToTeam,
    removeFromTeam,
    assignAdvisor,
    assignMentor,
    assignStartupMentor,
    assignTrainer,
    reviewReport,
    approveReport,
    rejectReport,
    createDirectorReport,
    fetchAvailableStaff,
  } = useDirector();

  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [modals, setModals] = useState({
    createTeam: false,
    assignAdvisor: false,
    assignMentor: false,
    assignStartupMentor: false,
    assignTrainer: false,
    submitReport: false,
    assignTeamLead: false,
    addMember: false,
    requestDetails: false,
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

  const directorateType = user?.directorate?.type || "service";
  const isServiceDirectorate = directorateType === "service";

  const getParticipantLabel = () => {
    switch (directorateType) {
      case "internship":
        return "Interns";
      case "innovation":
        return "Innovators";
      case "startup":
        return "Startups";
      case "training":
        return "Trainees";
      default:
        return "Participants";
    }
  };

  const getAssignmentLabel = () => {
    switch (directorateType) {
      case "internship":
        return "Assign Advisor";
      case "innovation":
        return "Assign Mentor";
      case "startup":
        return "Assign Mentor";
      case "training":
        return "Assign Trainer";
      default:
        return "Assign";
    }
  };

  const getAssignmentPersonLabel = () => {
    switch (directorateType) {
      case "internship":
        return "Advisor";
      case "innovation":
        return "Mentor";
      case "startup":
        return "Mentor";
      case "training":
        return "Trainer";
      default:
        return "Staff";
    }
  };

  const getReportLabel = () => {
    if (isServiceDirectorate) return "Team Reports";
    switch (directorateType) {
      case "internship":
        return "Advisor Reports";
      case "innovation":
        return "Mentor Reports";
      case "startup":
        return "Mentor Reports";
      case "training":
        return "Trainer Reports";
      default:
        return "Reports";
    }
  };

  const getReportIcon = () => {
    if (isServiceDirectorate) return <Users className="w-5 h-5" />;
    switch (directorateType) {
      case "internship":
        return <GraduationCap className="w-5 h-5" />;
      case "innovation":
        return <Lightbulb className="w-5 h-5" />;
      case "startup":
        return <Rocket className="w-5 h-5" />;
      case "training":
        return <School className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getParticipantListTab = () => {
    switch (directorateType) {
      case "internship":
        return "interns";
      case "innovation":
        return "innovators";
      case "startup":
        return "startups";
      case "training":
        return "trainees";
      default:
        return "overview";
    }
  };

  const getNavItems = () => {
    const items = [
      {
        id: "overview",
        label: "Overview",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
    ];

    if (isServiceDirectorate) {
      items.push({
        id: "requests",
        label: "Service Requests",
        icon: <ClipboardList className="w-5 h-5" />,
        count:
          requests?.approved?.filter(
            (r) => !r.assignedTeam && r.type === "service",
          )?.length || 0,
      });
      items.push({
        id: "teams",
        label: "Teams",
        icon: <Users className="w-5 h-5" />,
        count: teams?.length || 0,
      });
    } else if (directorateType === "internship") {
      items.push({
        id: "interns",
        label: "Interns",
        icon: <GraduationCap className="w-5 h-5" />,
        count: internSummaries?.length || 0,
      });
    } else if (directorateType === "innovation") {
      items.push({
        id: "innovators",
        label: "Innovators",
        icon: <Lightbulb className="w-5 h-5" />,
        count: innovatorSummaries?.length || 0,
      });
    } else if (directorateType === "startup") {
      items.push({
        id: "startups",
        label: "Startups",
        icon: <Rocket className="w-5 h-5" />,
        count: startupSummaries?.length || 0,
      });
    } else if (directorateType === "training") {
      items.push({
        id: "trainees",
        label: "Trainees",
        icon: <School className="w-5 h-5" />,
        count: traineeSummaries?.length || 0,
      });
    }

    items.push({
      id: "reports",
      label: getReportLabel(),
      icon: getReportIcon(),
      count: teamReports?.filter((r) => r.status === "pending")?.length || 0,
    });
    items.push({
      id: "my-reports",
      label: "My Reports",
      icon: <Award className="w-5 h-5" />,
      count: myReports?.length || 0,
    });

    return items;
  };

  const navItems = getNavItems();

  useEffect(() => {
    const loadData = async () => {
      try {
        const promises = [
          fetchStats(),
          fetchTeamReports(),
          fetchMyDirectorReports(),
          fetchAvailableStaff(),
          fetchRequests(),
        ];

        if (isServiceDirectorate) {
          promises.push(fetchTeams());
        }

        if (directorateType === "internship") {
          promises.push(fetchInternSummaries());
        } else if (directorateType === "innovation") {
          promises.push(fetchInnovatorSummaries());
        } else if (directorateType === "startup") {
          promises.push(fetchStartupSummaries());
        } else if (directorateType === "training") {
          promises.push(fetchTraineeSummaries());
        }

        await Promise.all(promises);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };
    loadData();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [directorateType, isServiceDirectorate]);

  const handleRefresh = async () => {
    try {
      const promises = [
        fetchStats(),
        fetchTeamReports(),
        fetchMyDirectorReports(),
        fetchRequests(),
      ];

      if (isServiceDirectorate) {
        promises.push(fetchTeams());
      }

      if (directorateType === "internship") {
        promises.push(fetchInternSummaries());
      } else if (directorateType === "innovation") {
        promises.push(fetchInnovatorSummaries());
      } else if (directorateType === "startup") {
        promises.push(fetchStartupSummaries());
      } else if (directorateType === "training") {
        promises.push(fetchTraineeSummaries());
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };

  const handleCreateTeam = async (data) => {
    await createTeam(data);
    setModals((prev) => ({ ...prev, createTeam: false }));
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm("Delete this team? This cannot be undone.")) {
      await deleteTeam(id);
    }
  };

  const handleAssignTeamLead = async (teamId, staffId) => {
    await assignTeamLead(teamId, staffId);
    setModals((prev) => ({ ...prev, assignTeamLead: false }));
  };

  const handleAddMember = async (teamId, staffId) => {
    await assignToTeam(teamId, staffId);
    setModals((prev) => ({ ...prev, addMember: false }));
  };

  const handleRemoveMember = async (teamId, staffId) => {
    if (window.confirm("Remove this member?")) {
      await removeFromTeam(teamId, staffId);
    }
  };

  const handleAssignRequest = async (requestId, teamId, instructions = "") => {
    await assignRequestToTeam(requestId, teamId, instructions);
  };

  const handleAssignAdvisor = async (internId, advisorId) => {
    await assignAdvisor(internId, advisorId);
    setModals((prev) => ({ ...prev, assignAdvisor: false }));
  };

  const handleAssignMentor = async (innovatorId, mentorId) => {
    await assignMentor(innovatorId, mentorId);
    setModals((prev) => ({ ...prev, assignMentor: false }));
  };

  const handleAssignStartupMentor = async (startupId, mentorId) => {
    await assignStartupMentor(startupId, mentorId);
    setModals((prev) => ({ ...prev, assignStartupMentor: false }));
  };

  const handleAssignTrainer = async (traineeId, trainerId) => {
    await assignTrainer(traineeId, trainerId);
    setModals((prev) => ({ ...prev, assignTrainer: false }));
  };

  const handleReviewReport = async (reportId, feedback) => {
    await reviewReport(reportId, feedback, "reviewed");
    await fetchTeamReports();
  };

  const handleApproveReport = async (id) => {
    const comment = prompt("Approval comment (optional):");
    await approveReport(id, comment || "Approved");
  };

  const handleRejectReport = async (id) => {
    const reason = prompt("Reason for rejection:");
    if (reason) {
      await rejectReport(id, reason);
    }
  };

  const handleSubmitReport = async () => {
    await createDirectorReport(reportFormData);
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

  const safeData = {
    teams: Array.isArray(teams) ? teams : [],
    interns: Array.isArray(internSummaries) ? internSummaries : [],
    innovators: Array.isArray(innovatorSummaries) ? innovatorSummaries : [],
    startups: Array.isArray(startupSummaries) ? startupSummaries : [],
    trainees: Array.isArray(traineeSummaries) ? traineeSummaries : [],
    teamReports: Array.isArray(teamReports) ? teamReports : [],
    myReports: Array.isArray(myReports) ? myReports : [],
  };

  const pendingServiceRequests =
    isServiceDirectorate && requests?.approved
      ? (requests.approved || []).filter(
          (r) => !r.assignedTeam && r.type === "service",
        )
      : [];

  const pendingReportsCount = safeData.teamReports.filter(
    (r) => r.status === "pending",
  ).length;

  const getUnassignedParticipants = () => {
    switch (directorateType) {
      case "internship":
        return safeData.interns.filter((i) => !i.advisor);
      case "innovation":
        return safeData.innovators.filter((i) => !i.mentor);
      case "startup":
        return safeData.startups.filter((s) => !s.mentor);
      case "training":
        return safeData.trainees.filter((t) => !t.trainer);
      default:
        return [];
    }
  };

  const getAssignedParticipants = () => {
    switch (directorateType) {
      case "internship":
        return safeData.interns.filter((i) => i.advisor);
      case "innovation":
        return safeData.innovators.filter((i) => i.mentor);
      case "startup":
        return safeData.startups.filter((s) => s.mentor);
      case "training":
        return safeData.trainees.filter((t) => t.trainer);
      default:
        return [];
    }
  };

  const getParticipantId = (participant) => {
    if (participant.intern?._id) return participant.intern._id;
    if (participant._id) return participant._id;
    if (participant.companyId) return participant.companyId;
    return `${participant.user?.fullName || participant.fullName || participant.companyName}-${participant.createdAt}`;
  };

  const unassignedParticipants = getUnassignedParticipants();
  const assignedParticipants = getAssignedParticipants();
  const unassignedCount = unassignedParticipants.length;
  const assignedCount = assignedParticipants.length;

  const getActionCards = () => {
    if (isServiceDirectorate) {
      return [
        {
          id: "pending",
          title: "Pending Requests",
          value: pendingServiceRequests.length,
          actionText: "Assign to team",
          actionIcon: <UserPlus className="w-4 h-4" />,
          icon: <ClipboardList className="w-6 h-6" />,
          color: "from-amber-500 to-orange-500",
          bgColor: "bg-amber-500/10",
          onClick: () => setActiveTab("requests"),
          isEmpty: pendingServiceRequests.length === 0,
          emptyMessage: "No pending requests 🎉",
          description:
            pendingServiceRequests.length === 0
              ? "All caught up!"
              : `${pendingServiceRequests.length} request${pendingServiceRequests.length !== 1 ? "s" : ""} awaiting assignment`,
        },
        {
          id: "teams",
          title: "Active Teams",
          value: safeData.teams.length,
          actionText: "Manage teams",
          actionIcon: <Users className="w-4 h-4" />,
          icon: <Users className="w-6 h-6" />,
          color: "from-emerald-500 to-teal-500",
          bgColor: "bg-emerald-500/10",
          onClick: () => setActiveTab("teams"),
          isEmpty: safeData.teams.length === 0,
          emptyMessage: "No teams yet",
          description: `${safeData.teams.length} active team${safeData.teams.length !== 1 ? "s" : ""}`,
        },
        {
          id: "reports",
          title: "Pending Reports",
          value: pendingReportsCount,
          actionText: pendingReportsCount > 0 ? "Review now" : "All reviewed",
          actionIcon:
            pendingReportsCount > 0 ? (
              <Eye className="w-4 h-4" />
            ) : (
              <ThumbsUp className="w-4 h-4" />
            ),
          icon: <FileText className="w-6 h-6" />,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-purple-500/10",
          onClick: () => setActiveTab("reports"),
          isEmpty: pendingReportsCount === 0,
          emptyMessage: "No pending reports 🎉",
          description:
            pendingReportsCount === 0
              ? "All caught up!"
              : `${pendingReportsCount} report${pendingReportsCount !== 1 ? "s" : ""} awaiting review`,
        },
        {
          id: "members",
          title: "Team Members",
          value: stats?.totalStaff || 0,
          actionText: "View all",
          actionIcon: <ArrowRight className="w-4 h-4" />,
          icon: <Users className="w-6 h-6" />,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-500/10",
          onClick: () => navigate("/staff"),
          isEmpty: (stats?.totalStaff || 0) === 0,
          emptyMessage: "No team members yet",
          description: `${stats?.totalStaff || 0} member${stats?.totalStaff !== 1 ? "s" : ""}`,
        },
      ];
    }

    const assignmentLabel = getAssignmentPersonLabel();

    return [
      {
        id: "unassigned",
        title: `Needs ${assignmentLabel}`,
        value: unassignedCount,
        actionText: `Assign ${assignmentLabel}`,
        actionIcon: <UserPlus className="w-4 h-4" />,
        icon:
          directorateType === "internship" ? (
            <GraduationCap className="w-6 h-6" />
          ) : directorateType === "innovation" ? (
            <Lightbulb className="w-6 h-6" />
          ) : directorateType === "startup" ? (
            <Rocket className="w-6 h-6" />
          ) : (
            <School className="w-6 h-6" />
          ),
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-500/10",
        onClick: () => setActiveTab(getParticipantListTab()),
        isEmpty: unassignedCount === 0,
        emptyMessage: `All ${getParticipantLabel().toLowerCase()} have ${assignmentLabel.toLowerCase()}s! 🎉`,
        description:
          unassignedCount === 0
            ? "All assigned!"
            : `${unassignedCount} ${getParticipantLabel().toLowerCase()} need ${assignmentLabel.toLowerCase()}s`,
      },
      {
        id: "active",
        title: `Active ${getParticipantLabel()}`,
        value: assignedCount,
        actionText: `View all`,
        actionIcon: <ArrowRight className="w-4 h-4" />,
        icon:
          directorateType === "internship" ? (
            <GraduationCap className="w-6 h-6" />
          ) : directorateType === "innovation" ? (
            <Lightbulb className="w-6 h-6" />
          ) : directorateType === "startup" ? (
            <Rocket className="w-6 h-6" />
          ) : (
            <School className="w-6 h-6" />
          ),
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-500/10",
        onClick: () => setActiveTab(getParticipantListTab()),
        isEmpty: assignedCount === 0,
        emptyMessage: `No active ${getParticipantLabel().toLowerCase()} yet`,
        description: `${assignedCount} active ${getParticipantLabel().toLowerCase()}`,
      },
      {
        id: "reports",
        title: "Pending Reports",
        value: pendingReportsCount,
        actionText: pendingReportsCount > 0 ? "Review now" : "All reviewed",
        actionIcon:
          pendingReportsCount > 0 ? (
            <Eye className="w-4 h-4" />
          ) : (
            <ThumbsUp className="w-4 h-4" />
          ),
        icon: <FileText className="w-6 h-6" />,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
        onClick: () => setActiveTab("reports"),
        isEmpty: pendingReportsCount === 0,
        emptyMessage: "No pending reports 🎉",
        description:
          pendingReportsCount === 0
            ? "All caught up!"
            : `${pendingReportsCount} report${pendingReportsCount !== 1 ? "s" : ""} awaiting review`,
      },
    ];
  };

  const actionCards = getActionCards();

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex flex-col">
      <DirectorHeader
        onRefresh={handleRefresh}
        title={`${directorateType.charAt(0).toUpperCase() + directorateType.slice(1)} Director Dashboard`}
        onExport={() => setShowExportModal(true)}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        onMenuClick={() => setMobileSidebarOpen(true)}
        directorateType={directorateType}
      />

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 border-b border-gray-700 overflow-hidden relative z-30 shrink-0"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <AnalyticsWidget />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Flex Container - Takes remaining height */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block fixed left-0 top-[calc(4rem+var(--analytics-height,0px))] h-[calc(100vh-4rem-var(--analytics-height,0px))] transition-all duration-300 bg-gray-800/50 border-r border-gray-700 ${
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
                  {/* Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {actionCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={card.onClick}
                        className={`relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/30 backdrop-blur-sm p-5 transition-all duration-300 ${
                          !card.isEmpty && card.value > 0
                            ? "cursor-pointer hover:scale-105 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
                            : ""
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-linear-to-r ${card.color} opacity-0 transition-opacity duration-300 ${hoveredCard === index ? "opacity-10" : ""}`}
                        />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${card.bgColor}`}>
                              {card.icon}
                            </div>
                            {card.isEmpty ? (
                              <span className="text-xs text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> All good
                              </span>
                            ) : (
                              <TrendingUp className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <p className="text-3xl font-bold text-white">
                            {card.value}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {card.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {card.description}
                          </p>
                          {!card.isEmpty && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                card.onClick();
                              }}
                              className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 group"
                            >
                              <span>{card.actionText}</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Welcome Banner */}
                  {showWelcome && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative overflow-hidden bg-linear-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-xl"
                    >
                      <div className="relative z-10 px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm text-emerald-400">
                              {greeting}, {user?.fullName?.split(" ")[0]}
                            </p>
                            <p className="text-xs text-gray-400">
                              {isServiceDirectorate
                                ? "Review and assign service requests to your teams"
                                : `Manage ${getParticipantLabel().toLowerCase()} and review ${getReportLabel().toLowerCase()}`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowWelcome(false)}
                          className="text-gray-500 hover:text-gray-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Overview Grid Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Actions Section */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/30">
                        <div className="flex items-center justify-between">
                          <h2 className="font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-emerald-400" />
                            {isServiceDirectorate
                              ? "Pending Service Requests"
                              : `${unassignedCount} ${getParticipantLabel()} Need ${getAssignmentPersonLabel()}s`}
                          </h2>
                          {!isServiceDirectorate && unassignedCount > 0 && (
                            <button
                              onClick={() =>
                                setActiveTab(getParticipantListTab())
                              }
                              className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                            >
                              View all <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      {isServiceDirectorate ? (
                        <DirectorRequestsList
                          requests={pendingServiceRequests.slice(0, 5)}
                          showAssign={false}
                          onViewDetails={(id) => {
                            const request = pendingServiceRequests.find(
                              (r) => r._id === id,
                            );
                            setSelectedItem(request);
                            setModals((prev) => ({
                              ...prev,
                              requestDetails: true,
                            }));
                          }}
                        />
                      ) : (
                        <div className="divide-y divide-gray-700">
                          {unassignedParticipants
                            .slice(0, 5)
                            .map((participant) => {
                              const participantId =
                                getParticipantId(participant);
                              return (
                                <div
                                  key={participantId}
                                  className="p-4 hover:bg-gray-700/30 transition group cursor-pointer"
                                  onClick={() => {
                                    setSelectedItem(participant);
                                    if (directorateType === "internship") {
                                      setModals((prev) => ({
                                        ...prev,
                                        assignAdvisor: true,
                                      }));
                                    } else if (
                                      directorateType === "innovation"
                                    ) {
                                      setModals((prev) => ({
                                        ...prev,
                                        assignMentor: true,
                                      }));
                                    } else if (directorateType === "startup") {
                                      setModals((prev) => ({
                                        ...prev,
                                        assignStartupMentor: true,
                                      }));
                                    } else if (directorateType === "training") {
                                      setModals((prev) => ({
                                        ...prev,
                                        assignTrainer: true,
                                      }));
                                    }
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="text-white font-medium group-hover:text-emerald-400 transition">
                                          {directorateType === "startup"
                                            ? participant.companyName
                                            : participant.user?.fullName}
                                        </p>
                                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                                          Needs {getAssignmentPersonLabel()}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {directorateType === "internship" &&
                                          participant.university?.name}
                                        {directorateType === "innovation" &&
                                          participant.ideaTitle}
                                        {directorateType === "startup" &&
                                          participant.sector}
                                        {directorateType === "training" &&
                                          participant.program}
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedItem(participant);
                                        if (directorateType === "internship") {
                                          setModals((prev) => ({
                                            ...prev,
                                            assignAdvisor: true,
                                          }));
                                        } else if (
                                          directorateType === "innovation"
                                        ) {
                                          setModals((prev) => ({
                                            ...prev,
                                            assignMentor: true,
                                          }));
                                        } else if (
                                          directorateType === "startup"
                                        ) {
                                          setModals((prev) => ({
                                            ...prev,
                                            assignStartupMentor: true,
                                          }));
                                        } else if (
                                          directorateType === "training"
                                        ) {
                                          setModals((prev) => ({
                                            ...prev,
                                            assignTrainer: true,
                                          }));
                                        }
                                      }}
                                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition text-sm flex items-center gap-1"
                                    >
                                      <UserPlus className="w-3 h-3" />
                                      {getAssignmentLabel()}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          {unassignedCount === 0 && (
                            <div className="p-12 text-center">
                              <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                              </div>
                              <p className="text-gray-400">
                                All {getParticipantLabel().toLowerCase()} have
                                been assigned! 🎉
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Active Participants Section */}
                    {!isServiceDirectorate && assignedCount > 0 && (
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/30">
                          <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-white flex items-center gap-2">
                              <Users className="w-5 h-5 text-emerald-400" />
                              Active {getParticipantLabel()}
                            </h2>
                            <button
                              onClick={() =>
                                setActiveTab(getParticipantListTab())
                              }
                              className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                            >
                              View all <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-700">
                          {assignedParticipants
                            .slice(0, 5)
                            .map((participant) => (
                              <div
                                key={participant._id}
                                className="p-4 hover:bg-gray-700/30 transition group cursor-pointer"
                                onClick={() => {
                                  setSelectedItem(participant);
                                  setModals((prev) => ({
                                    ...prev,
                                    requestDetails: true,
                                  }));
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-white font-medium group-hover:text-emerald-400 transition">
                                        {directorateType === "startup"
                                          ? participant.companyName
                                          : participant.user?.fullName}
                                      </p>
                                      <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                                        {getAssignmentPersonLabel()} Assigned
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {directorateType === "internship" &&
                                        participant.university?.name}
                                      {directorateType === "innovation" &&
                                        participant.ideaTitle}
                                      {directorateType === "startup" &&
                                        participant.sector}
                                      {directorateType === "training" &&
                                        participant.program}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Assigned to:{" "}
                                      {directorateType === "internship" &&
                                        participant.assignedAdvisor?.fullName}
                                      {directorateType === "innovation" &&
                                        participant.mentor?.fullName}
                                      {directorateType === "startup" &&
                                        participant.mentor?.fullName}
                                      {directorateType === "training" &&
                                        participant.trainer?.fullName}
                                    </p>
                                  </div>
                                  <Eye className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition" />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Teams Preview */}
                    {isServiceDirectorate && (
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/30">
                          <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-white flex items-center gap-2">
                              <Users className="w-5 h-5 text-emerald-400" />
                              Your Teams
                            </h2>
                            {safeData.teams.length > 0 && (
                              <button
                                onClick={() => setActiveTab("teams")}
                                className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                              >
                                Manage all <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <DirectorTeamsList
                          teams={safeData.teams.slice(0, 5)}
                          detailed={false}
                        />
                      </div>
                    )}

                    {/* Reports Preview */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/30">
                        <div className="flex items-center justify-between">
                          <h2 className="font-semibold text-white flex items-center gap-2">
                            {getReportIcon()}
                            Pending {getReportLabel()}
                          </h2>
                          {pendingReportsCount > 0 && (
                            <button
                              onClick={() => setActiveTab("reports")}
                              className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                            >
                              Review all <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="divide-y divide-gray-700">
                        {safeData.teamReports
                          .filter((r) => r.status === "pending")
                          .slice(0, 5)
                          .map((report) => (
                            <div
                              key={report._id}
                              className="p-4 hover:bg-gray-700/30 transition cursor-pointer group"
                              onClick={() => {
                                setSelectedItem(report);
                                setModals((prev) => ({
                                  ...prev,
                                  reportDetails: true,
                                }));
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span className="text-xs text-amber-400">
                                      Needs your review
                                    </span>
                                  </div>
                                  <p className="text-white font-medium group-hover:text-emerald-400 transition">
                                    {report.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Submitted:{" "}
                                    {new Date(
                                      report.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <Eye className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition" />
                              </div>
                            </div>
                          ))}
                        {pendingReportsCount === 0 && (
                          <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-3">
                              <ThumbsUp className="w-8 h-8 text-emerald-500" />
                            </div>
                            <p className="text-gray-400">
                              No pending reports to review 🎉
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Requests Tab */}
              {isServiceDirectorate && activeTab === "requests" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Service Requests
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    {pendingServiceRequests.length} requests awaiting team
                    assignment
                  </p>
                  <DirectorRequestsList
                    requests={pendingServiceRequests}
                    showAssign
                    teams={safeData.teams}
                    onAssign={handleAssignRequest}
                    onViewDetails={(id) => {
                      const request = pendingServiceRequests.find(
                        (r) => r._id === id,
                      );
                      setSelectedItem(request);
                      setModals((prev) => ({ ...prev, requestDetails: true }));
                    }}
                  />
                </div>
              )}

              {/* Teams Tab */}
              {isServiceDirectorate && activeTab === "teams" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Teams</h2>
                      <p className="text-gray-400 text-sm">
                        Manage teams, assign leads, and add members
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, createTeam: true }))
                      }
                      className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition shadow-lg"
                    >
                      <Plus className="w-4 h-4" /> Create Team
                    </button>
                  </div>
                  <DirectorTeamsList
                    teams={safeData.teams}
                    detailed
                    onDelete={handleDeleteTeam}
                    onAssignLead={(team) => {
                      setSelectedItem(team);
                      setModals((prev) => ({ ...prev, assignTeamLead: true }));
                    }}
                    onAddMember={(team) => {
                      setSelectedItem(team);
                      setModals((prev) => ({ ...prev, addMember: true }));
                    }}
                    onRemoveMember={handleRemoveMember}
                    staffList={availableStaff}
                  />
                </div>
              )}

              {/* Interns Tab */}
              {directorateType === "internship" && activeTab === "interns" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Interns</h2>
                      <p className="text-gray-400 text-sm">
                        Manage interns and assign advisors
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, assignAdvisor: true }))
                      }
                      className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition shadow-lg"
                    >
                      <UserPlus className="w-4 h-4" /> Assign Advisor
                    </button>
                  </div>
                  <DirectorInternsList
                    interns={safeData.interns}
                    staffList={availableStaff}
                    onAssignAdvisor={handleAssignAdvisor}
                    onViewDetails={(id) => {
                      setSelectedItem(
                        safeData.interns.find((i) => i._id === id),
                      );
                      setModals((prev) => ({ ...prev, requestDetails: true }));
                    }}
                  />
                </div>
              )}

              {/* Innovators Tab */}
              {directorateType === "innovation" &&
                activeTab === "innovators" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Innovators
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Manage innovators and assign mentors
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setModals((prev) => ({ ...prev, assignMentor: true }))
                        }
                        className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition shadow-lg"
                      >
                        <UserPlus className="w-4 h-4" /> Assign Mentor
                      </button>
                    </div>
                    <DirectorInnovatorsList
                      innovators={safeData.innovators}
                      staffList={availableStaff}
                      onAssignMentor={handleAssignMentor}
                      onViewDetails={(id) => {
                        setSelectedItem(
                          safeData.innovators.find((i) => i._id === id),
                        );
                        setModals((prev) => ({
                          ...prev,
                          requestDetails: true,
                        }));
                      }}
                    />
                  </div>
                )}

              {/* Startups Tab */}
              {directorateType === "startup" && activeTab === "startups" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Startups
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Manage startups and assign mentors
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({
                          ...prev,
                          assignStartupMentor: true,
                        }))
                      }
                      className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition shadow-lg"
                    >
                      <UserPlus className="w-4 h-4" /> Assign Mentor
                    </button>
                  </div>
                  <DirectorStartupsList
                    startups={safeData.startups}
                    staffList={availableStaff}
                    onAssignMentor={handleAssignStartupMentor}
                    onViewDetails={(id) => {
                      setSelectedItem(
                        safeData.startups.find((s) => s._id === id),
                      );
                      setModals((prev) => ({ ...prev, requestDetails: true }));
                    }}
                  />
                </div>
              )}

              {/* Trainees Tab */}
              {directorateType === "training" && activeTab === "trainees" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Trainees
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Manage trainees and assign trainers
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, assignTrainer: true }))
                      }
                      className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition shadow-lg"
                    >
                      <UserPlus className="w-4 h-4" /> Assign Trainer
                    </button>
                  </div>
                  <DirectorTraineesList
                    trainees={safeData.trainees}
                    staffList={availableStaff}
                    onAssignTrainer={handleAssignTrainer}
                    onViewDetails={(id) => {
                      setSelectedItem(
                        safeData.trainees.find((t) => t._id === id),
                      );
                      setModals((prev) => ({ ...prev, requestDetails: true }));
                    }}
                  />
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {getReportLabel()}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Review and approve reports submitted by{" "}
                        {isServiceDirectorate
                          ? "team leads"
                          : directorateType === "internship"
                            ? "advisors"
                            : directorateType === "training"
                              ? "trainers"
                              : "mentors"}
                      </p>
                    </div>
                  </div>
                  <DirectorReportsList
                    reports={safeData.teamReports}
                    onReview={handleReviewReport}
                    onApprove={handleApproveReport}
                    onReject={handleRejectReport}
                    onViewDetails={(id) => {
                      setSelectedItem(
                        safeData.teamReports.find((r) => r._id === id),
                      );
                      setModals((prev) => ({ ...prev, reportDetails: true }));
                    }}
                  />
                </div>
              )}

              {/* My Reports Tab */}
              {activeTab === "my-reports" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        My Reports
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Reports you've submitted to admin
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, submitReport: true }))
                      }
                      className="bg-linear-to-r from-emerald-500 to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition shadow-lg"
                    >
                      <Plus className="w-4 h-4" /> Submit Report
                    </button>
                  </div>
                  <DirectorMyReportsList
                    reports={safeData.myReports}
                    onViewDetails={(id) => {
                      setSelectedItem(
                        safeData.myReports.find((r) => r._id === id),
                      );
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
      {modals.createTeam && isServiceDirectorate && (
        <CreateTeamModal
          onClose={() => setModals((prev) => ({ ...prev, createTeam: false }))}
          onSubmit={handleCreateTeam}
        />
      )}
      {modals.assignAdvisor && selectedItem && (
        <AssignAdvisorModal
          title="Assign Advisor to Intern"
          participantLabel="Intern"
          assignmentLabel="Advisor"
          showUniversity={true}
          onClose={() =>
            setModals((prev) => ({ ...prev, assignAdvisor: false }))
          }
          onSubmit={(internId, advisorId) =>
            handleAssignAdvisor(internId, advisorId)
          }
          interns={safeData.interns}
          staffList={availableStaff}
        />
      )}
      {modals.assignMentor && selectedItem && (
        <AssignAdvisorModal
          title="Assign Mentor to Innovator"
          participantLabel="Innovator"
          assignmentLabel="Mentor"
          showUniversity={false}
          onClose={() =>
            setModals((prev) => ({ ...prev, assignMentor: false }))
          }
          onSubmit={(innovatorId, mentorId) =>
            handleAssignMentor(innovatorId, mentorId)
          }
          interns={safeData.innovators}
          staffList={availableStaff}
        />
      )}
      {modals.assignStartupMentor && selectedItem && (
        <AssignAdvisorModal
          title="Assign Mentor to Startup"
          participantLabel="Startup"
          assignmentLabel="Mentor"
          showUniversity={false}
          onClose={() =>
            setModals((prev) => ({ ...prev, assignStartupMentor: false }))
          }
          onSubmit={(startupId, mentorId) =>
            handleAssignStartupMentor(startupId, mentorId)
          }
          interns={safeData.startups}
          staffList={availableStaff}
        />
      )}
      {modals.assignTrainer && selectedItem && (
        <AssignAdvisorModal
          title="Assign Trainer to Trainee"
          participantLabel="Trainee"
          assignmentLabel="Trainer"
          showUniversity={false}
          onClose={() =>
            setModals((prev) => ({ ...prev, assignTrainer: false }))
          }
          onSubmit={(traineeId, trainerId) =>
            handleAssignTrainer(traineeId, trainerId)
          }
          interns={safeData.trainees}
          staffList={availableStaff}
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
      {modals.assignTeamLead && selectedItem && isServiceDirectorate && (
        <AssignTeamLeadModal
          team={selectedItem}
          staffList={availableStaff}
          onClose={() =>
            setModals((prev) => ({ ...prev, assignTeamLead: false }))
          }
          onSubmit={(staffId) =>
            handleAssignTeamLead(selectedItem._id, staffId)
          }
        />
      )}
      {modals.addMember && selectedItem && isServiceDirectorate && (
        <AddMemberModal
          team={selectedItem}
          staffList={availableStaff.filter(
            (s) => !selectedItem.members?.some((m) => m._id === s._id),
          )}
          onClose={() => setModals((prev) => ({ ...prev, addMember: false }))}
          onSubmit={(staffId) => handleAddMember(selectedItem._id, staffId)}
        />
      )}
      {modals.requestDetails && selectedItem && (
        <RequestDetailsModal
          request={selectedItem}
          onClose={() =>
            setModals((prev) => ({ ...prev, requestDetails: false }))
          }
          onAssign={isServiceDirectorate ? handleAssignRequest : null}
          onAssignAdvisor={
            directorateType === "internship" ? handleAssignAdvisor : null
          }
          onAssignMentor={
            directorateType === "innovation" ? handleAssignMentor : null
          }
          onAssignStartupMentor={
            directorateType === "startup" ? handleAssignStartupMentor : null
          }
          onAssignTrainer={
            directorateType === "training" ? handleAssignTrainer : null
          }
          teams={safeData.teams}
          staffList={availableStaff}
        />
      )}
      {modals.reportDetails && selectedItem && (
        <ReportDetailsModal
          report={selectedItem}
          onClose={() =>
            setModals((prev) => ({ ...prev, reportDetails: false }))
          }
          onApprove={handleApproveReport}
          onReject={handleRejectReport}
        />
      )}
    </div>
  );
};

export default DirectorDashboard;
