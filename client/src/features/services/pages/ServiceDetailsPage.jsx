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
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  const IconComponent = getIconComponent(service.icon);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 font-body py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
          <span className="text-sm">Back to Services</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-heading font-medium text-text-primary">
                    {service.name}
                  </h1>
                  {service.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-accent rounded-full text-xs">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                </div>
                <p className="text-text-muted mt-2">{service.description}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <h3 className="font-heading font-medium text-text-primary">
                    Estimated Time
                  </h3>
                </div>
                <p className="text-text-secondary">{service.estimatedTime}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <h3 className="font-heading font-medium text-text-primary">
                    Price
                  </h3>
                </div>
                <p className="text-text-secondary">
                  {!service.price || service.price === 0
                    ? "Free"
                    : `$${service.price}`}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-accent" />
                  <h3 className="font-heading font-medium text-text-primary">
                    Service Level
                  </h3>
                </div>
                <p className="text-text-secondary">
                  {service.popular ? "Premium Support" : "Standard Support"}
                </p>
              </div>
            </div>

            {service.requirements?.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-accent" />
                  <h3 className="font-heading font-medium text-text-primary">
                    Requirements
                  </h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-text-secondary text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.documents?.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-accent" />
                  <h3 className="font-heading font-medium text-text-primary">
                    Required Documents
                  </h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.documents.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-text-secondary text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleRequest}
              className="btn-filled w-full mt-4 py-3"
            >
              <Send className="w-5 h-5" />
              Request This Service
            </button>
          </div>
        </motion.div>
      </div>

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
