import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useDirector } from "../../../hooks/useDirector";
import { useDirectorExport } from "../../../hooks/useDirectorExport";
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
  AlertCircle,
  LogOut,
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

import CreateTeamModal from "../components/CreateTeamModal";
import AssignAdvisorModal from "../components/AssignAdvisorModal";
import SubmitReportModal from "../../../common/components/SubmitReportModal";
import AssignTeamLeadModal from "../components/AssignTeamLeadModal";
import AddMemberModal from "../components/AddMemberModal";
import RequestDetailsModal from "../components/RequestDetailsModal";
import ReportDetailsModal from "../../../common/components/ReportDetailsModal";

const DirectorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
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
    advisorReports,
    mentorReports,
    startupMentorReports,
    trainerReports,
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
    fetchAdvisorReports,
    fetchMentorReports,
    fetchStartupMentorReports,
    fetchTrainerReports,
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
    approveSummaryReport,
    rejectSummaryReport,
    createDirectorReport,
    fetchAvailableStaff,
  } = useDirector();
  const { exportData } = useDirectorExport();

  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [requestFilters, setRequestFilters] = useState({
    status: "all",
    type: "service",
  });
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);

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

  const getAllServiceRequests = useMemo(() => {
    const allRequests = [];

    if (requests?.approved && Array.isArray(requests.approved)) {
      allRequests.push(...requests.approved);
    }
    if (
      requests?.assigned_to_team &&
      Array.isArray(requests.assigned_to_team)
    ) {
      allRequests.push(...requests.assigned_to_team);
    }
    if (requests?.in_progress && Array.isArray(requests.in_progress)) {
      allRequests.push(...requests.in_progress);
    }
    if (requests?.completed && Array.isArray(requests.completed)) {
      allRequests.push(...requests.completed);
    }

    return allRequests.filter((r) => r.type === "service");
  }, [requests]);

  const filteredServiceRequests = useMemo(() => {
    return getAllServiceRequests.filter((req) => {
      if (requestFilters.status === "all") return true;
      if (requestFilters.status === "pending")
        return !req.assignedTeam && req.status !== "completed";
      if (requestFilters.status === "assigned")
        return (
          req.assignedTeam &&
          req.status !== "completed" &&
          req.status !== "assigned_to_team"
        );
      if (requestFilters.status === "in_progress")
        return req.status === "in_progress";
      if (requestFilters.status === "completed")
        return req.status === "completed";
      return true;
    });
  }, [getAllServiceRequests, requestFilters.status]);

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
        count: getAllServiceRequests.length,
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
          fetchMyDirectorReports(),
          fetchAvailableStaff(),
          fetchRequests(),
        ];

        if (isServiceDirectorate) {
          promises.push(fetchTeams());
          promises.push(fetchTeamReports());
        } else if (directorateType === "internship") {
          promises.push(fetchInternSummaries());
          promises.push(fetchAdvisorReports());
        } else if (directorateType === "innovation") {
          promises.push(fetchInnovatorSummaries());
          promises.push(fetchMentorReports());
        } else if (directorateType === "startup") {
          promises.push(fetchStartupSummaries());
          promises.push(fetchStartupMentorReports());
        } else if (directorateType === "training") {
          promises.push(fetchTraineeSummaries());
          promises.push(fetchTrainerReports());
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
        fetchMyDirectorReports(),
        fetchRequests(),
      ];

      if (isServiceDirectorate) {
        promises.push(fetchTeams());
        promises.push(fetchTeamReports());
      } else if (directorateType === "internship") {
        promises.push(fetchInternSummaries());
        promises.push(fetchAdvisorReports());
      } else if (directorateType === "innovation") {
        promises.push(fetchInnovatorSummaries());
        promises.push(fetchMentorReports());
      } else if (directorateType === "startup") {
        promises.push(fetchStartupSummaries());
        promises.push(fetchStartupMentorReports());
      } else if (directorateType === "training") {
        promises.push(fetchTraineeSummaries());
        promises.push(fetchTrainerReports());
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
    try {
      await assignRequestToTeam(requestId, teamId, instructions);
      await fetchRequests();
    } catch (error) {
      console.error("Failed to assign request:", error);
    }
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

  const handleViewParticipant = (participantId) => {
    setSelectedParticipantId(participantId);
    setActiveTab(getParticipantListTab());
  };

  const safeData = {
    teams: Array.isArray(teams) ? teams : [],
    interns: Array.isArray(internSummaries) ? internSummaries : [],
    innovators: Array.isArray(innovatorSummaries) ? innovatorSummaries : [],
    startups: Array.isArray(startupSummaries) ? startupSummaries : [],
    trainees: Array.isArray(traineeSummaries) ? traineeSummaries : [],
    teamReports: Array.isArray(teamReports) ? teamReports : [],
    advisorReports: Array.isArray(advisorReports) ? advisorReports : [],
    mentorReports: Array.isArray(mentorReports) ? mentorReports : [],
    startupMentorReports: Array.isArray(startupMentorReports)
      ? startupMentorReports
      : [],
    trainerReports: Array.isArray(trainerReports) ? trainerReports : [],
    myReports: Array.isArray(myReports) ? myReports : [],
  };

  const getCurrentReports = () => {
    if (isServiceDirectorate) return safeData.teamReports;
    if (directorateType === "internship") return safeData.advisorReports;
    if (directorateType === "innovation") return safeData.mentorReports;
    if (directorateType === "startup") return safeData.startupMentorReports;
    if (directorateType === "training") return safeData.trainerReports;
    return [];
  };

  const pendingServiceRequestsCount = getAllServiceRequests.filter(
    (r) => !r.assignedTeam && r.status !== "completed",
  ).length;
  const currentReports = getCurrentReports();
  const pendingReportsCount = currentReports.filter(
    (r) => r.status === "pending" || r.status === "submitted",
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
          value: pendingServiceRequestsCount,
          actionText: "Assign to team",
          actionIcon: <UserPlus className="w-4 h-4" />,
          icon: <ClipboardList className="w-6 h-6" />,
          bgColor: "bg-amber-50",
          iconColor: "text-amber-600",
          onClick: () => {
            setActiveTab("requests");
            setRequestFilters({ ...requestFilters, status: "pending" });
          },
          isEmpty: pendingServiceRequestsCount === 0,
          emptyMessage: "No pending requests 🎉",
          description:
            pendingServiceRequestsCount === 0
              ? "All caught up!"
              : `${pendingServiceRequestsCount} request${pendingServiceRequestsCount !== 1 ? "s" : ""} awaiting assignment`,
          topBorder: "border-t-amber-500",
        },
        {
          id: "teams",
          title: "Active Teams",
          value: safeData.teams.length,
          actionText: "Manage teams",
          actionIcon: <Users className="w-4 h-4" />,
          icon: <Users className="w-6 h-6" />,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          onClick: () => setActiveTab("teams"),
          isEmpty: safeData.teams.length === 0,
          emptyMessage: "No teams yet",
          description: `${safeData.teams.length} active team${safeData.teams.length !== 1 ? "s" : ""}`,
          topBorder: "border-t-accent",
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
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
          onClick: () => setActiveTab("reports"),
          isEmpty: pendingReportsCount === 0,
          emptyMessage: "No pending reports 🎉",
          description:
            pendingReportsCount === 0
              ? "All caught up!"
              : `${pendingReportsCount} report${pendingReportsCount !== 1 ? "s" : ""} awaiting review`,
          topBorder: "border-t-purple-500",
        },
        {
          id: "staffs",
          title: "Total Staffs in Your Directorate",
          value: stats?.totalStaff || 0,
          actionText: "View all",
          actionIcon: <ArrowRight className="w-4 h-4" />,
          icon: <Users className="w-6 h-6" />,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          onClick: () => navigate("/staff"),
          isEmpty: (stats?.totalStaff || 0) === 0,
          emptyMessage: "No staff members yet",
          description: `${stats?.totalStaff || 0} member${stats?.totalStaff !== 1 ? "s" : ""}`,
          topBorder: "border-t-green-500",
        },
      ];
    }

    return [
      {
        id: "total",
        title: `Total ${getParticipantLabel()}`,
        value: assignedCount + unassignedCount,
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
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        onClick: () => setActiveTab(getParticipantListTab()),
        isEmpty: assignedCount + unassignedCount === 0,
        emptyMessage: `No ${getParticipantLabel().toLowerCase()} yet`,
        description: `${assignedCount + unassignedCount} total ${getParticipantLabel().toLowerCase()}`,
        topBorder: "border-t-accent",
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
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
        onClick: () => setActiveTab(getParticipantListTab()),
        isEmpty: assignedCount === 0,
        emptyMessage: `No active ${getParticipantLabel().toLowerCase()} yet`,
        description: `${assignedCount} active ${getParticipantLabel().toLowerCase()}`,
        topBorder: "border-t-green-500",
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
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
        onClick: () => setActiveTab("reports"),
        isEmpty: pendingReportsCount === 0,
        emptyMessage: "No pending reports 🎉",
        description:
          pendingReportsCount === 0
            ? "All caught up!"
            : `${pendingReportsCount} report${pendingReportsCount !== 1 ? "s" : ""} awaiting review`,
        topBorder: "border-t-purple-500",
      },
    ];
  };

  const actionCards = getActionCards();

  const participantListProps = {
    onViewDetails: (id) => {
      setSelectedParticipantId(id);
    },
    selectedId: selectedParticipantId,
    onClearSelected: () => setSelectedParticipantId(null),
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-linear-to-b from-gray-50 to-gray-100 overflow-hidden flex flex-col font-body">
      <DirectorHeader
        onRefresh={handleRefresh}
        title={`${directorateType.charAt(0).toUpperCase() + directorateType.slice(1)} Director Dashboard`}
        onExport={exportData}
        onMenuClick={() => setMobileSidebarOpen(true)}
        directorateType={directorateType}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={`hidden md:block fixed left-0 top-[calc(4rem+var(--analytics-height,0px))] h-[calc(100vh-4rem-var(--analytics-height,0px))] transition-all duration-300 bg-white shadow-sm border-r border-gray-200 ${
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
                className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-sm border-r border-gray-200 z-50 md:hidden"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <span className="text-text-primary font-bold">Menu</span>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {actionCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={card.onClick}
                        className={`relative overflow-hidden bg-white border-l border-r border-b border-gray-200 ${card.topBorder} rounded-xl p-6 shadow-sm ${
                          !card.isEmpty && card.value > 0
                            ? "cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
                            : ""
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className={`${card.bgColor} rounded-lg p-2.5 ${card.iconColor} [&_svg]:shrink-0`}
                            >
                              {card.icon}
                            </div>
                            {card.isEmpty ? (
                              <span className="text-xs text-accent flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> All good
                              </span>
                            ) : (
                              <TrendingUp className="w-4 h-4 text-text-muted" />
                            )}
                          </div>
                          <p className="text-3xl font-bold text-text-primary">
                            {card.value}
                          </p>
                          <p className="text-sm text-text-muted mt-1">
                            {card.title}
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {card.description}
                          </p>
                          {!card.isEmpty && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                card.onClick();
                              }}
                              className="mt-3 text-xs text-accent hover:text-blue-700 transition flex items-center gap-1 group"
                            >
                              <span>{card.actionText}</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {showWelcome && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative overflow-hidden bg-linear-to-r from-blue-50 to-blue-100 border border-accent/20 rounded-xl"
                    >
                      <div className="relative z-10 px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm text-accent">
                              {greeting}, {user?.fullName?.split(" ")[0]}
                            </p>
                            <p className="text-xs text-text-muted">
                              {isServiceDirectorate
                                ? "Review and assign service requests to your teams"
                                : `Manage ${getParticipantLabel().toLowerCase()} and review ${getReportLabel().toLowerCase()}`}
                            </p>
                          </div>
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5">
                      <div className="px-6 py-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                          <h2 className="font-heading font-medium text-text-primary flex items-center gap-2">
                            <Zap className="w-5 h-5 text-accent" />
                            {isServiceDirectorate
                              ? "Pending Service Requests"
                              : `${unassignedCount} ${getParticipantLabel()} Need ${getAssignmentPersonLabel()}s`}
                          </h2>
                          {!isServiceDirectorate && unassignedCount > 0 && (
                            <button
                              onClick={() =>
                                setActiveTab(getParticipantListTab())
                              }
                              className="text-xs text-accent hover:text-blue-700 transition flex items-center gap-1"
                            >
                              View all <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      {isServiceDirectorate ? (
                        <DirectorRequestsList
                          requests={getAllServiceRequests
                            .filter(
                              (r) =>
                                !r.assignedTeam && r.status !== "completed",
                            )
                            .slice(0, 5)}
                          showAssign={false}
                          onViewDetails={(id) => {
                            const request = getAllServiceRequests.find(
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
                        <div className="divide-y divide-gray-200">
                          {unassignedParticipants
                            .slice(0, 5)
                            .map((participant) => {
                              const participantId =
                                getParticipantId(participant);
                              return (
                                <div
                                  key={participantId}
                                  className="p-4 hover:bg-gray-50 transition group cursor-pointer"
                                  onClick={() => {
                                    handleViewParticipant(participant._id);
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="text-text-primary font-medium group-hover:text-accent transition">
                                          {directorateType === "startup"
                                            ? participant.companyName
                                            : participant.user?.fullName}
                                        </p>
                                        <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full">
                                          Needs {getAssignmentPersonLabel()}
                                        </span>
                                      </div>
                                      <p className="text-xs text-text-muted mt-1">
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
                                      className="px-3 py-1.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-lg transition text-sm flex items-center gap-1"
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
                              <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-8 h-8 text-accent" />
                              </div>
                              <p className="text-text-muted">
                                All {getParticipantLabel().toLowerCase()} have
                                been assigned! 🎉
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!isServiceDirectorate && assignedCount > 0 && (
                      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5">
                        <div className="px-6 py-4 border-b border-gray-200 bg-white">
                          <div className="flex items-center justify-between">
                            <h2 className="font-heading font-medium text-text-primary flex items-center gap-2">
                              <Users className="w-5 h-5 text-accent" />
                              Active {getParticipantLabel()}
                            </h2>
                            <button
                              onClick={() =>
                                setActiveTab(getParticipantListTab())
                              }
                              className="text-xs text-accent hover:text-blue-700 transition flex items-center gap-1"
                            >
                              View all <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {assignedParticipants
                            .slice(0, 5)
                            .map((participant) => (
                              <div
                                key={participant._id}
                                className="p-4 hover:bg-gray-50 transition group cursor-pointer"
                                onClick={() => {
                                  handleViewParticipant(participant._id);
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-text-primary font-medium group-hover:text-accent transition">
                                        {directorateType === "startup"
                                          ? participant.companyName
                                          : participant.user?.fullName}
                                      </p>
                                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-accent rounded-full">
                                        {getAssignmentPersonLabel()} Assigned
                                      </span>
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">
                                      {directorateType === "internship" &&
                                        participant.university?.name}
                                      {directorateType === "innovation" &&
                                        participant.ideaTitle}
                                      {directorateType === "startup" &&
                                        participant.sector}
                                      {directorateType === "training" &&
                                        participant.program}
                                    </p>
                                    <p className="text-xs text-text-muted mt-1">
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
                                  <Eye className="w-4 h-4 text-text-muted group-hover:text-accent transition" />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {isServiceDirectorate && (
                      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5">
                        <div className="px-6 py-4 border-b border-gray-200 bg-white">
                          <div className="flex items-center justify-between">
                            <h2 className="font-heading font-medium text-text-primary flex items-center gap-2">
                              <Users className="w-5 h-5 text-accent" />
                              Your Teams
                            </h2>
                            {safeData.teams.length > 0 && (
                              <button
                                onClick={() => setActiveTab("teams")}
                                className="text-xs text-accent hover:text-blue-700 transition flex items-center gap-1"
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

                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5">
                      <div className="px-6 py-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                          <h2 className="font-heading font-medium text-text-primary flex items-center gap-2">
                            {getReportIcon()}
                            Pending {getReportLabel()}
                          </h2>
                          {pendingReportsCount > 0 && (
                            <button
                              onClick={() => setActiveTab("reports")}
                              className="text-xs text-accent hover:text-blue-700 transition flex items-center gap-1"
                            >
                              Review all <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {safeData.teamReports
                          .filter((r) => r.status === "pending")
                          .slice(0, 5)
                          .map((report) => (
                            <div
                              key={report._id}
                              className="p-4 hover:bg-gray-50 transition cursor-pointer group"
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
                                    <Clock className="w-3 h-3 text-amber-500" />
                                    <span className="text-xs text-amber-600">
                                      Needs your review
                                    </span>
                                  </div>
                                  <p className="text-text-primary font-medium group-hover:text-accent transition">
                                    {report.title}
                                  </p>
                                  <p className="text-xs text-text-muted mt-1">
                                    Submitted:{" "}
                                    {new Date(
                                      report.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <Eye className="w-4 h-4 text-text-muted group-hover:text-accent transition" />
                              </div>
                            </div>
                          ))}
                        {pendingReportsCount === 0 && (
                          <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                              <ThumbsUp className="w-8 h-8 text-accent" />
                            </div>
                            <p className="text-text-muted">
                              No pending reports to review 🎉
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isServiceDirectorate && activeTab === "requests" && (
                <div>
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                    <div>
                      <h2 className="text-2xl font-heading font-medium text-text-primary">
                        Service Requests
                      </h2>
                      <p className="text-text-muted text-sm">
                        Track and manage all service requests
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          setRequestFilters({
                            ...requestFilters,
                            status: "all",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${
                          requestFilters.status === "all"
                            ? "bg-blue-50 text-accent border border-accent/20 shadow-sm"
                            : "bg-white text-text-muted border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        All ({getAllServiceRequests.length})
                      </button>
                      <button
                        onClick={() =>
                          setRequestFilters({
                            ...requestFilters,
                            status: "pending",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${
                          requestFilters.status === "pending"
                            ? "bg-blue-50 text-accent border border-accent/20 shadow-sm"
                            : "bg-white text-text-muted border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        Pending (
                        {
                          getAllServiceRequests.filter(
                            (r) => !r.assignedTeam && r.status !== "completed",
                          ).length
                        }
                        )
                      </button>
                      <button
                        onClick={() =>
                          setRequestFilters({
                            ...requestFilters,
                            status: "assigned",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${
                          requestFilters.status === "assigned"
                            ? "bg-blue-50 text-accent border border-accent/20 shadow-sm"
                            : "bg-white text-text-muted border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        Assigned (
                        {
                          getAllServiceRequests.filter(
                            (r) =>
                              r.assignedTeam &&
                              r.status !== "completed" &&
                              r.status !== "assigned_to_team",
                          ).length
                        }
                        )
                      </button>
                      <button
                        onClick={() =>
                          setRequestFilters({
                            ...requestFilters,
                            status: "completed",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${
                          requestFilters.status === "completed"
                            ? "bg-blue-50 text-accent border border-accent/20 shadow-sm"
                            : "bg-white text-text-muted border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        Completed (
                        {
                          getAllServiceRequests.filter(
                            (r) => r.status === "completed",
                          ).length
                        }
                        )
                      </button>
                    </div>
                  </div>

                  {filteredServiceRequests.length === 0 ? (
                    <div className="text-center py-16 bg-white shadow-sm rounded-xl border border-gray-200">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-sm rounded-full mb-4 border border-gray-200">
                        <AlertCircle className="w-10 h-10 text-text-muted" />
                      </div>
                      <p className="text-text-secondary text-lg">
                        No service requests found
                      </p>
                      <p className="text-sm text-text-muted mt-1">
                        {requestFilters.status === "pending"
                          ? "All requests have been assigned to teams"
                          : requestFilters.status === "assigned"
                            ? "No requests are currently in progress"
                            : requestFilters.status === "completed"
                              ? "No completed requests yet"
                              : "New requests will appear here once submitted"}
                      </p>
                    </div>
                  ) : (
                    <DirectorRequestsList
                      requests={filteredServiceRequests}
                      showAssign={requestFilters.status === "pending"}
                      teams={safeData.teams}
                      onAssign={handleAssignRequest}
                      onViewDetails={(id) => {
                        const request = getAllServiceRequests.find(
                          (r) => r._id === id,
                        );
                        setSelectedItem(request);
                        setModals((prev) => ({
                          ...prev,
                          requestDetails: true,
                        }));
                      }}
                    />
                  )}
                </div>
              )}

              {isServiceDirectorate && activeTab === "teams" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-medium text-text-primary">
                        Teams
                      </h2>
                      <p className="text-text-muted text-sm">
                        Manage teams, assign leads, and add members
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, createTeam: true }))
                      }
                      className="btn-filled px-4 py-2 text-sm"
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

              {directorateType === "internship" && activeTab === "interns" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-medium text-text-primary">
                        Interns
                      </h2>
                      <p className="text-text-muted text-sm">
                        Manage interns and assign advisors
                      </p>
                    </div>
                  </div>
                  <DirectorInternsList
                    interns={safeData.interns}
                    staffList={availableStaff}
                    onAssignAdvisor={handleAssignAdvisor}
                    onViewDetails={(id) => {
                      handleViewParticipant(id);
                    }}
                  />
                </div>
              )}

              {directorateType === "innovation" &&
                activeTab === "innovators" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-heading font-medium text-text-primary">
                          Innovators
                        </h2>
                        <p className="text-text-muted text-sm">
                          Manage innovators and assign mentors
                        </p>
                      </div>
                    </div>
                    <DirectorInnovatorsList
                      innovators={safeData.innovators}
                      staffList={availableStaff}
                      directorateId={user?.directorate?._id}
                      onAssignMentor={handleAssignMentor}
                      onViewDetails={(id) => {
                        handleViewParticipant(id);
                      }}
                    />
                  </div>
                )}

              {directorateType === "startup" && activeTab === "startups" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-medium text-text-primary">
                        Startups
                      </h2>
                      <p className="text-text-muted text-sm">
                        Manage startups and assign mentors
                      </p>
                    </div>
                  </div>
                  <DirectorStartupsList
                    startups={safeData.startups}
                    staffList={availableStaff}
                    directorateId={user?.directorate?._id}
                    onAssignMentor={handleAssignStartupMentor}
                    onViewDetails={(id) => {
                      handleViewParticipant(id);
                    }}
                  />
                </div>
              )}

              {directorateType === "training" && activeTab === "trainees" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-medium text-text-primary">
                        Trainees
                      </h2>
                      <p className="text-text-muted text-sm">
                        Manage trainees and assign trainers
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, assignTrainer: true }))
                      }
                      className="btn-filled px-4 py-2 text-sm"
                    >
                      <UserPlus className="w-4 h-4" /> Assign Trainer
                    </button>
                  </div>
                  <DirectorTraineesList
                    trainees={safeData.trainees}
                    staffList={availableStaff}
                    onAssignTrainer={handleAssignTrainer}
                    onViewDetails={(id) => {
                      handleViewParticipant(id);
                    }}
                  />
                </div>
              )}

              {activeTab === "reports" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-medium text-text-primary">
                        {getReportLabel()}
                      </h2>
                      <p className="text-text-muted text-sm">
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
                    reports={currentReports}
                    onReview={handleReviewReport}
                    onApprove={handleApproveReport}
                    onReject={handleRejectReport}
                    onViewDetails={(id) => {
                      setSelectedItem(currentReports.find((r) => r._id === id));
                      setModals((prev) => ({ ...prev, reportDetails: true }));
                    }}
                  />
                </div>
              )}

              {activeTab === "my-reports" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-medium text-text-primary">
                        My Reports
                      </h2>
                      <p className="text-text-muted text-sm">
                        Reports you've submitted to admin
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setModals((prev) => ({ ...prev, submitReport: true }))
                      }
                      className="btn-filled px-4 py-2 text-sm"
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

      {/* Modals remain the same */}
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
          onApprove={
            selectedItem.type === "team_report"
              ? approveReport
              : approveSummaryReport
          }
          onReject={
            selectedItem.type === "team_report"
              ? rejectReport
              : rejectSummaryReport
          }
          reportType={selectedItem.type}
        />
      )}
    </div>
  );
};

export default DirectorDashboard;
