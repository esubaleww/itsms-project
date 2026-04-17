const PathCard = ({ path }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
      <div className={`p-6 ${path.iconBg}`}>
        <span className={`text-4xl ${path.iconColor}`}>{path.icon}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
        <p className="text-gray-600 mb-4">{path.description}</p>
        <button
          onClick={path.action}
          className={`${path.buttonColor} text-white px-4 py-2 rounded-lg transition w-full`}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default PathCard;
