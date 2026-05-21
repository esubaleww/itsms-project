import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, Users, Award } from "lucide-react";

const TeamStatsCards = ({ stats, membersCount }) => {
  const cards = [
    {
      title: "Completion Rate",
      value: `${stats?.completionRate.toFixed(2) || 0}%`,
      icon: TrendingUp,
      description: "Overall performance",
      topBorder: "border-t-[3px] border-t-[#2563eb]",
    },
    {
      title: "Team Members",
      value: membersCount || 0,
      icon: Users,
      description: "Active members",
      topBorder: "border-t-[3px] border-t-[#10b981]",
    },
    {
      title: "Tasks Completed",
      value: stats?.stats?.completed || 0,
      icon: CheckCircle,
      description: "Successfully completed",
      topBorder: "border-t-[3px] border-t-[#f59e0b]",
    },
    {
      title: "Team Rating",
      value: stats?.teamRating || "N/A",
      icon: Award,
      description: "Performance grade",
      topBorder: "border-t-[3px] border-t-[#8b5cf6]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white border-l border-r border-b border-[#E5E7EB] ${card.topBorder} rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#374151] text-[1rem] mb-1 font-medium">
                  {card.title}
                </p>
                <p className="text-[#111827] text-[2rem] font-bold mt-1">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString()
                    : card.value}
                </p>
                <p className="text-[#6b7280] text-[0.875rem] mt-2">
                  {card.description}
                </p>
              </div>
              <div className="bg-[#EEF2FF] rounded-[10px] p-[10px]">
                <Icon className="w-6 h-6 text-[#2563eb]" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TeamStatsCards;
