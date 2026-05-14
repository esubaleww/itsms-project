import { motion } from "framer-motion";
import {
  CheckSquare,
  GraduationCap,
  Lightbulb,
  School,
  Users,
  Clock,
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
      icon: <CheckSquare className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-700",
      bg: "bg-[#EEF2FF]",
    });
  }

  if (canAdvise && advisorStats && advisorStats.totalInterns > 0) {
    cards.push({
      title: "Pending Reports",
      value: advisorStats.pendingReports || 0,
      subValue: `${advisorStats.totalInterns} total interns`,
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-purple-500 to-pink-700",
      bg: "bg-purple-500/20",
    });
  }

  if (canMentor && mentorStats) {
    cards.push({
      title: "Pending Reviews",
      value: mentorStats.pendingReviews || 0,
      subValue: "Milestones awaiting feedback",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "from-orange-500 to-red-700",
      bg: "bg-orange-500/20",
    });

    cards.push({
      title: "Active Mentees",
      value: mentorStats.totalMentees || 0,
      subValue: `${mentorStats.completedMentees || 0} completed`,
      icon: <Users className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-700",
      bg: "bg-[#EEF2FF]",
    });
  }

  if (canTrain && trainerStats && trainerStats.totalTrainees > 0) {
    cards.push({
      title: "Active Trainees",
      value: trainerStats.totalTrainees,
      subValue: `${trainerStats.pendingSessions || 0} upcoming sessions`,
      icon: <School className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-700",
      bg: "bg-cyan-500/20",
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-xl border border-[#E5E7EB] p-5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#6b7280] text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-[#111827] mt-1">{card.value}</p>
              {card.subValue && (
                <p className="text-xs text-[#6b7280] mt-1">{card.subValue}</p>
              )}
            </div>
            <div
              className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}
            >
              <div className={card.color.split(" ")[0].replace("from-", "text-")}>
                {card.icon}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StaffStatsCards;
