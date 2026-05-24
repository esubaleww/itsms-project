import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  FileText,
  Award,
  UserCheck,
  Rocket,
  GraduationCap,
  Activity,
  Target,
  Zap,
  Shield,
  Building2,
  UserPlus,
  Filter,
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
} from "recharts";
import { useAnalytics } from "../../../hooks/useAnalytics";

const CHART_COLORS = {
  primary: "#2563EB",
  secondary: "#60A5FA",
  danger: "#EF4444",
  warning: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  cyan: "#06B6D4",
  orange: "#F97316",
  green: "#10B981",
};

const dateRanges = [
  { value: "7days", label: "Last 7 Days", format: "daily" },
  { value: "30days", label: "Last 30 Days", format: "daily" },
  { value: "quarter", label: "This Quarter", format: "monthly" },
  { value: "year", label: "This Year", format: "monthly" },
];

const aggregateByMonth = (data) => {
  const months = {};
  data.forEach((item) => {
    const date = new Date(item.fullDate);
    const key = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    if (!months[key]) {
      months[key] = {
        name: key,
        fullDate: item.fullDate,
        requests: 0,
        approvals: 0,
        rejections: 0,
      };
    }
    months[key].requests += item.requests || 0;
    months[key].approvals += item.approvals || 0;
    months[key].rejections += item.rejections || 0;
  });
  return Object.values(months);
};

