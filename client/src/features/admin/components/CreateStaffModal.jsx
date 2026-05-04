import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  X,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Users,
  AlertCircle,
  Edit,
} from "lucide-react";
import { useToast } from "../../../common/ui/Toast";

const CreateStaffModal = ({
  onClose,
  onSubmit,
  directorates,
  initialData,
  isEditing,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    position: "",
    directorateId: "",
    teamId: "",
  });
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  const positions = [
    { value: "director", label: "Director", icon: Briefcase },
    { value: "team_lead", label: "Team Lead", icon: Users },
    { value: "technical_staff", label: "Technical Staff", icon: Briefcase },
    { value: "trainer", label: "Trainer", icon: Briefcase },
    { value: "advisor", label: "Advisor", icon: Briefcase },
    { value: "mentor", label: "Mentor", icon: Briefcase },
    { value: "hr_officer", label: "HR Officer", icon: Briefcase },
  ];

  // ✅ Populate form when editing
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        email: initialData.email || "",
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        position: initialData.position || "",
        directorateId:
          initialData.directorate?._id || initialData.directorateId || "",
        teamId: initialData.team?._id || initialData.teamId || "",
      });

      // Load teams for the selected directorate
      if (initialData.directorate?._id || initialData.directorateId) {
        const dirId = initialData.directorate?._id || initialData.directorateId;
        fetchTeams(dirId);
      }
    }
  }, [initialData, isEditing]);

  const fetchTeams = async (directorateId) => {
    try {
      const response = await fetch(`/api/directorates/${directorateId}/teams`);
      const data = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setTeams([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.directorateId)
      newErrors.directorateId = "Directorate is required";

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    setBackendError("");
    return Object.keys(newErrors).length === 0;
  };

  const handleDirectorateChange = async (directorateId) => {
    setFormData({ ...formData, directorateId, teamId: "" });
    setErrors({ ...errors, directorateId: "" });
    setBackendError("");
    if (directorateId) {
      await fetchTeams(directorateId);
    } else {
      setTeams([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
    setBackendError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);
    setBackendError("");
    try {
      const submitData = {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        position: formData.position,
        directorateId: formData.directorateId,
        teamId: formData.teamId || undefined,
      };

      await onSubmit(submitData);
      addToast(
        isEditing
          ? "Staff updated successfully!"
          : "Staff created successfully! They will receive an email with login credentials.",
        "success",
      );
      onClose();
    } catch (error) {
      let errorMessage = isEditing
        ? "Failed to update staff"
        : "Failed to create staff";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        errorMessage = Object.values(validationErrors).join(", ");
        setBackendError(errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (errorMessage.toLowerCase().includes("directorate")) {
        setErrors((prev) => ({ ...prev, directorateId: errorMessage }));
      } else if (errorMessage.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.toLowerCase().includes("phone")) {
        setErrors((prev) => ({ ...prev, phone: errorMessage }));
      } else {
        setBackendError(errorMessage);
      }

      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl max-w-md w-full flex flex-col max-h-[90vh] border border-gray-700 shadow-2xl"
      >
        {/* Header - Sticky */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              {isEditing ? (
                <Edit className="w-4 h-4 text-white" />
              ) : (
                <UserPlus className="w-4 h-4 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "Edit Staff Member" : "Create Staff"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <form onSubmit={handleSubmit} className="space-y-4" id="staff-form">
            {/* Backend Error Banner */}
            {backendError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-400">{backendError}</p>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                    errors.fullName ? "border-red-500" : "border-gray-600"
                  }`}
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email - Disable when editing? (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  disabled={isEditing}
                  className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  } ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
              {isEditing && (
                <p className="text-gray-500 text-xs mt-1">
                  Email cannot be changed after creation
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                    errors.phone ? "border-red-500" : "border-gray-600"
                  }`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+251 912 345 678"
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Position <span className="text-red-400">*</span>
              </label>
              <select
                required
                className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                  errors.position ? "border-red-500" : "border-gray-600"
                }`}
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              >
                <option value="" className="bg-gray-800">
                  Select Position
                </option>
                {positions.map((p) => (
                  <option key={p.value} value={p.value} className="bg-gray-800">
                    {p.label}
                  </option>
                ))}
              </select>
              {errors.position && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.position}
                </p>
              )}
            </div>

            {/* Directorate */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Directorate <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  required
                  className={`w-full pl-9 pr-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
                    errors.directorateId ? "border-red-500" : "border-gray-600"
                  }`}
                  value={formData.directorateId}
                  onChange={(e) => handleDirectorateChange(e.target.value)}
                >
                  <option value="" className="bg-gray-800">
                    Select Directorate
                  </option>
                  {directorates?.map((d) => (
                    <option key={d._id} value={d._id} className="bg-gray-800">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.directorateId && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.directorateId}
                </p>
              )}
            </div>

            {/* Team */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Team <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  className="w-full pl-9 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.teamId}
                  onChange={(e) => handleInputChange("teamId", e.target.value)}
                  disabled={!formData.directorateId}
                >
                  <option value="" className="bg-gray-800">
                    Select Team
                  </option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id} className="bg-gray-800">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              {!formData.directorateId && (
                <p className="text-gray-500 text-xs mt-1">
                  Select a directorate first to see available teams
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Buttons - Sticky at Bottom */}
        <div className="p-5 border-t border-gray-700 bg-gray-800 rounded-b-2xl sticky bottom-0">
          <div className="flex gap-3">
            <button
              type="submit"
              form="staff-form"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <Edit className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {isEditing ? "Update Staff" : "Create Staff"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateStaffModal;
