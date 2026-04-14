import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";
import { useToast } from "../../../components/ui/Toast";
import { DocumentUpload } from "../../../components/common/DocumentUpload";
import ErrorBoundary from "../../../components/common/ErrorBoundary";
import {
  GraduationCap,
  Building2,
  BookOpen,
  FileText,
  Upload,
  Plus,
  X,
  ArrowRight,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Briefcase,
  User,
  Mail,
  Phone,
  School,
  Rocket,
} from "lucide-react";

const TrainingApplyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitTrainingApplication, loading } = useApplications();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    institution: "",
    profession: "",
    skills: [],
    applicationLetter: null,
    cv: null,
  });

  const [skillInput, setSkillInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  if (user?.profiles?.training) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center"
        >
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Already Applied!
          </h2>
          <p className="text-gray-400 mb-6">
            You have already submitted a training application. Our team is
            reviewing your application. You will be notified once there's an
            update.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-linear-to-r from-emerald-500 to-teal-700 text-white rounded-lg hover:from-emerald-600 hover:to-teal-800 transition flex items-center justify-center gap-2 mx-auto"
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

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.phone) {
        addToast("Please enter your phone number", "error");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.institution) {
        addToast("Institution/Organization is required", "error");
        return false;
      }
      if (!formData.profession) {
        addToast("Profession/Field of expertise is required", "error");
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!formData.applicationLetter) {
        addToast("Application letter is required", "error");
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
      applicationLetter: formData.applicationLetter,
      cv: formData.cv,
    };

    try {
      const result = await submitTrainingApplication(submitData);
      if (result?.success) {
        addToast(
          result.message || "Training application submitted successfully!",
          "success",
        );
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Application failed";
      addToast(errorMessage, "error");
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Background", icon: GraduationCap },
    { number: 3, title: "Documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 bg-linear-to-r from-emerald-500 to-teal-700 rounded-2xl mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Training Application
          </h1>
          <p className="text-gray-400">
            Enhance your skills and join our professional training programs
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
                        ? "bg-linear-to-r from-emerald-500 to-teal-700 text-white shadow-lg"
                        : "bg-gray-700 text-gray-400"
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
                      isActive ? "text-emerald-400" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="relative w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="absolute left-0 top-0 h-full bg-linear-to-r from-emerald-500 to-teal-700 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
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
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={formData.fullName}
                          disabled
                          className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          placeholder="+251 912 345 678"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <p className="text-sm text-emerald-300">
                        Your personal information is pre-filled from your
                        account. Please add your phone number to continue.
                      </p>
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
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Background & Skills
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Institution / Organization{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          name="institution"
                          value={formData.institution}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          placeholder="Your university, college, or organization"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profession / Field of Expertise{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          name="profession"
                          value={formData.profession}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., Software Developer, Data Scientist, Project Manager"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skills
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., JavaScript, Python, Project Management"
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addSkill())
                          }
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
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
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Required Documents
                    </h2>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Upload className="w-5 h-5 text-blue-400 mt-0.5" />
                      <p className="text-sm text-blue-300">
                        Upload your documents from Google Drive. Files will be
                        automatically shared with the training team.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <ErrorBoundary>
                      <DocumentUpload
                        label="Application Letter"
                        value={formData.applicationLetter}
                        onChange={(file) =>
                          setFormData((prev) => ({
                            ...prev,
                            applicationLetter: file,
                          }))
                        }
                        required
                        accept={{
                          "application/pdf": [".pdf"],
                          "application/msword": [".doc", ".docx"],
                        }}
                      />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <DocumentUpload
                        label="CV / Resume (Optional)"
                        value={formData.cv}
                        onChange={(file) =>
                          setFormData((prev) => ({
                            ...prev,
                            cv: file,
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

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Rocket className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <p className="text-sm text-emerald-300">
                        Your application will be reviewed by our training team.
                        We'll get back to you within 5-7 business days.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-gray-700 p-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition flex items-center gap-2"
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-6 py-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition flex items-center gap-2 ${
                    currentStep === 1 ? "ml-auto" : ""
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition flex items-center gap-2 ml-auto disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
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
          <p className="text-xs text-gray-500">
            By submitting this application, you agree to our terms and
            conditions. Your information will be kept confidential and used only
            for the training program.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingApplyPage;
