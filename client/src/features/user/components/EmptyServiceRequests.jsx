import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyServiceRequests = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <Briefcase className="w-16 h-16 text-[#9ca3af] mx-auto mb-4" />
      <p className="text-[#6b7280] text-lg">No service requests yet</p>
      <p className="text-[#6b7280] text-sm mt-2">
        Browse the service catalog to request technology services
      </p>
      <button
        onClick={() => navigate("/services/browse")}
        className="btn-institutional mt-6 px-4 py-2"
      >
        Browse Services
      </button>
    </div>
  );
};

export default EmptyServiceRequests;
