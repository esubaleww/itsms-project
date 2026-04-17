import {
  Bell,
  CheckCircle,
  FileText,
  UserCheck,
  Activity,
  Award,
  Clock,
  Target,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Rocket,
  Lightbulb,
  School,
  Briefcase,
  UserPlus,
  AlertCircle,
} from "lucide-react";

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type, category = null) => {
    // Map activity types to icons based on user role and action type
    const iconMap = {
      // General actions
      approval: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      submission: <FileText className="w-4 h-4 text-blue-400" />,
      assignment: <UserCheck className="w-4 h-4 text-purple-400" />,
      update: <Activity className="w-4 h-4 text-yellow-400" />,
      rejection: <AlertCircle className="w-4 h-4 text-red-400" />,
      completion: <Award className="w-4 h-4 text-emerald-400" />,

      // Program-specific actions
      report: <FileText className="w-4 h-4 text-blue-400" />,
      milestone: <Target className="w-4 h-4 text-purple-400" />,
      session: <Calendar className="w-4 h-4 text-cyan-400" />,
      attendance: <UserCheck className="w-4 h-4 text-green-400" />,
      certificate: <Award className="w-4 h-4 text-amber-400" />,

      // Role-specific actions
      advisor_review: <MessageSquare className="w-4 h-4 text-blue-400" />,
      mentor_guidance: <Lightbulb className="w-4 h-4 text-yellow-400" />,
      trainer_session: <School className="w-4 h-4 text-orange-400" />,
      team_update: <Users className="w-4 h-4 text-purple-400" />,

      // Default
      default: <Bell className="w-4 h-4 text-gray-400" />,
    };

    // Check if type exists in map
    if (iconMap[type]) return iconMap[type];

    // Check based on category
    if (category === "intern") {
      if (type === "report") return iconMap.report;
      if (type === "advisor_review") return iconMap.advisor_review;
    }

    if (category === "innovator") {
      if (type === "milestone") return iconMap.milestone;
      if (type === "mentor_guidance") return iconMap.mentor_guidance;
    }

    if (category === "startup") {
      if (type === "milestone") return iconMap.milestone;
      if (type === "team_update") return iconMap.team_update;
    }

    if (category === "trainee") {
      if (type === "session") return iconMap.session;
      if (type === "attendance") return iconMap.attendance;
      if (type === "certificate") return iconMap.certificate;
    }

    if (category === "advisor") {
      if (type === "report_review") return iconMap.advisor_review;
    }

    if (category === "mentor") {
      if (type === "milestone_review") return iconMap.mentor_guidance;
    }

    if (category === "trainer") {
      if (type === "session_created") return iconMap.trainer_session;
      if (type === "attendance_recorded") return iconMap.attendance;
    }

    return iconMap.default;
  };

  const getActivityMessage = (activity) => {
    // If activity already has a message, use it
    if (activity.message) return activity.message;

    // Generate message based on type and category
    const { type, title, details, user, program } = activity;

    if (type === "report_submitted") {
      return `You submitted week ${details?.week || ""} report`;
    }
    if (type === "report_reviewed") {
      return `Your week ${details?.week || ""} report was reviewed by advisor`;
    }
    if (type === "advisor_summary") {
      return `Your advisor submitted a summary for you`;
    }
    if (type === "milestone_updated") {
      return `Milestone "${title}" status updated to ${details?.status}`;
    }
    if (type === "milestone_added") {
      return `New milestone "${title}" added to your plan`;
    }
    if (type === "session_created") {
      return `New training session "${title}" scheduled for ${details?.date}`;
    }
    if (type === "attendance_marked") {
      return `You attended session "${title}"`;
    }
    if (type === "certificate_generated") {
      return `Certificate generated for "${title}"`;
    }
    if (type === "trainer_assigned") {
      return `${user?.fullName || "A trainer"} was assigned as your trainer`;
    }
    if (type === "mentor_assigned") {
      return `${user?.fullName || "A mentor"} was assigned as your mentor`;
    }
    if (type === "advisor_assigned") {
      return `${user?.fullName || "An advisor"} was assigned as your advisor`;
    }
    if (type === "program_approved") {
      return `Your ${program || "program"} application was approved`;
    }
    if (type === "program_rejected") {
      return `Your ${program || "program"} application was rejected`;
    }
    if (type === "program_completed") {
      return `You completed your ${program || "program"} program! 🎉`;
    }

    return activity.message || "Activity recorded";
  };

  const getActivityTime = (activity) => {
    if (activity.time) return activity.time;
    if (activity.createdAt)
      return new Date(activity.createdAt).toLocaleDateString();
    if (activity.timestamp)
      return new Date(activity.timestamp).toLocaleDateString();
    return "Recently";
  };

  if (!activities || activities.length === 0) return null;

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            {getActivityIcon(activity.type, activity.category)}
            <div className="flex-1">
              <p className="text-sm text-white">
                {getActivityMessage(activity)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {getActivityTime(activity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
