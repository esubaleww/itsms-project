import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, Users, Award } from "lucide-react";

const TeamStatsCards = ({ stats, membersCount }) => {
  const cards = [
    {
      title: "Completion Rate",
      value: `${stats?.completionRate?.toFixed(2) || 0}%`,
      icon: TrendingUp,
      description: "Overall performance",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      topBorder: "border-t-green-600",
    },
    {
      title: "Team Members",
      value: membersCount || 0,
      icon: Users,
      description: "Active members",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      topBorder: "border-t-blue-600",
    },
    {
      title: "Tasks Completed",
      value: stats?.stats?.completed || 0,
      icon: CheckCircle,
      description: "Successfully completed",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      topBorder: "border-t-emerald-600",
    },
    {
      title: "Team Rating",
      value: stats?.teamRating || "N/A",
      icon: Award,
      description: "Performance grade",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      topBorder: "border-t-purple-600",
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
            className={`bg-white border-l border-r border-b border-gray-200 ${card.topBorder} rounded-xl p-6 shadow-sm overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-text-secondary text-sm mb-1 font-medium">
                  {card.title}
                </p>
                <p className="text-text-primary text-3xl font-bold mt-1">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString()
                    : card.value}
                </p>
                <p className="text-text-muted text-xs mt-2">
                  {card.description}
                </p>
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

export default TeamStatsCards;
