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
        icon: <GraduationCap className="w-5 h-5 text-accent" />,
        title: "Apply for Program",
        description: "Internship, Innovation & more",
        bgColor: "bg-blue-50",
        borderColor: "border-accent/30",
        hoverColor: "hover:bg-blue-50",
        textColor: "text-accent",
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
        icon: <CheckCircle className="w-5 h-5 text-accent" />,
        title: "Program Active",
        description: "You're already enrolled",
        bgColor: "bg-blue-50",
        borderColor: "border-accent/30",
        hoverColor: "",
        textColor: "text-accent",
        tooltip: `You are already enrolled in an active ${programStatus} program.`,
      };
    }

    if (programStatus === "pending" || programStatus === "pending_admin") {
      return {
        show: true,
        disabled: true,
        icon: <Clock className="w-5 h-5 text-yellow-600" />,
        title: "Application Pending",
        description: "Your application is being reviewed",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-500/30",
        hoverColor: "hover:bg-yellow-50",
        textColor: "text-yellow-600",
        tooltip:
          "You already have a pending application. Please wait for review.",
      };
    }

    if (programStatus === "completed" || programStatus === "graduated") {
      return {
        show: true,
        disabled: false,
        icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
        title: "Apply for New Program",
        description: "You've completed your program",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-500/30",
        hoverColor: "hover:bg-blue-50",
        textColor: "text-blue-600",
        tooltip: null,
      };
    }

    if (programStatus === "rejected") {
      return {
        show: true,
        disabled: false,
        icon: <GraduationCap className="w-5 h-5 text-orange-600" />,
        title: "Apply Again",
        description: "Your previous application was rejected",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-500/30",
        hoverColor: "hover:bg-orange-50",
        textColor: "text-orange-600",
        tooltip: null,
      };
    }

    return {
      show: false,
      disabled: true,
      icon: <AlertCircle className="w-5 h-5 text-text-muted" />,
      title: "Cannot Apply",
      description: "Contact admin for assistance",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
      hoverColor: "hover:bg-gray-100",
      textColor: "text-text-muted",
      tooltip: "Please contact the administrator for assistance.",
    };
  };

  const programButtonState = getProgramButtonState();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <button
        onClick={onRequestService}
        className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-200 hover:scale-[1.02] group"
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <PlusCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-left">
          <p className="font-heading font-medium text-text-primary text-sm">
            Request Service
          </p>
          <p className="text-xs text-text-muted">Get technical support</p>
        </div>
        <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-blue-600 transition" />
      </button>

      <button
        onClick={onViewAllRequests}
        className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all duration-200 hover:scale-[1.02] group"
      >
        <div className="p-2 bg-purple-100 rounded-lg">
          <List className="w-5 h-5 text-purple-600" />
        </div>
        <div className="text-left">
          <p className="font-heading font-medium text-text-primary text-sm">
            View All Requests
          </p>
          <p className="text-xs text-text-muted">Track your service tickets</p>
        </div>
        <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-purple-600 transition" />
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
                className={`font-heading font-medium text-text-primary text-sm ${programButtonState.disabled ? "" : programButtonState.textColor}`}
              >
                {programButtonState.title}
              </p>
              <p className="text-xs text-text-muted">
                {programButtonState.description}
              </p>
            </div>
            {!programButtonState.disabled && (
              <ChevronRight
                className={`w-4 h-4 text-text-muted ml-auto transition group-hover:${programButtonState.textColor}`}
              />
            )}
          </button>
          {programButtonState.disabled && programButtonState.tooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-gray-100 text-text-primary text-xs rounded-lg px-3 py-1.5 whitespace-nowrap z-10 shadow-md border border-gray-200">
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
