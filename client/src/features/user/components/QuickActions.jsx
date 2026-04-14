// client/src/features/dashboard/components/QuickActions.jsx
import {
  PlusCircle,
  List,
  ChevronRight,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const QuickActions = ({
  onRequestService,
  onViewAllRequests,
  onApplyProgram,
  hasActiveProgram = false,
  programStatus = null,
}) => {
  const getProgramButtonState = () => {
    if (!hasActiveProgram) {
      return {
        disabled: false,
        icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
        title: "Apply for Program",
        description: "Internship, Innovation & more",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        hoverColor: "hover:bg-emerald-500/20",
        textColor: "text-emerald-400",
        tooltip: null,
      };
    }

    if (programStatus === "pending" || programStatus === "pending_admin") {
      return {
        disabled: true,
        icon: <Clock className="w-5 h-5 text-yellow-400" />,
        title: "Application Pending",
        description: "Your application is being reviewed",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        hoverColor: "hover:bg-yellow-500/20",
        textColor: "text-yellow-400",
        tooltip:
          "You already have a pending application. Please wait for review.",
      };
    }

    if (
      programStatus === "active" ||
      programStatus === "incubating" ||
      programStatus === "approved"
    ) {
      return {
        disabled: true,
        icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        title: "Program Active",
        description: "You're already enrolled in a program",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        hoverColor: "hover:bg-emerald-500/20",
        textColor: "text-emerald-400",
        tooltip: `You are already enrolled in an active ${programStatus} program.`,
      };
    }

    if (programStatus === "completed" || programStatus === "graduated") {
      return {
        disabled: false,
        icon: <GraduationCap className="w-5 h-5 text-blue-400" />,
        title: "Apply for New Program",
        description: "You've completed your program",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        hoverColor: "hover:bg-blue-500/20",
        textColor: "text-blue-400",
        tooltip: null,
      };
    }

    if (programStatus === "rejected") {
      return {
        disabled: false,
        icon: <GraduationCap className="w-5 h-5 text-orange-400" />,
        title: "Apply Again",
        description: "Your previous application was rejected",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
        hoverColor: "hover:bg-orange-500/20",
        textColor: "text-orange-400",
        tooltip: null,
      };
    }

    return {
      disabled: true,
      icon: <AlertCircle className="w-5 h-5 text-gray-400" />,
      title: "Cannot Apply",
      description: "Contact admin for assistance",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/30",
      hoverColor: "hover:bg-gray-500/20",
      textColor: "text-gray-400",
      tooltip: "Please contact the administrator for assistance.",
    };
  };

  const programButtonState = getProgramButtonState();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {/* Request Service - Always available */}
      <button
        onClick={onRequestService}
        className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-all duration-200 hover:scale-[1.02] group"
      >
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <PlusCircle className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-white text-sm">Request Service</p>
          <p className="text-xs text-gray-400">Get technical support</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-blue-400 transition" />
      </button>

      {/* View All Requests - Always available */}
      <button
        onClick={onViewAllRequests}
        className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-all duration-200 hover:scale-[1.02] group"
      >
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <List className="w-5 h-5 text-purple-400" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-white text-sm">View All Requests</p>
          <p className="text-xs text-gray-400">Track your service tickets</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-purple-400 transition" />
      </button>

      {/* Apply for Program - Conditional with tooltip */}
      <div className="relative group/tooltip">
        <button
          onClick={onApplyProgram}
          disabled={programButtonState.disabled}
          className={`w-full flex items-center gap-3 p-4 ${programButtonState.bgColor} border ${programButtonState.borderColor} rounded-xl transition-all duration-200 ${
            !programButtonState.disabled && "hover:scale-[1.02]"
          } ${
            programButtonState.disabled
              ? "cursor-not-allowed opacity-60"
              : `hover:${programButtonState.hoverColor}`
          }`}
        >
          <div className={`p-2 ${programButtonState.bgColor} rounded-lg`}>
            {programButtonState.icon}
          </div>
          <div className="text-left">
            <p
              className={`font-semibold text-white text-sm ${programButtonState.disabled ? "" : programButtonState.textColor}`}
            >
              {programButtonState.title}
            </p>
            <p className="text-xs text-gray-400">
              {programButtonState.description}
            </p>
          </div>
          {!programButtonState.disabled && (
            <ChevronRight
              className={`w-4 h-4 text-gray-500 ml-auto transition group-hover:${programButtonState.textColor}`}
            />
          )}
        </button>
        {programButtonState.disabled && programButtonState.tooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap z-10 shadow-lg">
            {programButtonState.tooltip}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
