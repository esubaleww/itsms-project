import {
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle,
  Lightbulb,
  Rocket,
  School,
} from "lucide-react";

const StatsSection = ({
  programStatus,
  serviceCount,
  serviceStats = { open: 0, closed: 0 },
}) => {
  const getProgramDisplay = () => {
    if (!programStatus || programStatus === "user") return "No Program";
    if (programStatus === "intern") return "Internship";
    if (programStatus === "innovator") return "Innovation";
    if (programStatus === "startup") return "Startup";
    if (programStatus === "trainee") return "Training";
    return programStatus;
  };

  const getProgramIcon = () => {
    if (!programStatus || programStatus === "user") return GraduationCap;
    if (programStatus === "intern") return GraduationCap;
    if (programStatus === "innovator") return Lightbulb;
    if (programStatus === "startup") return Rocket;
    if (programStatus === "trainee") return School;
    return GraduationCap;
  };

  const ProgramIcon = getProgramIcon();

  const stats = [
    {
      label: "My Program",
      value: getProgramDisplay(),
      icon: ProgramIcon,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      badge:
        programStatus && programStatus !== "user" ? (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-accent">● Active</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-text-muted">Not enrolled</span>
          </div>
        ),
    },
    {
      label: "Service Requests",
      value: serviceCount,
      icon: Briefcase,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      badge:
        serviceCount > 0 ? (
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="flex items-center gap-1 text-yellow-600">
              <Clock className="w-3 h-3" /> {serviceStats.open} Open
            </span>
            <span className="flex items-center gap-1 text-accent">
              <CheckCircle className="w-3 h-3" /> {serviceStats.closed} Closed
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-text-muted">No requests yet</span>
          </div>
        ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 transition-all duration-200 hover:border-accent/30 hover:scale-[1.01]"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {stat.value}
              </p>
              {stat.badge}
            </div>
            <div
              className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
            >
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
