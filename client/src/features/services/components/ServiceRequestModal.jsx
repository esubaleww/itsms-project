import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Send,
  AlertCircle,
  User,
  Phone,
  Building2,
  Mail,
  Briefcase,
  FileText,
  Link as LinkIcon,
  Upload,
  File,
  Eye,
  ExternalLink,
} from "lucide-react";
import { DocumentUpload } from "../../../components/common/DocumentUpload";
import ErrorBoundary from "../../../components/common/ErrorBoundary";

const ServiceRequestModal = ({
  service,
  isOpen,
  onClose,
  onSubmit,
  user,
  loading,
}) => {
  const [formData, setFormData] = useState({
    organizationName: user?.organizationName || "",
    department: user?.department || "",
    position: user?.position || "",
    contactPerson: user?.fullName || "",
    contactPhone: user?.phone || "",
    contactEmail: user?.email || "",
    serviceType: service?.name || "",
    description: "",
    requirements: "",
    priority: "medium",
    requestLetter: null,
    authorizationLetter: null,
    supportingDocs: [],
  });

  const [errors, setErrors] = useState({});

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-600/50 text-gray-300" },
    { value: "medium", label: "Medium", color: "bg-blue-600/50 text-blue-300" },
    { value: "high", label: "High", color: "bg-orange-600/50 text-orange-300" },
    { value: "urgent", label: "Urgent", color: "bg-red-600/50 text-red-300" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addSupportingDoc = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        supportingDocs: [...prev.supportingDocs, file],
      }));
    }
  };

  const removeSupportingDoc = (index) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocs: prev.supportingDocs.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.organizationName.trim())
      newErrors.organizationName = "Organization name is required";
    if (!formData.contactPerson.trim())
      newErrors.contactPerson = "Contact person is required";
    if (!formData.contactPhone.trim())
      newErrors.contactPhone = "Contact phone is required";
    if (!formData.description.trim())
      newErrors.description = "Service description is required";
    if (
      formData.contactEmail &&
      !/^\S+@\S+\.\S+$/.test(formData.contactEmail)
    ) {
      newErrors.contactEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      requestLetter: formData.requestLetter?.viewLink || formData.requestLetter,
      authorizationLetter:
        formData.authorizationLetter?.viewLink || formData.authorizationLetter,
      supportingDocs: formData.supportingDocs
        .map((doc) => doc.viewLink)
        .filter(Boolean),
    };

    try {
      const result = await onSubmit(submitData);
      if (result?.success) {
        addToast(
          result.message || "Service request submitted successfully!",
          "success",
        );
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Request failed";
      addToast(errorMessage, "error");
    }
  };

  if (!isOpen) return null;

  const UploadedDocument = ({ doc, onRemove, label }) => {
    if (!doc) return null;

    return (
      <div className="bg-gray-700/30 rounded-lg p-3 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <File className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-sm text-white truncate">{label}</span>
            {doc.name && (
              <span className="text-xs text-gray-500">({doc.name})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.open(doc.viewLink, "_blank")}
              className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg transition"
            >
              <Eye className="w-4 h-4" />
            </button>
            <a
              href={doc.viewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-emerald-400 rounded-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 text-red-400 hover:text-red-300 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500 truncate">
          {doc.viewLink}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Request Service</h2>
            <p className="text-sm text-gray-400 mt-0.5">{service?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">{service?.name}</p>
              <p className="text-xs text-gray-400">
                Estimated: {service?.estimatedTime}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Requester Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                      errors.organizationName
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Your Organization"
                  />
                </div>
                {errors.organizationName && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.organizationName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., IT Department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Position / Title
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., IT Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contact Person *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                      errors.contactPerson
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Full Name"
                  />
                </div>
                {errors.contactPerson && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.contactPerson}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contact Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                      errors.contactPhone ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="+251 912 345 678"
                  />
                </div>
                {errors.contactPhone && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.contactPhone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contact Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                      errors.contactEmail ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="contact@example.com"
                  />
                </div>
                {errors.contactEmail && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.contactEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Service Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Service Description *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe what you need in detail..."
                  className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                    errors.description ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Special Requirements
                </label>
                <textarea
                  name="requirements"
                  rows={3}
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Any specific requirements or constraints?"
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority Level
                </label>
                <div className="flex gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, priority: p.value }))
                      }
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        formData.priority === p.value
                          ? p.color + " ring-2 ring-offset-1 ring-emerald-500"
                          : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              Supporting Documents
            </h3>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Upload className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-300">
                  Upload your documents from Google Drive. Files will be
                  automatically shared with the service team.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ErrorBoundary>
                <DocumentUpload
                  label="Request Letter"
                  value={formData.requestLetter}
                  onChange={(file) =>
                    setFormData((prev) => ({ ...prev, requestLetter: file }))
                  }
                  required={false}
                  accept={{
                    "application/pdf": [".pdf"],
                    "application/msword": [".doc", ".docx"],
                  }}
                />
              </ErrorBoundary>
              {formData.requestLetter && (
                <UploadedDocument
                  doc={formData.requestLetter}
                  onRemove={() =>
                    setFormData((prev) => ({ ...prev, requestLetter: null }))
                  }
                  label="Request Letter"
                />
              )}

              <ErrorBoundary>
                <DocumentUpload
                  label="Authorization Letter (Optional)"
                  value={formData.authorizationLetter}
                  onChange={(file) =>
                    setFormData((prev) => ({
                      ...prev,
                      authorizationLetter: file,
                    }))
                  }
                  required={false}
                  accept={{
                    "application/pdf": [".pdf"],
                    "application/msword": [".doc", ".docx"],
                  }}
                />
              </ErrorBoundary>
              {formData.authorizationLetter && (
                <UploadedDocument
                  doc={formData.authorizationLetter}
                  onRemove={() =>
                    setFormData((prev) => ({
                      ...prev,
                      authorizationLetter: null,
                    }))
                  }
                  label="Authorization Letter"
                />
              )}

              <div>
                <ErrorBoundary>
                  <DocumentUpload
                    label="Additional Supporting Documents"
                    value={null}
                    onChange={addSupportingDoc}
                    required={false}
                    multiple={false}
                    accept={{
                      "application/pdf": [".pdf"],
                      "application/msword": [".doc", ".docx"],
                      "image/jpeg": [".jpg", ".jpeg"],
                      "image/png": [".png"],
                    }}
                  />
                </ErrorBoundary>

                {formData.supportingDocs.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-400">
                      Uploaded Documents ({formData.supportingDocs.length})
                    </p>
                    {formData.supportingDocs.map((doc, idx) => (
                      <UploadedDocument
                        key={idx}
                        doc={doc}
                        onRemove={() => removeSupportingDoc(idx)}
                        label={`Document ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Request
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ServiceRequestModal;
