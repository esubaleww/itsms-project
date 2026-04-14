// client/src/features/dashboard/components/ProgramCard.jsx
import {
  UserCheck,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Users,
  Target,
  Eye,
  PlusCircle,
  FileText,
  Info,
  AlertCircle,
} from "lucide-react";

const ProgramCard = ({ program, onAction }) => {
  const getProgressPercentage = () => {
    if (program.progress !== undefined && program.progress !== null) {
      return Math.min(Math.round(program.progress), 100);
    }

    if (program.type === "intern") {
      const totalWeeks = program.totalWeeks || program.reportsCount || 12;
      const completedWeeks = program.reportsCount || 0;
      return Math.min(Math.round((completedWeeks / totalWeeks) * 100), 100);
    }
    if (program.type === "innovation") {
      const totalModules = program.totalModules || 0;
      const completedModules = program.completedModules || 0;
      if (totalModules === 0) return 0;
      return Math.min(Math.round((completedModules / totalModules) * 100), 100);
    }
    if (program.type === "training") {
      const totalSessions = program.totalSessions || 0;
      const attendedSessions = program.sessionsAttended || 0;
      if (totalSessions === 0) return 0;
      return Math.min(
        Math.round((attendedSessions / totalSessions) * 100),
        100,
      );
    }
    return 0;
  };

  const getProgressText = () => {
    if (program.type === "intern") {
      const totalWeeks = program.totalWeeks || program.reportsCount || 12;
      const completedWeeks = program.reportsCount || 0;
      return `${completedWeeks} / ${totalWeeks} weeks completed`;
    }
    if (program.type === "innovation") {
      const completed = program.completedModules || 0;
      const total = program.totalModules || 0;
      return `${completed} / ${total} milestones completed`;
    }
    if (program.type === "training") {
      const attended = program.sessionsAttended || 0;
      const total = program.totalSessions || 0;
      return `${attended} / ${total} sessions attended`;
    }
    return `${progress}% Complete`;
  };

  const progress = getProgressPercentage();
  const progressText = getProgressText();

  const getStatusBadge = () => {
    const status = program.status?.toLowerCase() || "";

    if (
      status === "active" ||
      status === "incubating" ||
      status === "approved"
    ) {
      return { label: "Active", color: "bg-emerald-500/20 text-emerald-400" };
    }
    if (status === "pending" || status === "pending_admin") {
      return { label: "Pending", color: "bg-yellow-500/20 text-yellow-400" };
    }
    if (status === "completed" || status === "graduated") {
      return { label: "Completed", color: "bg-blue-500/20 text-blue-400" };
    }
    if (status === "rejected") {
      return { label: "Rejected", color: "bg-red-500/20 text-red-400" };
    }
    return {
      label: status || "Unknown",
      color: "bg-gray-500/20 text-gray-400",
    };
  };

  const statusBadge = getStatusBadge();
  const isActive =
    program.status === "active" ||
    program.status === "incubating" ||
    program.status === "approved";
  const isPending =
    program.status === "pending" || program.status === "pending_admin";

  const getMentorLabel = () => {
    if (program.type === "intern") return "Advisor";
    if (program.type === "innovation" || program.type === "startup")
      return "Mentor";
    if (program.type === "training") return "Trainer";
    return "Mentor";
  };

  const getMentorName = () => {
    if (program.type === "intern") return program.advisor;
    if (program.type === "innovation" || program.type === "startup")
      return program.mentor;
    if (program.type === "training") return program.trainer;
    return null;
  };

  const mentorName = getMentorName();
  const mentorLabel = getMentorLabel();
  const hasMentor =
    mentorName && mentorName !== "Not Assigned" && mentorName !== null;

  const getPrimaryAction = () => {
    if (!isActive) return null;

    switch (program.type) {
      case "intern":
        return {
          text: "Submit Report",
          icon: <PlusCircle className="w-4 h-4" />,
          link: "/intern/reports/new",
          color: "bg-emerald-500 hover:bg-emerald-600",
        };
      case "innovation":
        return {
          text: "Update Milestones",
          icon: <Target className="w-4 h-4" />,
          link: "/innovator/milestones",
          color: "bg-purple-500 hover:bg-purple-600",
        };
      case "startup":
        return {
          text: "Track Growth",
          icon: <TrendingUp className="w-4 h-4" />,
          link: "/startup/progress",
          color: "bg-orange-500 hover:bg-orange-600",
        };
      case "training":
        return {
          text: "View Sessions",
          icon: <Calendar className="w-4 h-4" />,
          link: "/trainee/sessions",
          color: "bg-blue-500 hover:bg-blue-600",
        };
      default:
        return null;
    }
  };

  const getSecondaryAction = () => {
    if (!isActive) return null;

    switch (program.type) {
      case "intern":
        return {
          text: "View Reports",
          icon: <FileText className="w-4 h-4" />,
          link: "/intern/reports",
          color: "bg-gray-600 hover:bg-gray-500",
        };
      case "innovation":
        return {
          text: "View Progress",
          icon: <Eye className="w-4 h-4" />,
          link: "/innovator/progress",
          color: "bg-gray-600 hover:bg-gray-500",
        };
      case "startup":
        return {
          text: "View Details",
          icon: <Eye className="w-4 h-4" />,
          link: "/startup/details",
          color: "bg-gray-600 hover:bg-gray-500",
        };
      case "training":
        return {
          text: "View Certificates",
          icon: <Award className="w-4 h-4" />,
          link: "/trainee/certificates",
          color: "bg-gray-600 hover:bg-gray-500",
        };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();
  const secondaryAction = getSecondaryAction();

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:border-emerald-500/50">
      <div className="p-6 border-b border-gray-700 bg-linear-to-r from-emerald-500/10 to-teal-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-r from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center">
              {program.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{program.title}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
                {hasMentor && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    {mentorLabel}: {mentorName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Next Action Card - New */}
        {isActive && (
          <div className="bg-linear-to-r from-emerald-600/20 to-teal-600/20 rounded-xl border border-emerald-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-emerald-400">Next Action</p>
                <p className="text-white font-semibold">
                  {program.type === "intern" && "Submit Your Weekly Report"}
                  {program.type === "innovation" && "Update Your Milestones"}
                  {program.type === "startup" && "Track Your Growth Metrics"}
                  {program.type === "training" && "View Upcoming Sessions"}
                </p>
              </div>
              {primaryAction && (
                <button
                  onClick={() => onAction(primaryAction.link)}
                  className={`px-4 py-2 text-white rounded-lg transition font-medium text-sm ${primaryAction.color}`}
                >
                  {primaryAction.text}
                </button>
              )}
            </div>
          </div>
        )}

        {!hasMentor && isActive && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400">
              {program.type === "intern" &&
                "Your director will assign an advisor soon. You'll be notified when assigned."}
              {(program.type === "innovation" || program.type === "startup") &&
                "Your director will assign a mentor to guide your journey."}
              {program.type === "training" &&
                "A trainer will be assigned to conduct your sessions."}
            </p>
          </div>
        )}

        {/* Progress Bar with Explanation */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1">
              Program Progress
              <div className="relative group">
                <Info className="w-3 h-3 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10">
                  {program.type === "intern" &&
                    "Based on weekly reports submitted"}
                  {program.type === "innovation" &&
                    "Based on milestones completed"}
                  {program.type === "training" && "Based on sessions attended"}
                  {program.type === "startup" && "Based on progress metrics"}
                </div>
              </div>
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progressText}</p>
        </div>

        {/* Program Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {program.details.map((detail, idx) => (
            <div key={idx} className="bg-gray-700/30 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
              <p className="text-base font-semibold text-white">
                {detail.value !== undefined && detail.value !== null
                  ? detail.value
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Program-Specific Info */}
        {program.type === "innovation" && program.milestones && (
          <div className="bg-gray-700/30 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Milestones
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-white">
                {program.milestones?.completed || 0}/
                {program.milestones?.total || 0}
              </span>
              <span className="text-xs text-gray-400">completed</span>
            </div>
          </div>
        )}

        {program.type === "training" &&
          program.skills &&
          program.skills.length > 0 && (
            <div className="bg-gray-700/30 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Skills
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {program.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {program.skills.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{program.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

        {program.type === "startup" && program.founders && (
          <div className="bg-gray-700/30 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Founders
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-white">
                {program.founders.length}
              </span>
              <span className="text-xs text-gray-400">team members</span>
            </div>
          </div>
        )}

        {/* Last Activity */}
        {program.lastActivity && (
          <div className="flex items-center gap-2 text-sm text-gray-400 border-t border-gray-700 pt-4">
            <Calendar className="w-4 h-4" />
            <span>
              Last activity:{" "}
              {new Date(program.lastActivity).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isPending && (
            <button
              onClick={() => onAction(`/applications/apply/${program.type}`)}
              className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl transition font-medium flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Application Pending
            </button>
          )}

          {!isPending && !isActive && (
            <button
              onClick={() => onAction(`/applications/apply/${program.type}`)}
              className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition font-medium flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Application
            </button>
          )}

          {isActive && (
            <>
              {secondaryAction && (
                <button
                  onClick={() => onAction(secondaryAction.link)}
                  className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition font-medium flex items-center justify-center gap-2"
                >
                  {secondaryAction.icon}
                  {secondaryAction.text}
                </button>
              )}
              {primaryAction && (
                <button
                  onClick={() => onAction(primaryAction.link)}
                  className={`flex-1 py-2.5 text-white rounded-xl transition font-medium flex items-center justify-center gap-2 ${primaryAction.color}`}
                >
                  {primaryAction.icon}
                  {primaryAction.text}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
