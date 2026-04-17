const StatsCard = ({ title, count, color, icon }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{count}</p>
        </div>
        <div
          className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
