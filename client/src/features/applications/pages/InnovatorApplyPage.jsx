import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { useApplications } from "../../../hooks/useApplications";
import { useToast } from "../../../common/ui/Toast";
import { DocumentUpload } from "../../../common/components/DocumentUpload";
import ErrorBoundary from "../../../common/components/ErrorBoundary";
import {
  Lightbulb,
  Building2,
  GraduationCap,
  BookOpen,
  Calendar,
  Users,
  FileText,
  Plus,
  X,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle,
  AlertCircle,
  Globe,
  Rocket,
  Phone,
} from "lucide-react";

const InnovatorApplyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitInnovatorApplication, loading } = useApplications();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    institution: "",
    educationLevel: "",
    fieldOfStudy: "",
    graduationYear: "",
    ideaTitle: "",
    ideaDescription: "",
    problemSolved: "",
    targetMarket: "",
    businessPlan: null,
    pitchDeck: null,
    areasOfInterest: [],
    skills: [],
  });

  const [areaInput, setAreaInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  if (user?.profiles?.innovator) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white shadow-sm rounded-2xl border border-gray-200 p-8 text-center"
        >
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-heading font-medium text-text-primary mb-2">
            Already Applied!
          </h2>
          <p className="text-text-muted mb-6">
            You have already submitted an innovation application. Our team is
            reviewing your idea. You will be notified once there's an update.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-md flex items-center justify-center gap-2 mx-auto"
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

  const addArea = () => {
    if (
      areaInput.trim() &&
      !formData.areasOfInterest.includes(areaInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        areasOfInterest: [...prev.areasOfInterest, areaInput.trim()],
      }));
      setAreaInput("");
    }
  };

  const removeArea = (area) => {
    setFormData((prev) => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.filter((a) => a !== area),
    }));
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
      if (!formData.institution) {
        addToast("Institution/Affiliation is required", "error");
        return false;
      }
      if (!formData.ideaTitle) {
        addToast("Idea title is required", "error");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.ideaDescription) {
        addToast("Idea description is required", "error");
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!formData.businessPlan) {
        addToast("Business plan is required", "error");
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
      businessPlan: formData.businessPlan || formData.businessPlan,
      pitchDeck: formData.pitchDeck || formData.pitchDeck,
    };

    try {
      const result = await submitInnovatorApplication(submitData);
      if (result?.success) {
        addToast(
          result.message || "Innovation application submitted successfully!",
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
    { number: 1, title: "Background", icon: GraduationCap },
    { number: 2, title: "Idea Details", icon: Lightbulb },
    { number: 3, title: "Documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-12 px-4 font-body">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 border border-accent/20 rounded-2xl mb-4 shadow-sm">
            <Rocket className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-heading font-medium text-text-primary mb-2">
            Innovation Application
          </h1>
          <p className="text-text-muted">
            Submit your innovative idea and join the next generation of
            innovators
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
                        ? "bg-accent text-white shadow-md"
                        : "bg-gray-100 border border-gray-200 text-text-muted"
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
                      isActive ? "text-accent" : "text-text-muted"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="absolute left-0 top-0 h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden"
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
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-heading font-medium text-text-primary">
                      Background Information
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="+251 912 345 678"
                        />
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        We'll use this to contact you about your application
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Institution/Affiliation{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          name="institution"
                          value={formData.institution}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="Addis Ababa University"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Education Level
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <select
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent appearance-none"
                          >
                            <option value="">Select Level</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="PhD">PhD</option>
                            <option value="Self-taught">Self-taught</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Field of Study
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                            placeholder="Computer Science"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Graduation Year
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="2024"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Idea Title <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lightbulb className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          name="ideaTitle"
                          value={formData.ideaTitle}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="Enter your innovative idea title"
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
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-heading font-medium text-text-primary">
                      Idea Details
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Idea Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="ideaDescription"
                        rows="5"
                        value={formData.ideaDescription}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="Describe your innovative idea in detail..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Problem Solved
                      </label>
                      <div className="relative">
                        <AlertCircle className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                        <textarea
                          name="problemSolved"
                          rows="3"
                          value={formData.problemSolved}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="What problem does your idea solve?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Target Market
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                        <textarea
                          name="targetMarket"
                          rows="3"
                          value={formData.targetMarket}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="Who is your target audience?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Areas of Interest
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={areaInput}
                          onChange={(e) => setAreaInput(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="e.g., AI, AgriTech, HealthTech"
                          onKeyDown={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addArea())
                          }
                        />
                        <button
                          type="button"
                          onClick={addArea}
                          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.areasOfInterest.map((area) => (
                          <span
                            key={area}
                            className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {area}
                            <button
                              type="button"
                              onClick={() => removeArea(area)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Skills
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="e.g., Python, Machine Learning, UI/UX"
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addSkill())
                          }
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-blue-50 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-500"
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
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-heading font-medium text-text-primary">
                      Documents & Resources
                    </h2>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        Upload your documents. Files will be automatically
                        shared with the innovation team.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <ErrorBoundary>
                      <DocumentUpload
                        label="Business Plan"
                        value={formData.businessPlan}
                        onChange={(file) =>
                          setFormData((prev) => ({
                            ...prev,
                            businessPlan: file,
                          }))
                        }
                        required
                        maxSizeMB={10}
                      />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <DocumentUpload
                        label="Pitch Deck"
                        value={formData.pitchDeck}
                        onChange={(file) =>
                          setFormData((prev) => ({
                            ...prev,
                            pitchDeck: file,
                          }))
                        }
                        required={false}
                        maxSizeMB={10}
                      />
                    </ErrorBoundary>
                  </div>

                  <div className="bg-blue-50 border border-accent/20 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-accent mt-0.5" />
                      <p className="text-sm text-text-secondary">
                        Your innovation will be reviewed by our expert panel.
                        We'll get back to you within 5-7 business days.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-gray-200 p-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 transition flex items-center gap-2"
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-md flex items-center gap-2 ${
                    currentStep === 1 ? "ml-auto" : ""
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-md flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Innovation
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
          <p className="text-xs text-text-muted">
            By submitting this application, you agree to our terms and
            conditions. Your innovation idea will be protected under our
            confidentiality policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default InnovatorApplyPage;
