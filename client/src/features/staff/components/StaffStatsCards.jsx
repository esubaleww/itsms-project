import { motion } from "framer-motion";
import {
  CheckSquare,
  GraduationCap,
  Lightbulb,
  School,
  Users,
} from "lucide-react";

const StaffStatsCards = ({
  stats,
  isServiceStaff,
  canAdvise,
  canMentor,
  canTrain,
  advisorStats,
  mentorStats,
  trainerStats,
}) => {
  const cards = [];

  if (isServiceStaff && stats && stats.totalTasks !== undefined) {
    cards.push({
      title: "My Tasks",
      value: stats?.totalTasks || 0,
      subValue: `${stats?.completedTasks || 0} completed`,
      icon: CheckSquare,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      topBorder: "border-t-blue-600",
    });
  }

  if (canAdvise && advisorStats && advisorStats.totalInterns > 0) {
    cards.push({
      title: "Pending Reports",
      value: advisorStats.pendingReports || 0,
      subValue: `${advisorStats.totalInterns} total interns`,
      icon: GraduationCap,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      topBorder: "border-t-amber-500",
    });
  }

  if (canMentor && mentorStats) {
    cards.push({
      title: "Pending Reviews",
      value: mentorStats.pendingReviews || 0,
      subValue: "Milestones awaiting feedback",
      icon: Lightbulb,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      topBorder: "border-t-purple-500",
    });

    cards.push({
      title: "Active Mentees",
      value: mentorStats.totalMentees || 0,
      subValue: "Innovators & startups in portfolio",
      icon: Users,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      topBorder: "border-t-green-500",
    });
  }

  if (canTrain && trainerStats && trainerStats.totalTrainees > 0) {
    cards.push({
      title: "Active Trainees",
      value: trainerStats.totalTrainees,
      subValue: `${trainerStats.pendingSessions || 0} upcoming sessions`,
      icon: School,
      bgColor: "bg-sky-50",
      iconColor: "text-sky-600",
      topBorder: "border-t-sky-500",
    });
  }

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white border-l border-r border-b border-gray-200 ${card.topBorder} rounded-xl p-6 shadow-sm overflow-hidden relative transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex justify-between items-start">
              <div className="z-10">
                <p className="text-text-secondary text-sm mb-1 font-medium">
                  {card.title}
                </p>
                <p className="text-text-primary text-2xl font-bold mt-1">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString()
                    : card.value}
                </p>
                {card.subValue && (
                  <p className="text-text-muted text-xs mt-2">
                    {card.subValue}
                  </p>
                )}
              </div>
              <div className={`${card.bgColor} rounded-lg p-2.5`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StaffStatsCards;
