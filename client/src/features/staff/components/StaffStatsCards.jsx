// client/src/features/staff/components/StaffStatsCards.jsx
import { motion } from "framer-motion";
import {
  CheckSquare,
  TrendingUp,
  GraduationCap,
  Lightbulb,
  School,
} from "lucide-react";

const StaffStatsCards = ({
  stats,
  canAdvise,
  canMentor,
  canTrain,
  advisorStats,
  mentorStats,
  trainerStats,
}) => {
  const cards = [];

  // Service Tasks Stats - always show if staff has tasks
  if (stats && stats.totalTasks !== undefined) {
    cards.push({
      title: "My Tasks",
      value: stats?.totalTasks || 0,
      subValue: `${stats?.completedTasks || 0} completed`,
      icon: <CheckSquare className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-700",
      bg: "bg-emerald-500/20",
    });
    cards.push({
      title: "Completion Rate",
      value: `${stats?.completionRate || 0}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-700",
      bg: "bg-blue-500/20",
    });
  }

  // Advisor Stats - only if staff has canAdvise permission
  if (canAdvise && advisorStats && advisorStats.totalInterns > 0) {
    cards.push({
      title: "My Interns",
      value: advisorStats.totalInterns,
      subValue: `${advisorStats.pendingReports || 0} pending reports`,
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-purple-500 to-pink-700",
      bg: "bg-purple-500/20",
    });
  }

  // Mentor Stats - only if staff has canMentor permission
  if (canMentor && mentorStats && mentorStats.totalMentees > 0) {
    cards.push({
      title: "My Mentees",
      value: mentorStats.totalMentees,
      subValue: `${mentorStats.pendingMilestones || 0} pending milestones`,
      icon: <Lightbulb className="w-6 h-6" />,
      color: "from-orange-500 to-red-700",
      bg: "bg-orange-500/20",
    });
  }

  // Trainer Stats - only if staff has canTrain permission
  if (canTrain && trainerStats && trainerStats.totalTrainees > 0) {
    cards.push({
      title: "My Trainees",
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
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              {card.subValue && (
                <p className="text-xs text-gray-500 mt-1">{card.subValue}</p>
              )}
            </div>
            <div
              className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}
            >
              <div
                className={`bg-linear-to-r ${card.color} bg-clip-text text-transparent`}
              >
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
