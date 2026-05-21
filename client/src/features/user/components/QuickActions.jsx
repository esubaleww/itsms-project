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
        show: true,
        disabled: false,
        icon: <GraduationCap className="w-5 h-5 text-[#2563eb]" />,
        title: "Apply for Program",
        description: "Internship, Innovation & more",
        bgColor: "bg-[#EEF2FF]",
        borderColor: "border-[#2563eb]/30",
        hoverColor: "hover:bg-[#EEF2FF]",
        textColor: "text-[#2563eb]",
        tooltip: null,
      };
    }

    if (
      programStatus === "active" ||
      programStatus === "incubating" ||
      programStatus === "approved"
    ) {
      return {
        show: false,
        disabled: true,
        icon: <CheckCircle className="w-5 h-5 text-[#2563eb]" />,
        title: "Program Active",
        description: "You're already enrolled",
        bgColor: "bg-[#EEF2FF]",
        borderColor: "border-[#2563eb]/30",
        hoverColor: "",
        textColor: "text-[#2563eb]",
        tooltip: `You are already enrolled in an active ${programStatus} program.`,
      };
    }

    if (programStatus === "pending" || programStatus === "pending_admin") {
      return {
        show: true,
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

    if (programStatus === "completed" || programStatus === "graduated") {
      return {
        show: true,
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
        show: true,
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
      show: false,
      disabled: true,
      icon: <AlertCircle className="w-5 h-5 text-[#6b7280]" />,
      title: "Cannot Apply",
      description: "Contact admin for assistance",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/30",
      hoverColor: "hover:bg-gray-500/20",
      textColor: "text-[#6b7280]",
      tooltip: "Please contact the administrator for assistance.",
    };
  };

  const programButtonState = getProgramButtonState();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <button
        onClick={onRequestService}
        className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-all duration-200 hover:scale-[1.02] group"
      >
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <PlusCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-[#0f172a] text-sm">Request Service</p>
          <p className="text-xs text-[#4b5563]">Get technical support</p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#64748b] ml-auto group-hover:text-blue-400 transition" />
      </button>

      <button
        onClick={onViewAllRequests}
        className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-all duration-200 hover:scale-[1.02] group"
      >
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <List className="w-5 h-5 text-purple-600" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-[#0f172a] text-sm">View All Requests</p>
          <p className="text-xs text-[#4b5563]">Track your service tickets</p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#64748b] ml-auto group-hover:text-purple-400 transition" />
      </button>

      {programButtonState.show && (
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
                className={`font-semibold text-[#0f172a] text-sm ${programButtonState.disabled ? "" : programButtonState.textColor}`}
              >
                {programButtonState.title}
              </p>
              <p className="text-xs text-[#4b5563]">
                {programButtonState.description}
              </p>
            </div>
            {!programButtonState.disabled && (
              <ChevronRight
                className={`w-4 h-4 text-[#6b7280] ml-auto transition group-hover:${programButtonState.textColor}`}
              />
            )}
          </button>
          {programButtonState.disabled && programButtonState.tooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-[#F9FAFB] text-[#111827] text-xs rounded-lg px-3 py-1.5 whitespace-nowrap z-10 shadow-lg">
              {programButtonState.tooltip}
            </div>
          )}
        </div>
      )}

      {!programButtonState.show && <div className="hidden md:block" />}
    </div>
  );
};

export default QuickActions;
