import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyServiceRequests = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 text-lg">No service requests yet</p>
      <p className="text-gray-500 text-sm mt-2">
        Browse the service catalog to request technology services
      </p>
      <button
        onClick={() => navigate("/services/browse")}
        className="mt-6 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-700 text-white rounded-lg hover:opacity-90 transition"
      >
        Browse Services
      </button>
    </div>
  );
};

export default EmptyServiceRequests;
