import { motion } from "framer-motion";
import { CheckCircle, Clock, TrendingUp, Users, Award } from "lucide-react";

const TeamStatsCards = ({ stats, membersCount }) => {
  const cards = [
    {
      title: "Completion Rate",
      value: `${stats?.completionRate.toFixed(2) || 0}%`,
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
      value: stats?.stats?.completed || 0,
      icon: CheckCircle,
      color: "green",
      description: "Successfully completed",
    },
    {
      title: "Team Rating",
      value: stats?.teamRating || "N/A",
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
          className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl p-4 border border-[#E5E7EB] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#6b7280] text-xs uppercase tracking-wide">
              {card.description}
            </span>
            <card.icon className={`w-5 h-5 text-${card.color}-400`} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#111827]">{card.value}</span>
          </div>
          <p className="text-xs text-[#6b7280] mt-1">{card.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamStatsCards;