const AdminAnalytics = () => {
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
  const [dateRange, setDateRange] = useState("7days");
  const [chartData, setChartData] = useState([]);

  const currentRange = dateRanges.find((r) => r.value === dateRange);
  const isMonthlyView = currentRange?.format === "monthly";

  useEffect(() => {
    fetchAnalytics(dateRange);
  }, [dateRange, fetchAnalytics]);

  useEffect(() => {
    if (!dailyActivity?.length) {
      setChartData([]);
      return;
    }

    let data = dailyActivity.map((item) => ({
      name: item.name,
      fullDate: item.fullDate,
      requests: Number(item.requests) || 0,
      approvals: Number(item.approvals) || 0,
      rejections: Number(item.rejections) || 0,
    }));

    if (isMonthlyView) {
      data = aggregateByMonth(data);
    }

    setChartData(data);
  }, [dailyActivity, isMonthlyView]);

  if (loading && !dailyActivity?.length) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  const totalRequests = chartData.reduce((sum, d) => sum + d.requests, 0);
  const totalApprovals = chartData.reduce((sum, d) => sum + d.approvals, 0);
  const totalRejections = chartData.reduce((sum, d) => sum + d.rejections, 0);

  const analyticsCards = [
    {
      title: "Total Users",
      value: userStats?.total || 0,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      topBorder: "border-t-blue-600",
      change: `${userStats?.verificationRate || 0}% verified`,
    },
    {
      title: "Total Requests",
      value: requestStats?.total || 0,
      icon: FileText,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      topBorder: "border-t-orange-500",
      change: `${requestStats?.approvalRate || 0}% approved`,
    },
    {
      title: "Active Programs",
      value:
        (programStats?.interns?.active || 0) +
        (programStats?.innovators?.active || 0),
      icon: Award,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      topBorder: "border-t-green-600",
      change: `${programStats?.startups?.active || 0} startups`,
    },
    {
      title: "Service Catalog",
      value: performanceMetrics?.services || 0,
      icon: Briefcase,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      topBorder: "border-t-purple-600",
      change: `${performanceMetrics?.directorates || 0} directorates`,
    },
  ];

  const pieData =
    requestDistribution?.map((item, i) => ({
      ...item,
      fill: Object.values(CHART_COLORS)[i % Object.values(CHART_COLORS).length],
    })) || [];
  const barData =
    statusDistribution?.map((item, i) => ({
      ...item,
      fill: Object.values(CHART_COLORS)[i % Object.values(CHART_COLORS).length],
    })) || [];

  const getXAxisSettings = () => {
    const len = chartData.length;
    if (len <= 7) return { interval: 0, angle: 0, height: 30 };
    if (len <= 14) return { interval: 0, angle: -35, height: 50 };
    return { interval: Math.floor(len / 10), angle: -45, height: 60 };
  };
  const xAxis = getXAxisSettings();

  const xAxisDataKey = isMonthlyView ? "name" : "fullDate";

  const formatXAxis = (date) => {
    if (!date || isMonthlyView) return date;
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-2 text-blue-600">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            Requests: {totalRequests}
          </span>
          <span className="flex items-center gap-2 text-teal-500">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            Approvals: {totalApprovals}
          </span>
          <span className="flex items-center gap-2 text-red-500">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Rejections: {totalRejections}
          </span>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent shadow-sm"
          >
            {dateRanges.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white border-l border-r border-b border-gray-200 border-t-[3px] ${card.topBorder} rounded-xl p-6 shadow-sm relative group cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-text-secondary text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-text-primary text-3xl font-bold mt-1">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-text-muted text-xs mt-2">{card.change}</p>
              </div>
              <div
                className={`${card.iconBg} rounded-lg p-2 group-hover:scale-110 transition-transform duration-200`}
              >
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-text-primary font-heading font-medium flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Activity Overview
          </h3>
          <span className="text-xs text-text-muted">
            {currentRange?.label} ({isMonthlyView ? "Monthly" : "Daily"})
          </span>
        </div>
        <div className="w-full h-96">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: xAxis.height }}
              >
                <defs>
                  <linearGradient id="gReq" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey={xAxisDataKey}
                  stroke="#9CA3AF"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickFormatter={formatXAxis}
                  interval={xAxis.interval}
                  angle={xAxis.angle}
                  textAnchor={xAxis.angle ? "end" : "middle"}
                  height={xAxis.height}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const colors = {
                      Requests: CHART_COLORS.primary,
                      Approvals: "#14B8A6",
                      Rejections: CHART_COLORS.danger,
                    };
                    return [
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors[name] }}
                          />
                          <span
                            style={{ color: colors[name] }}
                            className="text-sm font-medium"
                          >
                            {name}:
                          </span>
                        </div>
                        <span className="text-text-primary font-medium">
                          {value}
                        </span>
                      </div>,
                      null,
                    ];
                  }}
                  labelFormatter={(label) => {
                    if (!isMonthlyView && label) {
                      const d = new Date(label);
                      return d.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }
                    return label;
                  }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#E5E7EB",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    minWidth: "180px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  labelStyle={{
                    color: "#6b7280",
                    fontSize: "11px",
                    marginBottom: "8px",
                    borderBottom: "1px solid #E5E7EB",
                    paddingBottom: "4px",
                    display: "block",
                  }}
                  cursor={{
                    stroke: "#D1D5DB",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fill="url(#gReq)"
                  name="Requests"
                />
                <Area
                  type="monotone"
                  dataKey="approvals"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  fill="url(#gApp)"
                  name="Approvals"
                />
                <Area
                  type="monotone"
                  dataKey="rejections"
                  stroke={CHART_COLORS.danger}
                  strokeWidth={2}
                  name="Rejections"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted">
              No data available
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Request Distribution
          </h3>
          <div className="w-full h-80">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      color: "#111827",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
                No data
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Request Status
          </h3>
          <div className="w-full h-80">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ left: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    type="number"
                    stroke="#9CA3AF"
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#9CA3AF"
                    width={80}
                    tick={{ fill: "#374151", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      color: "#111827",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {barData.map((e, i) => (
                      <Cell key={i} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
                No data
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-text-secondary text-sm font-medium">
                Approval Rate
              </span>
              <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${requestStats?.approvalRate || 0}%` }}
                />
              </div>
              <span className="text-text-primary text-sm font-medium">
                {requestStats?.approvalRate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-text-secondary text-sm font-medium">
                Avg. Completion
              </span>
              <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(((requestStats?.avgCompletionDays || 0) / 30) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="text-text-primary text-sm font-medium">
                {requestStats?.avgCompletionDays || 0} days
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-text-secondary text-sm font-medium">
                Email Verification
              </span>
              <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${userStats?.verificationRate || 0}%` }}
                />
              </div>
              <span className="text-text-primary text-sm font-medium">
                {userStats?.verificationRate || 0}%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <UserPlus className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="text-text-primary text-xl font-bold">
                {performanceMetrics?.staff || 0}
              </p>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wide mt-1">
                Staff
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <p className="text-text-primary text-xl font-bold">
                {performanceMetrics?.directorates || 0}
              </p>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wide mt-1">
                Directorates
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-500 mx-auto mb-2" />
              <p className="text-text-primary text-xl font-bold">
                {programStats?.interns?.active || 0}
              </p>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wide mt-1">
                Active Interns
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <Rocket className="w-5 h-5 text-orange-500 mx-auto mb-2" />
              <p className="text-text-primary text-xl font-bold">
                {programStats?.innovators?.active || 0}
              </p>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wide mt-1">
                Innovators
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            User Roles
          </h3>
          <div className="space-y-2">
            {userStats?.byRole?.map((role, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-text-secondary text-sm font-medium capitalize">
                  {role._id}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-text-primary font-medium">
                    {role.count}
                  </span>
                  <span className="text-text-muted text-xs">
                    (
                    {userStats.total
                      ? ((role.count / userStats.total) * 100).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Reports Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-text-secondary text-sm font-medium">
                Total Reports
              </span>
              <span className="text-text-primary font-medium">
                {performanceMetrics?.reports?.total || 0}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-text-secondary text-sm font-medium">
                Pending Review
              </span>
              <span className="text-yellow-600 font-medium">
                {performanceMetrics?.reports?.pending || 0}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-text-secondary text-sm font-medium">
                Approved
              </span>
              <span className="text-green-600 font-medium">
                {performanceMetrics?.reports?.approved || 0}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between p-2">
              <span className="text-text-primary font-medium">
                Approval Rate
              </span>
              <span className="text-accent font-medium">
                {performanceMetrics?.reports?.approvalRate || 0}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent" />
            Teams & Workload
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-text-secondary font-medium">
                Active Teams
              </span>
              <span className="text-text-primary font-medium text-lg">
                {performanceMetrics?.teams || 0}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-text-secondary font-medium">
                Total Services
              </span>
              <span className="text-text-primary font-medium text-lg">
                {performanceMetrics?.services || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
