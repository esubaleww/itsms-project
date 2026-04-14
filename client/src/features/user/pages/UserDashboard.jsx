import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  List,
  Briefcase,
  FileText,
  Target,
  Calendar,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";
import { useToast } from "../../../components/ui/Toast";

import QuickActions from "../components/QuickActions";
import ServiceRequestCard from "../components/ServiceRequestCard";
import EmailVerificationScreen from "../components/EmailVerificationScreen";
import StatsSection from "../components/StatsSection";
import DashboardHeader from "../components/DashboardHeader";
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
        onLogout={logout}
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
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800">
      <DashboardHeader
        user={user}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onLogout={logout}
        onNavigate={navigate}
      />

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

        <div className="border-b border-gray-700 mb-6 overflow-x-auto">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm transition ${
                activeTab === "overview"
                  ? "bg-gray-800/60 text-emerald-400 border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm transition ${
                activeTab === "requests"
                  ? "bg-gray-800/60 text-emerald-400 border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
              }`}
            >
              <List className="w-4 h-4" />
              <span>Service Requests</span>
              {serviceRequests.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                  {serviceRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

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
                <p className="text-gray-400 text-lg">No service requests yet</p>
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
    </div>
  );
};

export default UserDashboard;
