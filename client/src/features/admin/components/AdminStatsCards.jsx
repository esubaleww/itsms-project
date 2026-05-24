import { motion } from "framer-motion";
import { Users, Briefcase, TrendingUp, Clock } from "lucide-react";

const AdminStatsCards = ({ stats, onTabChange, loading }) => {
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
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      topBorder: "border-t-blue-600",
      change: `${stats?.newUsersThisMonth || 0} new this month`,
      tab: "users",
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests || 0,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      topBorder: "border-t-amber-500",
      change: `${pendingPercentage}% of total requests`,
      tab: "requests",
    },
    {
      title: "Active Interns",
      value: stats?.activeInterns || 0,
      icon: Briefcase,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      topBorder: "border-t-green-600",
      change: `${stats?.activeInterns || 0} currently interning`,
      tab: "users",
    },
    {
      title: "Active Innovators",
      value: stats?.activeInnovators || 0,
      icon: TrendingUp,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      topBorder: "border-t-purple-600",
      change: `${stats?.activeStartups || 0} startups incubating`,
      tab: "users",
    },
  ];

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
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
          className={`bg-white border-l border-r border-b border-gray-200 border-t-[3px] ${card.topBorder} rounded-xl p-6 shadow-sm overflow-hidden relative group ${
            card.tab
              ? "cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
              : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="z-10">
              <p className="text-text-secondary text-sm mb-1 font-medium">
                {card.title}
              </p>
              <p className="text-text-primary text-3xl font-bold mt-1">
                {card.value.toLocaleString()}
              </p>
              <p className="text-text-muted text-xs mt-2">{card.change}</p>
            </div>
            <div
              className={`${card.iconBg} rounded-lg p-2.5 group-hover:scale-105 transition-transform duration-200`}
            >
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
