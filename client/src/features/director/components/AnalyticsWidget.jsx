// client/src/features/dashboard/components/AnalyticsWidget.jsx
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  CheckCircle,
  Briefcase,
  Award,
  Activity,
  Target,
  PieChart,
  GraduationCap,
  Rocket,
  Lightbulb,
  FileText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useDirectorAnalytics } from "../../../hooks/useDirectorAnalytics";

const AnalyticsWidget = () => {
  const { analytics, loading, fetchAnalytics } = useDirectorAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !analytics.weeklyActivity.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Completion Rate",
      value: `${analytics.completionRate}%`,
      icon: TrendingUp,
      color: "emerald",
      description: "Overall performance",
    },
    {
      title: "Total Requests",
      value: analytics.totalRequests || 0,
      icon: Briefcase,
      color: "blue",
      description: "All requests",
    },
    {
      title: "Completed",
      value: analytics.completedRequests || 0,
      icon: CheckCircle,
      color: "green",
      description: "Successfully completed",
    },
    {
      title: "Active Teams",
      value: analytics.teamPerformance?.length || 0,
      icon: Users,
      color: "purple",
      description: "Working teams",
    },
  ];

  const getDirectorateMetrics = () => {
    const type = analytics.directorate?.type;
    if (type === "internship") {
      return [
        {
          label: "Active Interns",
          value: analytics.directorateSpecific?.activeInterns || 0,
          icon: GraduationCap,
          color: "emerald",
        },
        {
          label: "Total Interns",
          value: analytics.directorateSpecific?.totalInterns || 0,
          icon: Users,
          color: "blue",
        },
        {
          label: "Reports Submitted",
          value: analytics.directorateSpecific?.reportsSubmitted || 0,
          icon: FileText,
          color: "purple",
        },
      ];
    } else if (type === "innovation") {
      return [
        {
          label: "Active Innovators",
          value: analytics.directorateSpecific?.activeInnovators || 0,
          icon: Lightbulb,
          color: "emerald",
        },
        {
          label: "Total Innovators",
          value: analytics.directorateSpecific?.totalInnovators || 0,
          icon: Users,
          color: "blue",
        },
        {
          label: "Graduated",
          value: analytics.directorateSpecific?.graduatedInnovators || 0,
          icon: Award,
          color: "purple",
        },
      ];
    } else if (type === "startup") {
      return [
        {
          label: "Active Startups",
          value: analytics.directorateSpecific?.activeStartups || 0,
          icon: Rocket,
          color: "emerald",
        },
        {
          label: "Total Startups",
          value: analytics.directorateSpecific?.totalStartups || 0,
          icon: Users,
          color: "blue",
        },
        {
          label: "Graduated",
          value: analytics.directorateSpecific?.graduatedStartups || 0,
          icon: Award,
          color: "purple",
        },
      ];
    }
    return [];
  };

  const directorateMetrics = getDirectorateMetrics();

  return (
    <div className="space-y-6">
      {/* Directorate Header */}
      <div className="bg-linear-to-r from-emerald-500/20 to-teal-700/20 rounded-xl p-4 border border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Your Directorate</p>
            <p className="text-xl font-bold text-white">
              {analytics.directorate?.name || "Loading..."}
            </p>
            <p className="text-xs text-emerald-400 capitalize mt-1">
              {analytics.directorate?.type} Directorate
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
            {analytics.directorate?.type === "internship" && (
              <GraduationCap className="w-6 h-6 text-emerald-400" />
            )}
            {analytics.directorate?.type === "innovation" && (
              <Lightbulb className="w-6 h-6 text-emerald-400" />
            )}
            {analytics.directorate?.type === "startup" && (
              <Rocket className="w-6 h-6 text-emerald-400" />
            )}
            {!analytics.directorate?.type && (
              <Briefcase className="w-6 h-6 text-emerald-400" />
            )}
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
            <div className="flex items-end justify-between mt-2">
              <span className="text-2xl font-bold text-white">
                {metric.value}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Directorate-Specific Metrics */}
      {directorateMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {directorateMetrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="bg-gray-800/60 rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                <span className="text-gray-400 text-sm">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Weekly Activity Chart */}
      <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Weekly Activity
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-400">Requests</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-400">Completed</span>
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={analytics.weeklyActivity}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="requests"
              stroke="#10B981"
              fill="url(#colorRequests)"
              name="Requests"
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

      {/* Request Distribution & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            Request Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={analytics.requestDistribution}
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
                {analytics.requestDistribution.map((entry, idx) => (
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
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Request Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={analytics.statusDistribution}
              layout="vertical"
              margin={{ left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9CA3AF"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {analytics.statusDistribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Team Performance
        </h3>
        <div className="space-y-3">
          {analytics.teamPerformance.map((team, idx) => (
            <div key={idx} className="p-3 bg-gray-700/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{team.name}</span>
                <span className="text-emerald-400 text-sm">
                  {team.completionRate}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{team.members} members</span>
                <span>
                  {team.completedRequests}/{team.totalRequests} tasks
                </span>
                <span>{team.pendingReports} reports</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${team.completionRate}%` }}
                />
              </div>
            </div>
          ))}
          {analytics.teamPerformance.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No teams found in your directorate
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
