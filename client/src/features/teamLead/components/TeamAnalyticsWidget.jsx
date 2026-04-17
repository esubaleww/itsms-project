import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Activity,
  Target,
  Star,
  Briefcase,
  Calendar,
  Award,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTeamLeadAnalytics } from "../../../hooks/useTeamLeadAnalutics";

const TeamAnalyticsWidget = () => {
  const { analytics, loading, fetchAnalytics } = useTeamLeadAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !analytics.weeklyActivity.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const metrics = [
    {
      title: "Completion Rate",
      value: `${analytics.teamPerformance.completionRate}%`,
      icon: TrendingUp,
      color: "emerald",
      description: "Overall team performance",
    },
    {
      title: "Total Tasks",
      value: analytics.teamPerformance.totalTasks,
      icon: Briefcase,
      color: "blue",
      description: "All assigned tasks",
    },
    {
      title: "Completed",
      value: analytics.teamPerformance.completedTasks,
      icon: CheckCircle,
      color: "green",
      description: "Successfully completed",
    },
    {
      title: "Team Rating",
      value: analytics.teamPerformance.teamRating,
      icon: Star,
      color: "purple",
      description: "Performance grade",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-linear-to-r from-emerald-500/20 to-teal-700/20 rounded-xl p-4 border border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Your Team</p>
            <p className="text-xl font-bold text-white">
              {analytics.team.name}
            </p>
            <p className="text-xs text-emerald-400 mt-1">
              {analytics.team.directorate} Directorate
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-800/60 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                {metric.description}
              </span>
              <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">
                {metric.value}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Weekly Activity
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-gray-400">Tasks</span>
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-400">Completed</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.weeklyActivity}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#10B981"
                fill="url(#colorTasks)"
                name="Tasks"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#3B82F6"
                fill="url(#colorCompleted)"
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution */}
        <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Task Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.taskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: "#6B7280" }}
              >
                {analytics.taskDistribution.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.color}
                    stroke="#1F2937"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member Performance */}
      <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Member Performance
        </h3>
        <div className="space-y-3">
          {analytics.memberPerformance.slice(0, 5).map((member, idx) => (
            <div key={idx} className="p-3 bg-gray-700/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{member.name}</span>
                <span className="text-emerald-400 text-sm">
                  {member.completionRate}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{member.position}</span>
                <span>
                  {member.completedTasks}/{member.totalTasks} tasks
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{member.rating?.toFixed(1)}</span>
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${member.completionRate}%` }}
                />
              </div>
            </div>
          ))}
          {analytics.memberPerformance.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No members found
            </div>
          )}
        </div>
      </div>

      {/* Recent Reports */}
      {analytics.recentReports.length > 0 && (
        <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Recent Reports
          </h3>
          <div className="space-y-2">
            {analytics.recentReports.map((report, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg"
              >
                <div>
                  <p className="text-white text-sm">{report.title}</p>
                  <p className="text-xs text-gray-500">
                    By: {report.submittedBy}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      report.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : report.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {report.status}
                  </span>
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAnalyticsWidget;
