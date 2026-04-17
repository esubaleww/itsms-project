import { motion } from "framer-motion";
import { CheckCircle, Clock, TrendingUp, Users, Award } from "lucide-react";

const TeamStatsCards = ({ stats, membersCount }) => {
  const cards = [
    {
      title: "Completion Rate",
      value: `${stats?.completionRate || 0}%`,
      icon: TrendingUp,
      color: "emerald",
      description: "Overall performance",
    },
    {
      title: "Team Members",
      value: membersCount || 0,
      icon: Users,
      color: "blue",
      description: "Active members",
    },
    {
      title: "Tasks Completed",
      value: stats?.completedTasks || 0,
      icon: CheckCircle,
      color: "green",
      description: "Successfully completed",
    },
    {
      title: "Team Rating",
      value: stats?.teamRating || "A",
      icon: Award,
      color: "purple",
      description: "Performance grade",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-gray-800/60 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              {card.description}
            </span>
            <card.icon className={`w-5 h-5 text-${card.color}-400`} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{card.value}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{card.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamStatsCards;
