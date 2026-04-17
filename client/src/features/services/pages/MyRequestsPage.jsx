import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../../../hooks/useApplications";
import { useToast } from "../../../components/ui/Toast";
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
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "approved":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
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
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
          <span className="text-sm">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              My Service Requests
            </h1>
          </div>

          {serviceRequests.length === 0 ? (
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
          ) : (
            <div className="space-y-4">
              {serviceRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-all cursor-pointer"
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
                        <span className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-lg">
                        {request.metadata?.serviceType || request.type}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {request.metadata?.description}
                      </p>
                      {request.metadata?.priority && (
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              request.metadata.priority === "urgent"
                                ? "bg-red-500/20 text-red-400"
                                : request.metadata.priority === "high"
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            Priority: {request.metadata.priority}
                          </span>
                        </div>
                      )}
                    </div>
                    <Eye className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition ml-4" />
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
