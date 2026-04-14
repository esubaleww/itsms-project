import {
  Clock,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Briefcase,
} from "lucide-react";

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (notification) => {
    const type = notification?.type;
    const title = notification?.title?.toLowerCase() || "";

    if (title.includes("complete") || type === "success") {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (title.includes("progress") || title.includes("start")) {
      return <TrendingUp className="w-4 h-4 text-blue-400" />;
    }
    if (title.includes("assign") || type === "assignment") {
      return <Briefcase className="w-4 h-4 text-yellow-400" />;
    }
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  const activitiesList = activities?.slice(0, 5) || [];

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
      </div>
      {activitiesList.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {activitiesList.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
            >
              <div className="mt-0.5">{getActivityIcon(activity)}</div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {activity.title}
                </p>
                <p className="text-gray-400 text-sm">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
