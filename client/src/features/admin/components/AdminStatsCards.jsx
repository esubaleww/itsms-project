// client/src/features/admin/components/AdminStatsCards.jsx
import { motion } from "framer-motion";
import { Users, Briefcase, TrendingUp, Clock } from "lucide-react";

const AdminStatsCards = ({ stats, onTabChange, loading }) => {
  // Calculate derived stats
  const totalRequests =
    (stats?.approvedRequests || 0) +
    (stats?.rejectedRequests || 0) +
    (stats?.pendingRequests || 0);
  const pendingPercentage = totalRequests
    ? (((stats?.pendingRequests || 0) / totalRequests) * 100).toFixed(1)
    : 0;

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: "from-emerald-500 to-teal-700",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      change: `${stats?.newUsersThisMonth || 0} new this month`,
      tab: "users",
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests || 0,
      icon: Clock,
      gradient: "from-yellow-500 to-orange-700",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      change: `${pendingPercentage}% of total requests`,
      tab: "requests",
    },
    {
      title: "Active Interns",
      value: stats?.activeInterns || 0,
      icon: Briefcase,
      gradient: "from-blue-500 to-cyan-700",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      change: `${stats?.activeInterns || 0} currently interning`,
      tab: "users",
    },
    {
      title: "Active Innovators",
      value: stats?.activeInnovators || 0,
      icon: TrendingUp,
      gradient: "from-purple-500 to-indigo-700",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      change: `${stats?.activeStartups || 0} startups incubating`,
      tab: "users",
    },
  ];

  // If loading, show skeleton
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-700 rounded w-16"></div>
                <div className="h-3 bg-gray-700 rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => card.tab && onTabChange?.(card.tab)}
          className={`bg-linear-to-br ${card.gradient} rounded-xl p-6 shadow-lg overflow-hidden relative group ${
            card.tab
              ? "cursor-pointer hover:scale-105 transition-transform duration-300"
              : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="z-10">
              <p className="text-white/80 text-sm mb-1 font-semibold">
                {card.title}
              </p>
              <p className="text-white text-3xl font-bold">
                {card.value.toLocaleString()}
              </p>
              <p className="text-white/60 text-xs mt-2">{card.change}</p>
            </div>
            <div
              className={`${card.iconBg} rounded-lg p-2 group-hover:scale-110 transition-transform duration-300`}
            >
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/10 group-hover:text-white/20 transition-colors duration-300">
            <card.icon className="h-24 w-24" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
