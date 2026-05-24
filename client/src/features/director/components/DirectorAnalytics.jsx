import { useEffect, useMemo } from "react";
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
  Clock,
  Zap,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
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
  Legend,
} from "recharts";
import { useDirectorAnalytics } from "../../../hooks/useDirectorAnalytics";
import { useNavigate } from "react-router-dom";

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
  teal: "#14B8A6",
  rose: "#F43F5E",
  violet: "#8B5CF6",
};

const colorMap = {
  emerald: "text-accent",
  blue: "text-blue-600",
  purple: "text-purple-600",
  amber: "text-amber-600",
  teal: "text-teal-600",
  rose: "text-rose-600",
};

const DirectorAnalytics = () => {
  const navigate = useNavigate();
  const { analytics, loading, fetchAnalytics } = useDirectorAnalytics();
  const directorateType = analytics?.directorate?.type;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const enhancedTeams = useMemo(() => {
    return (analytics?.teamPerformance || []).map((team) => ({
      ...team,
      load: team.totalRequests / (team.members || 1),
    }));
  }, [analytics]);

  const alerts = useMemo(() => {
    const list = [];

    enhancedTeams.forEach((team) => {
      if (team.load > 5) {
        list.push({
          type: "danger",
          message: `${team.name} is overloaded (${team.load.toFixed(1)} requests/member)`,
        });
      }
    });

    if (analytics?.completionRate < 70) {
      list.push({
        type: "danger",
        message: "Completion rate below acceptable threshold (70%)",
      });
    }

    return list;
  }, [analytics, enhancedTeams]);

  const riskyRequests = useMemo(() => {
    return (analytics?.recentRequests || []).filter(
      (r) => r.status !== "completed",
    );
  }, [analytics]);

  if (loading && !analytics?.weeklyActivity?.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Completion Rate",
      value: `${analytics?.completionRate || 0}%`,
      icon: TrendingUp,
      color: CHART_COLORS.green,
      change: "Overall performance",
    },
    {
      title: "Total Requests",
      value: analytics?.totalRequests || 0,
      icon: Briefcase,
      color: CHART_COLORS.primary,
      change: "All requests",
    },
    {
      title: "Completed",
      value: analytics?.completedRequests || 0,
      icon: CheckCircle,
      color: CHART_COLORS.teal,
      change: "Successfully completed",
    },
    {
      title: "Active Teams",
      value: analytics?.teamPerformance?.length || 0,
      icon: Users,
      color: CHART_COLORS.purple,
      change: "Working teams",
    },
  ];

  const getDirectorateMetrics = () => {
    const type = analytics?.directorate?.type;
    if (type === "internship") {
      return [
        {
          label: "Active Interns",
          value: analytics?.directorateSpecific?.activeInterns || 0,
          icon: GraduationCap,
          color: "emerald",
        },
        {
          label: "Total Interns",
          value: analytics?.directorateSpecific?.totalInterns || 0,
          icon: Users,
          color: "blue",
        },
        {
          label: "Reports Submitted",
          value: analytics?.directorateSpecific?.reportsSubmitted || 0,
          icon: FileText,
          color: "purple",
        },
      ];
    } else if (type === "innovation") {
      return [
        {
          label: "Active Innovators",
          value: analytics?.directorateSpecific?.activeInnovators || 0,
          icon: Lightbulb,
          color: "emerald",
        },
        {
          label: "Total Innovators",
          value: analytics?.directorateSpecific?.totalInnovators || 0,
          icon: Users,
          color: "blue",
        },
        {
          label: "Graduated",
          value: analytics?.directorateSpecific?.graduatedInnovators || 0,
          icon: Award,
          color: "purple",
        },
      ];
    } else if (type === "startup") {
      return [
        {
          label: "Active Startups",
          value: analytics?.directorateSpecific?.activeStartups || 0,
          icon: Rocket,
          color: "emerald",
        },
        {
          label: "Total Startups",
          value: analytics?.directorateSpecific?.totalStartups || 0,
          icon: Users,
          color: "blue",
        },
        {
          label: "Graduated",
          value: analytics?.directorateSpecific?.graduatedStartups || 0,
          icon: Award,
          color: "purple",
        },
      ];
    }
    return [];
  };

  const directorateMetrics = getDirectorateMetrics();

  const requestDistributionWithColors = (
    analytics?.requestDistribution || []
  ).map((item, i) => ({
    ...item,
    fill: Object.values(CHART_COLORS)[i % Object.values(CHART_COLORS).length],
  }));

  const statusDistributionWithColors = (
    analytics?.statusDistribution || []
  ).map((item, i) => ({
    ...item,
    fill: Object.values(CHART_COLORS)[i % Object.values(CHART_COLORS).length],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3">
          <p className="text-text-primary text-sm font-medium mb-2">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} className="text-xs" style={{ color: item.color }}>
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (directorateType !== "service") {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-10 h-10 text-text-muted" />
        </div>
        <h2 className="text-xl font-heading font-medium text-text-primary mb-2">
          Analytics Not Available
        </h2>
        <p className="text-text-muted text-center max-w-md mb-6">
          Analytics dashboard is only available for Service Directorate. Your
          directorate ({directorateType}) does not have service request metrics.
        </p>
        <button
          onClick={() => navigate("/director")}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body">
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg flex items-center gap-2 text-sm
                ${
                  alert.type === "danger"
                    ? "bg-red-50 text-red-600 border border-red-500/30"
                    : "bg-yellow-50 text-yellow-600 border border-yellow-500/30"
                }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-text-muted text-sm font-medium">
                  {metric.title}
                </p>
                <p className="text-text-primary text-3xl font-bold mt-1">
                  {metric.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="w-3 h-3 text-accent" />
                  <p className="text-text-muted text-xs">{metric.change}</p>
                </div>
              </div>
              <div
                className="p-3 rounded-xl transition-colors group-hover:scale-110 duration-300"
                style={{ backgroundColor: `${metric.color}10` }}
              >
                <metric.icon
                  className="w-6 h-6"
                  style={{ color: metric.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {directorateMetrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {directorateMetrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 hover:border-accent/50 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className={`w-5 h-5 ${colorMap[metric.color]}`} />
                <span className="text-text-muted text-sm">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {metric.value}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-text-primary font-heading font-medium flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Weekly Activity
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS.primary }}
              />
              <span className="text-text-muted">Requests</span>
            </span>
            <span className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS.teal }}
              />
              <span className="text-text-muted">Completed</span>
            </span>
            <span className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS.warning }}
              />
              <span className="text-text-muted">In Progress</span>
            </span>
          </div>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.weeklyActivity || []}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.teal}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.teal}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorInProgress"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.warning}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.warning}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 11 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => (
                  <span className="text-text-secondary text-xs">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                fill="url(#colorRequests)"
                name="Requests"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke={CHART_COLORS.teal}
                strokeWidth={2}
                fill="url(#colorCompleted)"
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="inProgress"
                stroke={CHART_COLORS.warning}
                strokeWidth={2}
                fill="url(#colorInProgress)"
                name="In Progress"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-accent" />
          Request Distribution
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={requestDistributionWithColors}
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
                labelLine={{ stroke: "#6B7280" }}
              >
                {requestDistributionWithColors.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.fill}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#374151", fontSize: "12px" }}
                iconType="circle"
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          Request Status
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusDistributionWithColors}
              layout="vertical"
              margin={{ left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                type="number"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9CA3AF"
                tick={{ fill: "#374151", fontSize: 12 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#E5E7EB",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #E5E7EB",
                }}
                labelStyle={{
                  color: "#111827",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  borderBottom: "1px solid #E5E7EB",
                  paddingBottom: "6px",
                }}
                itemStyle={{
                  color: "#374151",
                  fontSize: "12px",
                  padding: "4px 0",
                }}
                cursor={{
                  stroke: CHART_COLORS.primary,
                  strokeWidth: 2,
                  strokeDasharray: "3 3",
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {statusDistributionWithColors.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          Team Performance
        </h3>
        <div className="space-y-3">
          {enhancedTeams.length > 0 ? (
            enhancedTeams.map((team, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-primary font-medium">
                    {team.name}
                  </span>
                  <span className="text-accent text-sm font-medium">
                    {team.completionRate}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-text-muted mb-2">
                  <span>{team.members} members</span>
                  <span>
                    {team.completedRequests}/{team.totalRequests} tasks
                  </span>
                  <span>Load: {team.load.toFixed(1)}/member</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-accent h-1.5 rounded-full"
                    style={{ width: `${team.completionRate}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-text-muted">
              No teams found in your directorate
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Active / Risky Requests
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {riskyRequests.length > 0 ? (
            riskyRequests.map((request, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition gap-2"
              >
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-medium">
                    {request.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-text-muted">
                      From: {request.applicant}
                    </span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted capitalize">
                      Type: {request.serviceType}
                    </span>
                    {request.assignedTeam && (
                      <>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">
                          Team: {request.assignedTeam}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      request.status === "completed"
                        ? "bg-teal-50 text-teal-600"
                        : request.status === "in_progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {request.status === "in_progress"
                      ? "In Progress"
                      : request.status === "assigned_to_team"
                        ? "Pending"
                        : request.status}
                  </span>
                  <Calendar className="w-3 h-3 text-text-muted" />
                  <span className="text-xs text-text-muted">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-text-muted">
              No active risky requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorAnalytics;
