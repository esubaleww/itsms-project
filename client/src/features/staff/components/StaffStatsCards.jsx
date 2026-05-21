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
      topBorder: "border-t-[3px] border-t-[#2563eb]",
    });
  }

  if (canAdvise && advisorStats && advisorStats.totalInterns > 0) {
    cards.push({
      title: "Pending Reports",
      value: advisorStats.pendingReports || 0,
      subValue: `${advisorStats.totalInterns} total interns`,
      icon: GraduationCap,
      topBorder: "border-t-[3px] border-t-[#f59e0b]",
    });
  }

  if (canMentor && mentorStats) {
    cards.push({
      title: "Pending Reviews",
      value: mentorStats.pendingReviews || 0,
      subValue: "Milestones awaiting feedback",
      icon: Lightbulb,
      topBorder: "border-t-[3px] border-t-[#8b5cf6]",
    });

    cards.push({
      title: "Active Mentees",
      value: mentorStats.totalMentees || 0,
      subValue: "Innovators & startups in portfolio",
      icon: Users,
      topBorder: "border-t-[3px] border-t-[#10b981]",
    });
  }

  if (canTrain && trainerStats && trainerStats.totalTrainees > 0) {
    cards.push({
      title: "Active Trainees",
      value: trainerStats.totalTrainees,
      subValue: `${trainerStats.pendingSessions || 0} upcoming sessions`,
      icon: School,
      topBorder: "border-t-[3px] border-t-[#0ea5e9]",
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
            className={`bg-white border-l border-r border-b border-[#E5E7EB] ${card.topBorder} rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden relative transition-all duration-200 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]`}
          >
            <div className="flex justify-between items-start">
              <div className="z-10">
                <p className="text-[#374151] text-[1rem] mb-1 font-medium">
                  {card.title}
                </p>
                <p className="text-[#111827] text-[2rem] font-bold mt-1">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString()
                    : card.value}
                </p>
                {card.subValue && (
                  <p className="text-[#6b7280] text-[0.875rem] mt-2">
                    {card.subValue}
                  </p>
                )}
              </div>
              <div className="bg-[#EEF2FF] rounded-[10px] p-[10px] group-hover:scale-105 transition-transform duration-200">
                <Icon className="w-6 h-6 text-[#2563eb]" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StaffStatsCards;
