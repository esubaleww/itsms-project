import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceCatalog } from "../../../hooks/useServiceCatalog";
import { useApplications } from "../../../hooks/useApplications";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../common/ui/Toast";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Briefcase,
  Clock,
  FileText,
  CheckCircle,
  Send,
  Loader2,
  Sparkles,
  Shield,
  Wifi,
  Database,
  Server,
  Globe,
  Code,
  Cloud,
  Lock,
} from "lucide-react";
import ServiceRequestModal from "../components/ServiceRequestModal";

const iconMap = {
  Wifi: Wifi,
  Database: Database,
  Server: Server,
  Globe: Globe,
  Code: Code,
  Cloud: Cloud,
  Shield: Shield,
  Lock: Lock,
  Briefcase: Briefcase,
};

const ServiceDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { selectedService, fetchServiceById, loading } = useServiceCatalog();
  const { applyForService } = useApplications();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const service = selectedService?.service;

  useEffect(() => {
    fetchServiceById(id);
  }, [id]);

  const getIconComponent = (iconName) => {
    const Icon = iconMap[iconName] || Briefcase;
    return Icon;
  };

  const handleRequest = () => {
    if (!isAuthenticated) {
      addToast("Please login to request services", "warning");
      navigate("/login");
      return;
    }
    if (!user?.emailVerified) {
      addToast(
        "Please verify your email before requesting services",
        "warning",
      );
      return;
    }
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (formData) => {
    console.log("Submitting request with data:", formData);
    setSubmitting(true);
    try {
      await applyForService({
        serviceType: service.name,
        ...formData,
      });
      addToast("Service request submitted successfully!", "success");
      setShowRequestModal(false);
      navigate("/services/my-requests");
    } catch (error) {
      addToast(error.message || "Failed to submit request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !service) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const IconComponent = getIconComponent(service.icon);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
          <span className="text-sm">Back to Services</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
        >
          {/* Service Header */}
          <div className="p-6 border-b border-gray-700 bg-linear-to-r from-gray-800/80 to-gray-800/40">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-white">
                    {service.name}
                  </h1>
                  {service.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mt-2">{service.description}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="p-6 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">Estimated Time</h3>
                </div>
                <p className="text-gray-300">{service.estimatedTime}</p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">Price</h3>
                </div>
                <p className="text-gray-300">
                  {!service.price || service.price === 0
                    ? "Free"
                    : `$${service.price}`}
                </p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">Service Level</h3>
                </div>
                <p className="text-gray-300">
                  {service.popular ? "Premium Support" : "Standard Support"}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {service.requirements?.length > 0 && (
              <div className="bg-gray-700/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">Requirements</h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-300 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Documents */}
            {service.documents?.length > 0 && (
              <div className="bg-gray-700/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">
                    Required Documents
                  </h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.documents.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-300 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Request Button */}
            <button
              onClick={handleRequest}
              className="w-full mt-4 py-3 bg-linear-to-r from-emerald-500 to-teal-700 text-white rounded-xl hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Request This Service
            </button>
          </div>
        </motion.div>
      </div>

      {/* Service Request Modal */}
      <ServiceRequestModal
        service={service}
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleSubmitRequest}
        user={user}
        loading={submitting}
      />
    </div>
  );
};

export default ServiceDetailsPage;
