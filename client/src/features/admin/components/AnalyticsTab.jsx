import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  FileText,
  Award,
  Clock,
  CheckCircle,
  UserCheck,
  Rocket,
  GraduationCap,
  Calendar,
  Activity,
  Target,
  Zap,
  Shield,
  Mail,
  Building2,
  UserPlus,
  ThumbsUp,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Line,
} from "recharts";
import { useAnalytics } from "../../../hooks/useAnalytics";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomBarShape = (props) => {
  const { x, y, width, height, fill } = props;
  if (width <= 0 || height <= 0) return null;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={8}
      ry={8}
      className="transition-all duration-300 hover:opacity-80"
    />
  );
};

const CHART_COLORS = {
  primary: "#10B981",
  secondary: "#3B82F6",
  danger: "#EF4444",
  warning: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  cyan: "#06B6D4",
  orange: "#F97316",
};

const dateRanges = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#9CA3AF"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AnalyticsTab = () => {
  const {
    dailyActivity,
    requestDistribution,
    statusDistribution,
    userStats,
    requestStats,
    programStats,
    performanceMetrics,
    loading,
    fetchAnalytics,
  } = useAnalytics();

  const [dateRange, setDateRange] = useState("30days");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchAnalytics(dateRange);
    setMounted(true);
  }, [dateRange, fetchAnalytics]);

  if (loading && !dailyActivity.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-400">Loading analytics data...</p>
      </div>
    );
  }

  const analyticsCards = [
    {
      title: "Total Users",
      value: userStats?.total || 0,
      icon: Users,
      gradient: "from-emerald-500 to-teal-700",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      change: `${userStats?.verificationRate || 0}% verified`,
      trend: userStats?.growthRate || 0,
    },
    {
      title: "Total Requests",
      value: requestStats?.total || 0,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-700",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      change: `${requestStats?.approvalRate || 0}% approved`,
      trend: requestStats?.growthRate || 0,
    },
    {
      title: "Active Programs",
      value:
        (programStats?.interns?.active || 0) +
        (programStats?.innovators?.active || 0),
      icon: Award,
      gradient: "from-purple-500 to-indigo-700",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      change: `${programStats?.startups?.active || 0} startups`,
      trend: programStats?.growthRate || 0,
    },
    {
      title: "Service Catalog",
      value: performanceMetrics?.services || 0,
      icon: Briefcase,
      gradient: "from-orange-500 to-red-700",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
      change: `${performanceMetrics?.directorates || 0} directorates`,
      trend: performanceMetrics?.servicesGrowth || 0,
    },
  ];

  const roleDistribution =
    userStats?.byRole?.map((role) => ({
      name:
        role._id === "admin"
          ? "Admin"
          : role._id === "staff"
            ? "Staff"
            : role._id === "user"
              ? "User"
              : role._id,
      value: role.count,
      color:
        role._id === "admin"
          ? CHART_COLORS.danger
          : role._id === "staff"
            ? CHART_COLORS.warning
            : CHART_COLORS.primary,
    })) || [];

  const statusDataWithColors =
    statusDistribution?.map((item, index) => ({
      ...item,
      fill: Object.values(CHART_COLORS)[
        index % Object.values(CHART_COLORS).length
      ],
    })) || [];

  const requestDataWithColors =
    requestDistribution?.map((item, index) => ({
      ...item,
      fill: Object.values(CHART_COLORS)[
        index % Object.values(CHART_COLORS).length
      ],
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="pl-9 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-linear-to-br ${card.gradient} rounded-xl p-6 shadow-lg overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex justify-between items-start">
              <div className="z-10">
                <p className="text-white/80 text-sm mb-1 font-semibold">
                  {card.title}
                </p>
                <p className="text-white text-3xl font-bold">
                  {card.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trend !== undefined && card.trend !== 0 && (
                    <>
                      {card.trend > 0 ? (
                        <TrendingUp className="w-3 h-3 text-white/70" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-white/70" />
                      )}
                      <span
                        className={`text-xs ${card.trend > 0 ? "text-white/90" : "text-white/70"}`}
                      >
                        {Math.abs(card.trend)}% vs last period
                      </span>
                    </>
                  )}
                </div>
                <p className="text-white/60 text-xs mt-1">{card.change}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Daily Activity
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>
                {dateRanges.find((d) => d.value === dateRange)?.label}
              </span>
            </div>
          </div>
          <div className="w-full h-80">
            {mounted && dailyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyActivity}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRequests"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorApprovals"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.secondary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.secondary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    interval={dailyActivity.length > 7 ? 1 : 0}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ color: "#F3F4F6", fontSize: "12px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke={CHART_COLORS.primary}
                    fill="url(#colorRequests)"
                    name="Requests"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="approvals"
                    stroke={CHART_COLORS.secondary}
                    fill="url(#colorApprovals)"
                    name="Approvals"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="rejections"
                    stroke={CHART_COLORS.danger}
                    name="Rejections"
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.danger, strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Request Distribution
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Target className="w-3 h-3" />
              <span>By type</span>
            </div>
          </div>
          <div className="w-full h-80">
            {mounted && requestDataWithColors.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={requestDataWithColors}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    labelLine={{ stroke: "#6B7280", strokeWidth: 1 }}
                    label={renderCustomizedLabel}
                  >
                    {requestDataWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ color: "#F3F4F6", fontSize: "12px" }}
                    iconType="circle"
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value, entry) => (
                      <span style={{ color: entry.payload.fill }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Request Status Overview
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle className="w-3 h-3" />
              <span>Current status</span>
            </div>
          </div>
          <div className="w-full h-80">
            {mounted && statusDataWithColors.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusDataWithColors}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    type="number"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" shape={<CustomBarShape />}>
                    {statusDataWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Performance & Demographics
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 text-sm">Approval Rate</span>
              </div>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${requestStats?.approvalRate || 0}%` }}
                  />
                </div>
                <span className="text-emerald-400 font-semibold text-sm">
                  {requestStats?.approvalRate || 0}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Avg. Completion</span>
              </div>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(((requestStats?.avgCompletionDays || 0) / 30) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-blue-400 font-semibold text-sm">
                  {requestStats?.avgCompletionDays || 0} days
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm">
                  Email Verification
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${userStats?.verificationRate || 0}%` }}
                  />
                </div>
                <span className="text-purple-400 font-semibold text-sm">
                  {userStats?.verificationRate || 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
              <UserPlus className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {performanceMetrics?.staff || 0}
              </p>
              <p className="text-xs text-gray-400">Total Staff</p>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
              <Building2 className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {performanceMetrics?.directorates || 0}
              </p>
              <p className="text-xs text-gray-400">Directorates</p>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
              <GraduationCap className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {programStats?.interns?.active || 0}
              </p>
              <p className="text-xs text-gray-400">Active Interns</p>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
              <Rocket className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {programStats?.innovators?.active || 0}
              </p>
              <p className="text-xs text-gray-400">Innovators</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            User Roles
          </h3>
          <div className="space-y-3">
            {roleDistribution.map((role, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <span className="text-gray-300 text-sm">{role.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{role.value}</span>
                  <span className="text-gray-500 text-xs">
                    (
                    {userStats?.total
                      ? ((role.value / userStats.total) * 100).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Reports Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Reports</span>
              <span className="text-white font-semibold">
                {performanceMetrics?.reports?.total || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Pending Review</span>
              <span className="text-yellow-400 font-semibold">
                {performanceMetrics?.reports?.pending || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Approved</span>
              <span className="text-emerald-400 font-semibold">
                {performanceMetrics?.reports?.approved || 0}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Approval Rate</span>
                <span className="text-blue-400 font-semibold">
                  {performanceMetrics?.reports?.approvalRate || 0}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            Teams & Workload
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Active Teams</span>
              <span className="text-white font-semibold">
                {performanceMetrics?.teams || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Services</span>
              <span className="text-white font-semibold">
                {performanceMetrics?.services || 0}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Avg. Team Size</span>
                <span className="text-white font-semibold">
                  {performanceMetrics?.teams && performanceMetrics?.staff
                    ? Math.round(
                        performanceMetrics.staff / performanceMetrics.teams,
                      )
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
