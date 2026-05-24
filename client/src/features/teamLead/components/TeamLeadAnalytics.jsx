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
  Zap,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useTeamLeadAnalytics } from "../../../hooks/useTeamLeadAnalytics";

const TeamAnalyticsWidget = () => {
  const { analytics, loading, fetchAnalytics } = useTeamLeadAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  const data = analytics?.data || analytics || {};

  const team = data.team || {
    name: "No Team Assigned",
    directorate: "Service",
  };
  const teamPerformance = data.teamPerformance || {
    completionRate: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
  };

  const weeklyActivity = (data.weeklyActivity || []).map((day) => ({
    ...day,
    activeTasks: Math.max(0, (day.tasks || 0) - (day.completed || 0)),
    remaining: Math.max(0, (day.tasks || 0) - (day.completed || 0)),
  }));

  const taskDistribution = data.taskDistribution || [];
  const memberPerformance = data.memberPerformance || [];
  const recentRequests = data.recentRequests || [];

  const metrics = [
    {
      title: "Completion Rate",
      value: `${teamPerformance.completionRate.toFixed(2) || 0}%`,
      icon: TrendingUp,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "Overall team performance",
    },
    {
      title: "Total Tasks",
      value: teamPerformance.totalTasks || 0,
      icon: Briefcase,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "All assigned tasks",
    },
    {
      title: "Completed",
      value: teamPerformance.completedTasks || 0,
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "Successfully completed",
    },
    {
      title: "In Progress",
      value: teamPerformance.inProgressTasks || 0,
      icon: Clock,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      description: "Currently working on",
    },
  ];

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

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar font-body">
      <div className="space-y-6 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted text-xs uppercase tracking-wide">
                  {metric.description}
                </span>
                <div className={`${metric.bgColor} p-2 rounded-lg`}>
                  <metric.icon className={`w-4 h-4 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-text-primary">
                  {metric.value}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1">{metric.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-primary font-heading font-medium flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Active Tasks Over Time
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-text-muted">Active Tasks</span>
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-text-muted">Completed</span>
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-text-muted">In Progress</span>
                </span>
              </div>
            </div>
            {weeklyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyActivity}>
                  <defs>
                    <linearGradient
                      id="colorActive"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorInProgress"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    tick={{ fill: "#6B7280" }}
                  />
                  <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="activeTasks"
                    stroke="#8B5CF6"
                    fill="url(#colorActive)"
                    name="Active Tasks"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10B981"
                    fill="url(#colorCompleted)"
                    name="Completed"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="inProgress"
                    stroke="#F59E0B"
                    fill="url(#colorInProgress)"
                    name="In Progress"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-62.5 text-text-muted">
                <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">No weekly activity data</p>
              </div>
            )}
          </div>

          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
            <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Service Request Distribution
            </h3>
            {taskDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percentage }) => `${percentage}%`}
                    labelLine={{ stroke: "#6B7280" }}
                  >
                    {taskDistribution.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={entry.color}
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
                    formatter={(value, name) => {
                      const item = taskDistribution.find(
                        (d) => d.name === name,
                      );
                      return [
                        `${value} requests (${item?.percentage || 0}%)`,
                        name,
                      ];
                    }}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    formatter={(value) => {
                      const item = taskDistribution.find(
                        (d) => d.name === value,
                      );
                      return (
                        <span className="text-text-secondary text-xs block whitespace-normal max-w-40">
                          {value} ({item?.percentage || 0}%)
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-62.5 text-text-muted">
                <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">No service requests yet</p>
                <p className="text-xs text-text-muted mt-1">
                  Requests will appear here once assigned
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
          <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Team Member Performance
          </h3>
          <div className="space-y-3 max-h-75 overflow-y-auto pr-2">
            {memberPerformance.length > 0 ? (
              memberPerformance.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-primary font-medium">
                      {member.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-accent text-sm font-medium">
                        {member.completionRate}%
                      </span>
                      {member.avgResponseTime !== "N/A" && (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-500" />
                          {member.avgResponseTime}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-text-muted mb-2">
                    <span>{member.position}</span>
                    <span>
                      {member.completedTasks}/{member.totalTasks} tasks
                      completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-accent h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${member.completionRate}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-muted">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No team members found</p>
              </div>
            )}
          </div>
        </div>

        {recentRequests.length > 0 && (
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
            <h3 className="text-text-primary font-heading font-medium mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Recent Service Requests
            </h3>
            <div className="space-y-2 max-h-75 overflow-y-auto pr-2">
              {recentRequests.map((request, idx) => (
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
                      {request.assignedTo && (
                        <>
                          <span className="text-xs text-text-muted">•</span>
                          <span className="text-xs text-text-muted">
                            Assigned to: {request.assignedTo}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        request.status === "completed"
                          ? "bg-blue-50 text-accent"
                          : request.status === "in_progress"
                            ? "bg-blue-50 text-blue-600"
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
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default TeamAnalyticsWidget;
