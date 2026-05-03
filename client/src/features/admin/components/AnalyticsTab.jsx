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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
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
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-[#2563eb]",
      topBorder: "border-t-[3px] border-t-[#2563eb]",
      change: `${userStats?.verificationRate || 0}% verified`,
    },
    {
      title: "Total Requests",
      value: requestStats?.total || 0,
      icon: FileText,
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-[#2563eb]",
      topBorder: "border-t-[3px] border-t-[#f59e0b]",
      change: `${requestStats?.approvalRate || 0}% approved`,
    },
    {
      title: "Active Programs",
      value:
        (programStats?.interns?.active || 0) +
        (programStats?.innovators?.active || 0),
      icon: Award,
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-[#2563eb]",
      topBorder: "border-t-[3px] border-t-[#10b981]",
      change: `${programStats?.startups?.active || 0} startups`,
    },
    {
      title: "Service Catalog",
      value: performanceMetrics?.services || 0,
      icon: Briefcase,
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-[#2563eb]",
      topBorder: "border-t-[3px] border-t-[#8b5cf6]",
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
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
            Requests: {totalRequests}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Approvals: {totalApprovals}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Rejections: {totalRejections}
          </span>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="pl-9 pr-3 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-[#111827] text-sm"
          >
            {dateRanges.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white border-l border-r border-b border-[#E5E7EB] ${card.topBorder} rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative group cursor-pointer hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#374151] text-[1rem] font-medium">{card.title}</p>
                <p className="text-[#111827] text-[2rem] font-bold mt-1">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-[#6b7280] text-[0.875rem] mt-2">{card.change}</p>
              </div>
              <div className={`${card.iconBg} rounded-[10px] p-[10px] group-hover:scale-105 transition-transform duration-200`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-[#111827] font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2563eb]" />
            Activity Overview
          </h3>
          <span className="text-xs text-[#6b7280]">
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
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey={xAxisDataKey}
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  tickFormatter={formatXAxis}
                  interval={xAxis.interval}
                  angle={xAxis.angle}
                  textAnchor={xAxis.angle ? "end" : "middle"}
                  height={xAxis.height}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const colors = {
                      Requests: CHART_COLORS.primary,
                      Approvals: CHART_COLORS.secondary,
                      Rejections: CHART_COLORS.danger,
                    };
                    return [
                      <span
                        style={{ color: colors[name] }}
                        className="font-semibold"
                      >
                        {value}
                      </span>,
                      <span style={{ color: colors[name] }}>{name}</span>,
                    ];
                  }}
                  labelFormatter={(label) => {
                    if (!isMonthlyView && label) {
                      const d = new Date(label);
                      return d.toLocaleDateString();
                    }
                    return label;
                  }}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{
                    color: "#9ca3af",
                    fontSize: "11px",
                    marginBottom: "4px",
                  }}
                  cursor={{
                    stroke: "#4B5563",
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
                  dot={{ r: 4, fill: CHART_COLORS.primary }}
                />
                <Area
                  type="monotone"
                  dataKey="approvals"
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={2}
                  fill="url(#gApp)"
                  name="Approvals"
                  dot={{ r: 4, fill: CHART_COLORS.secondary }}
                />
                <Area
                  type="monotone"
                  dataKey="rejections"
                  stroke={CHART_COLORS.danger}
                  strokeWidth={2}
                  name="Rejections"
                  dot={{ r: 4, fill: CHART_COLORS.danger }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-[#6b7280]">
              No data available
            </div>
          )}
        </div>
      </motion.div>

      {/* Pie Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-[#111827] font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#2563eb]" />
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
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-[#6b7280]">
                No data
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-[#111827] font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#2563eb]" />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#9CA3AF"
                    width={80}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {barData.map((e, i) => (
                      <Cell key={i} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-[#6b7280]">
                No data
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Performance & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-[#111827] font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#2563eb]" />
            Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-[#F3F4F6] rounded-lg">
              <span className="text-[#374151] text-sm">Approval Rate</span>
              <div className="flex-1 mx-4 h-2 bg-gray-600 rounded-full">
                <div
                  className="h-full bg-[#2563eb] rounded-full"
                  style={{ width: `${requestStats?.approvalRate || 0}%` }}
                />
              </div>
              <span className="text-[#2563eb] text-sm">
                {requestStats?.approvalRate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F3F4F6] rounded-lg">
              <span className="text-[#374151] text-sm">Avg. Completion</span>
              <div className="flex-1 mx-4 h-2 bg-gray-600 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(((requestStats?.avgCompletionDays || 0) / 30) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="text-blue-400 text-sm">
                {requestStats?.avgCompletionDays || 0} days
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F3F4F6] rounded-lg">
              <span className="text-[#374151] text-sm">Email Verification</span>
              <div className="flex-1 mx-4 h-2 bg-gray-600 rounded-full">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${userStats?.verificationRate || 0}%` }}
                />
              </div>
              <span className="text-purple-400 text-sm">
                {userStats?.verificationRate || 0}%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-center p-3 bg-[#F3F4F6] rounded-lg">
              <UserPlus className="w-5 h-5 text-[#2563eb] mx-auto mb-1" />
              <p className="text-[#111827] text-xl font-bold">
                {performanceMetrics?.staff || 0}
              </p>
              <p className="text-xs text-[#6b7280]">Staff</p>
            </div>
            <div className="text-center p-3 bg-[#F3F4F6] rounded-lg">
              <Building2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-[#111827] text-xl font-bold">
                {performanceMetrics?.directorates || 0}
              </p>
              <p className="text-xs text-[#6b7280]">Directorates</p>
            </div>
            <div className="text-center p-3 bg-[#F3F4F6] rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-[#111827] text-xl font-bold">
                {programStats?.interns?.active || 0}
              </p>
              <p className="text-xs text-[#6b7280]">Active Interns</p>
            </div>
            <div className="text-center p-3 bg-[#F3F4F6] rounded-lg">
              <Rocket className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-[#111827] text-xl font-bold">
                {programStats?.innovators?.active || 0}
              </p>
              <p className="text-xs text-[#6b7280]">Innovators</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-[#111827] font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2563eb]" />
            User Roles
          </h3>
          <div className="space-y-2">
            {userStats?.byRole?.map((role, i) => (
              <div key={i} className="flex justify-between items-center p-2">
                <span className="text-[#374151] text-sm">
                  {role._id === "admin"
                    ? "Admin"
                    : role._id === "staff"
                      ? "Staff"
                      : role._id === "user"
                        ? "User"
                        : role._id}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#111827] font-semibold">{role.count}</span>
                  <span className="text-[#6b7280] text-xs">
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

      {/* Reports & Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-[#111827] font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2563eb]" />
            Reports Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#374151]">Total Reports</span>
              <span className="text-[#111827]">
                {performanceMetrics?.reports?.total || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#374151]">Pending Review</span>
              <span className="text-yellow-400">
                {performanceMetrics?.reports?.pending || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#374151]">Approved</span>
              <span className="text-[#2563eb]">
                {performanceMetrics?.reports?.approved || 0}
              </span>
            </div>
            <div className="border-t border-[#E5E7EB] pt-2 mt-2 flex justify-between">
              <span className="text-[#374151]">Approval Rate</span>
              <span className="text-blue-400">
                {performanceMetrics?.reports?.approvalRate || 0}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-[#111827] font-semibold mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2563eb]" />
            Teams & Workload
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#374151]">Active Teams</span>
              <span className="text-[#111827]">
                {performanceMetrics?.teams || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#374151]">Total Services</span>
              <span className="text-[#111827]">
                {performanceMetrics?.services || 0}
              </span>
            </div>
            <div className="border-t border-[#E5E7EB] pt-2 mt-2 flex justify-between">
              <span className="text-[#374151]">Avg. Team Size</span>
              <span className="text-[#111827]">
                {performanceMetrics?.teams && performanceMetrics?.staff
                  ? Math.round(
                      performanceMetrics.staff / performanceMetrics.teams,
                    )
                  : 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
