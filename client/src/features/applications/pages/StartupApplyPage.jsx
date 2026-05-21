import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";
import { useToast } from "../../../common/ui/Toast";
import { DocumentUpload } from "../../../common/components/DocumentUpload";
import ErrorBoundary from "../../../common/components/ErrorBoundary";
import {
  Building2,
  Briefcase,
  Calendar,
  Globe,
  FileText,
  Users,
  Plus,
  X,
  ArrowRight,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Mail,
  User,
  Percent,
  Phone,
  Rocket,
  Sparkles,
  Upload,
} from "lucide-react";

const StartupApplyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitStartupApplication, loading } = useApplications();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    registrationDate: "",
    sector: "",
    description: "",
    website: "",
    businessLicense: null,
    taxId: null,
    memorandum: null,
    founders: [{ name: "", role: "", email: "", share: "" }],
    employeeCount: 1,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  if (user?.profiles?.startup) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-2xl border border-[#E5E7EB] p-8 text-center"
        >
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">
            Already Registered!
          </h2>
          <p className="text-[#6b7280] mb-6">
            You have already submitted a startup registration. Our team is
            reviewing your application. You will be notified once there's an
            update.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] text-[#1D4ED8] border border-[#93C5FD] rounded-lg hover:from-[#BFDBFE] hover:to-[#93C5FD] transition-all duration-200 shadow-[0_4px_10px_rgba(37,99,235,0.08)] flex items-center justify-center gap-2 mx-auto"
          >
            Back to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFounderChange = (index, field, value) => {
    const updatedFounders = [...formData.founders];
    updatedFounders[index][field] = value;
    setFormData((prev) => ({ ...prev, founders: updatedFounders }));
  };

  const addFounder = () => {
    if (formData.founders.length < 10) {
      setFormData((prev) => ({
        ...prev,
        founders: [
          ...prev.founders,
          { name: "", role: "", email: "", share: "" },
        ],
      }));
    } else {
      addToast("Maximum 10 founders allowed", "warning");
    }
  };

  const removeFounder = (index) => {
    if (formData.founders.length > 1) {
      setFormData((prev) => ({
        ...prev,
        founders: prev.founders.filter((_, i) => i !== index),
      }));
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.companyName) {
        addToast("Company name is required", "error");
        return false;
      }
      if (!formData.registrationNumber) {
        addToast("Registration number is required", "error");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.businessLicense) {
        addToast("Business license is required", "error");
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      const hasValidFounders = formData.founders.every(
        (founder, index) =>
          (index === 0 && founder.name && founder.role && founder.email) ||
          (index > 0 && (!founder.name || !founder.role || !founder.email)),
      );
      if (!hasValidFounders) {
        addToast("Please fill in all founder details", "error");
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    const submitData = {
      ...formData,
      businessLicense: formData.businessLicense || formData.businessLicense,
      taxId: formData.taxId || formData.taxId,
      memorandum: formData.memorandum || formData.memorandum,
    };

    try {
      const result = await submitStartupApplication(submitData);
      if (result?.success) {
        addToast(
          result.message || "Startup registration submitted successfully!",
          "success",
        );
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      addToast(errorMessage, "error");
    }
  };

  const steps = [
    { number: 1, title: "Company Info", icon: Building2 },
    { number: 2, title: "Documents", icon: FileText },
    { number: 3, title: "Team", icon: Users },
  ];

  const sectors = [
    { value: "software", label: "Software", icon: "💻" },
    { value: "hardware", label: "Hardware", icon: "🔧" },
    { value: "agritech", label: "AgriTech", icon: "🌾" },
    { value: "fintech", label: "FinTech", icon: "💰" },
    { value: "healthtech", label: "HealthTech", icon: "🏥" },
    { value: "edtech", label: "EdTech", icon: "📚" },
    { value: "biotech", label: "BioTech", icon: "🧬" },
    { value: "cleantech", label: "CleanTech", icon: "🌱" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-2xl mb-4 shadow-sm">
            <Rocket className="w-8 h-8 text-[#2563eb]" />
          </div>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Startup Registration
          </h1>
          <p className="text-[#6b7280]">
            Register your company for incubation support and mentorship
          </p>
        </motion.div>

        <div className="mb-10">
          <div className="flex justify-between mb-4">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep >= step.number;
              const isCompleted = currentStep > step.number;
              return (
                <div key={step.number} className="text-center flex-1">
                  <div
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] text-[#1D4ED8] border border-[#93C5FD] shadow-md"
                        : "bg-[#F3F4F6] border border-[#E5E7EB] text-[#6b7280]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      isActive ? "text-[#2563eb]" : "text-[#6b7280]"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="relative w-full bg-[#E5E7EB] rounded-full h-2">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#DBEAFE] to-[#2563eb] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-2xl border border-[#E5E7EB] overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#EEF2FF] rounded-lg">
                      <Building2 className="w-5 h-5 text-[#2563eb]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#111827]">
                      Company Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                          placeholder="InnovateTech Solutions"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">
                        Registration Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                        <input
                          type="text"
                          name="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                          placeholder="REG-2024-001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">
                        Registration Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                        <input
                          type="date"
                          name="registrationDate"
                          value={formData.registrationDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">
                        Sector
                      </label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                        <select
                          name="sector"
                          value={formData.sector}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] appearance-none"
                        >
                          <option value="">Select Sector</option>
                          {sectors.map((sector) => (
                            <option key={sector.value} value={sector.value}>
                              {sector.icon} {sector.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#374151] mb-2">
                        Company Description
                      </label>
                      <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                        placeholder="Describe your company's mission, vision, and what you do..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">
                        Employee Count
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                        <input
                          type="number"
                          name="employeeCount"
                          value={formData.employeeCount}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#EEF2FF] rounded-lg">
                      <FileText className="w-5 h-5 text-[#2563eb]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#111827]">
                      Required Documents
                    </h2>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Upload className="w-5 h-5 text-blue-400 mt-0.5" />
                      <p className="text-sm text-blue-300">
                        Upload your documents from Google Drive. Files will be
                        automatically shared with the incubation team.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <ErrorBoundary>
                      <DocumentUpload
                        label="Business License / Registration Certificate"
                        value={formData.businessLicense}
                        onChange={(file) =>
                          setFormData((prev) => ({
                            ...prev,
                            businessLicense: file,
                          }))
                        }
                        required
                        accept={{
                          "application/pdf": [".pdf"],
                          "application/msword": [".doc", ".docx"],
                          "image/jpeg": [".jpg", ".jpeg"],
                          "image/png": [".png"],
                        }}
                      />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <DocumentUpload
                        label="Tax ID / TIN Certificate"
                        value={formData.taxId}
                        onChange={(file) =>
                          setFormData((prev) => ({
                            ...prev,
                            taxId: file,
                          }))
                        }
                        required={false}
                        accept={{
                          "application/pdf": [".pdf"],
                          "image/jpeg": [".jpg", ".jpeg"],
                          "image/png": [".png"],
                        }}
                      />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <DocumentUpload
                        label="Memorandum of Association"
                        value={formData.memorandum}
                        onChange={(file) =>
                          setFormData((prev) => ({
                            ...prev,
                            memorandum: file,
                          }))
                        }
                        required={false}
                        accept={{
                          "application/pdf": [".pdf"],
                          "application/msword": [".doc", ".docx"],
                        }}
                      />
                    </ErrorBoundary>
                  </div>

                  <div className="bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#2563eb] mt-0.5" />
                      <p className="text-sm text-[#1d4ed8]">
                        Your startup will be reviewed by our expert panel. We'll
                        get back to you within 5-7 business days.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 space-y-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#EEF2FF] rounded-lg">
                        <Users className="w-5 h-5 text-[#2563eb]" />
                      </div>
                      <h2 className="text-xl font-semibold text-[#111827]">
                        Founders & Team Members
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={addFounder}
                      className="px-3 py-1.5 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] text-[#1D4ED8] border border-[#93C5FD] rounded-lg hover:from-[#BFDBFE] hover:to-[#93C5FD] transition-all duration-200 shadow-sm flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Founder
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.founders.map((founder, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F9FAFB] border border-[#E5E7EB] border border-[#D1D5DB] rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-[#111827] font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-[#2563eb]" />
                            Founder {index + 1}
                            {index === 0 && (
                              <span className="text-xs bg-[#EEF2FF] text-[#2563eb] px-2 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </h3>
                          {formData.founders.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFounder(index)}
                              className="text-red-500 hover:text-red-600 transition p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-[#6b7280] mb-1">
                              Full Name {index === 0 && "*"}
                            </label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={founder.name}
                              onChange={(e) =>
                                handleFounderChange(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-[#6b7280] mb-1">
                              Role {index === 0 && "*"}
                            </label>
                            <input
                              type="text"
                              placeholder="CEO, CTO, etc."
                              value={founder.role}
                              onChange={(e) =>
                                handleFounderChange(
                                  index,
                                  "role",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-[#6b7280] mb-1">
                              Email {index === 0 && "*"}
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6b7280]" />
                              <input
                                type="email"
                                placeholder="founder@company.com"
                                value={founder.email}
                                onChange={(e) =>
                                  handleFounderChange(
                                    index,
                                    "email",
                                    e.target.value,
                                  )
                                }
                                className="w-full pl-7 pr-2 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-[#6b7280] mb-1">
                              Equity Share (%)
                            </label>
                            <div className="relative">
                              <Percent className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6b7280]" />
                              <input
                                type="number"
                                placeholder="25"
                                value={founder.share}
                                onChange={(e) =>
                                  handleFounderChange(
                                    index,
                                    "share",
                                    e.target.value,
                                  )
                                }
                                className="w-full pl-7 pr-2 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] text-sm"
                                min="0"
                                max="100"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {formData.founders.length === 1 && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-xs text-blue-300 text-center">
                        💡 You can add up to 10 founders. The first founder is
                        considered the primary contact.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-[#E5E7EB] p-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-[#D1D5DB] rounded-lg text-[#374151] hover:bg-[#F3F4F6] transition flex items-center gap-2"
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-6 py-2 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] text-[#1D4ED8] border border-[#93C5FD] font-medium rounded-lg hover:from-[#BFDBFE] hover:to-[#93C5FD] transition-all duration-200 shadow-[0_4px_10px_rgba(37,99,235,0.08)] flex items-center gap-2 ${
                    currentStep === 1 ? "ml-auto" : ""
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] text-[#1D4ED8] border border-[#93C5FD] font-medium rounded-lg hover:from-[#BFDBFE] hover:to-[#93C5FD] transition-all duration-200 shadow-[0_4px_10px_rgba(37,99,235,0.08)] flex items-center gap-2 ml-auto disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Register Startup
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-[#6b7280]">
            By submitting this registration, you agree to our terms and
            conditions. Your information will be kept confidential and used only
            for the incubation program.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StartupApplyPage;
