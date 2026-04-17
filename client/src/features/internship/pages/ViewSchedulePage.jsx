// client/src/features/intern/pages/ViewSchedulePage.jsx
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, MapPin, Users } from "lucide-react";

const ViewSchedulePage = () => {
  const navigate = useNavigate();

  const schedule = [
    {
      day: "Monday",
      time: "9:00 AM - 12:00 PM",
      activity: "Team Meeting",
      location: "Conference Room A",
      type: "meeting",
    },
    {
      day: "Monday",
      time: "1:00 PM - 5:00 PM",
      activity: "Development Work",
      location: "Workstation",
      type: "work",
    },
    {
      day: "Tuesday",
      time: "10:00 AM - 11:00 AM",
      activity: "Mentor Session",
      location: "Online",
      type: "mentor",
    },
    {
      day: "Wednesday",
      time: "2:00 PM - 3:00 PM",
      activity: "Training Workshop",
      location: "Training Hall",
      type: "training",
    },
    {
      day: "Thursday",
      time: "9:00 AM - 12:00 PM",
      activity: "Development Work",
      location: "Workstation",
      type: "work",
    },
    {
      day: "Friday",
      time: "10:00 AM - 11:00 AM",
      activity: "Weekly Review",
      location: "Conference Room B",
      type: "meeting",
    },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-700";
      case "work":
        return "bg-green-100 text-green-700";
      case "mentor":
        return "bg-purple-100 text-purple-700";
      case "training":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Your Schedule</h1>
          </div>

          <div className="space-y-4">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition"
              >
                <div className="w-20 text-sm font-medium text-gray-600">
                  {item.day}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.time}</span>
                  </div>
                  <p className="font-medium">{item.activity}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {item.location}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getTypeColor(item.type)}`}
                >
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSchedulePage;
