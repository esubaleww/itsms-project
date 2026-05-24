import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../../../hooks/useApplications";
import { useToast } from "../../../common/ui/Toast";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Loader2,
} from "lucide-react";

const MyRequestsPage = () => {
  const navigate = useNavigate();

  const { applications, getMyApplications, loading } = useApplications();

  useEffect(() => {
    getMyApplications();
  }, []);

  const serviceRequests = applications?.service || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-blue-50 text-accent border border-accent/30";
      case "in_progress":
        return "bg-blue-500/10 text-blue-600 border border-blue-500/30";
      case "approved":
        return "bg-purple-500/10 text-purple-600 border border-purple-500/30";
      case "rejected":
        return "bg-red-500/10 text-red-600 border border-red-500/30";
      default:
        return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading && !serviceRequests.length) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 font-body py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
          <span className="text-sm">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-2xl font-heading font-medium text-text-primary">
              My Service Requests
            </h1>
          </div>

          {serviceRequests.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary text-lg">
                No service requests yet
              </p>
              <p className="text-text-muted text-sm mt-2">
                Browse the service catalog to request technology services
              </p>
              <button
                onClick={() => navigate("/services/browse")}
                className="btn-filled mt-6"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {serviceRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  onClick={() => navigate(`/services/request/${request._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status?.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-text-muted">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-heading font-medium text-text-primary text-lg">
                        {request.metadata?.serviceType || request.type}
                      </h3>
                      <p className="text-sm text-text-muted mt-1 line-clamp-2">
                        {request.metadata?.description}
                      </p>
                      {request.metadata?.priority && (
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              request.metadata.priority === "urgent"
                                ? "bg-red-500/10 text-red-600"
                                : request.metadata.priority === "high"
                                  ? "bg-orange-500/10 text-orange-600"
                                  : "bg-yellow-500/10 text-yellow-600"
                            }`}
                          >
                            Priority: {request.metadata.priority}
                          </span>
                        </div>
                      )}
                    </div>
                    <Eye className="w-5 h-5 text-text-muted group-hover:text-accent transition ml-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyRequestsPage;
