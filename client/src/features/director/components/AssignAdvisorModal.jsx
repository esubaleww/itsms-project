import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  UserCheck,
  Users,
  GraduationCap,
  AlertCircle,
  Send,
  User,
  CheckCircle,
} from "lucide-react";

const AssignAdvisorModal = ({
  onClose,
  onSubmit,
  interns,
  staffList,
  title = "Assign Advisor",
  participantLabel = "Intern",
  assignmentLabel = "Advisor",
  showUniversity = true,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const participantsWithoutAssignment =
    interns?.filter(
      (participant) =>
        !participant.assignedAdvisor &&
        !participant.assignedMentor &&
        !participant.assignedTrainer,
    ) || [];

  const eligibleStaff = staffList || [];

  const validateForm = () => {
    const newErrors = {};
    if (!selectedParticipant)
      newErrors.participant = `Please select a ${participantLabel.toLowerCase()}`;
    if (!selectedStaff)
      newErrors.staff = `Please select a ${assignmentLabel.toLowerCase()}`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(selectedParticipant, selectedStaff);
      onClose();
    } catch (error) {
      console.error(
        `Failed to assign ${assignmentLabel.toLowerCase()}:`,
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const getParticipantName = (participant) => {
    if (participant.user?.fullName) return participant.user.fullName;
    if (participant.fullName) return participant.fullName;
    if (participant.companyName) return participant.companyName;
    return "Unknown";
  };

  const getParticipantDetails = (participant) => {
    if (participant.university?.name) return participant.university.name;
    if (participant.university) return participant.university;
    if (participant.ideaTitle) return participant.ideaTitle;
    if (participant.sector) return participant.sector;
    if (participant.program) return participant.program;
    return "";
  };

  const selectedParticipantData = participantsWithoutAssignment.find(
    (participant) => participant._id === selectedParticipant,
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-lg rounded-2xl w-full max-w-md overflow-hidden border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 border border-accent/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-text-primary" />
            </div>
            <h2 className="text-xl font-heading font-medium text-text-primary">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5"
          id="assign-form"
        >
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Select {participantLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <select
                required
                value={selectedParticipant}
                onChange={(e) => {
                  setSelectedParticipant(e.target.value);
                  if (errors.participant)
                    setErrors({ ...errors, participant: "" });
                }}
                className={`w-full pl-9 pr-8 py-2 bg-white border rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none ${
                  errors.participant ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" className="bg-white shadow-sm">
                  Select a {participantLabel.toLowerCase()}
                </option>
                {participantsWithoutAssignment.length === 0 ? (
                  <option
                    disabled
                    className="bg-white shadow-sm text-text-muted"
                  >
                    No {participantLabel.toLowerCase()}s without{" "}
                    {assignmentLabel.toLowerCase()}
                  </option>
                ) : (
                  participantsWithoutAssignment.map((participant) => (
                    <option
                      key={participant._id}
                      value={participant._id}
                      className="bg-white shadow-sm"
                    >
                      {getParticipantName(participant)}
                      {showUniversity &&
                        getParticipantDetails(participant) &&
                        ` - ${getParticipantDetails(participant)}`}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.participant && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.participant}
              </p>
            )}
            {participantsWithoutAssignment.length === 0 &&
              !errors.participant && (
                <p className="text-accent text-xs mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  All {participantLabel.toLowerCase()}s have{" "}
                  {assignmentLabel.toLowerCase()}s assigned!
                </p>
              )}
          </div>

          {selectedParticipantData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-accent/30 rounded-lg p-3"
            >
              <p className="text-xs text-accent flex items-center gap-1">
                <User className="w-3 h-3" />
                Selected {participantLabel}:
              </p>
              <p className="text-sm font-medium text-text-primary mt-1">
                {getParticipantName(selectedParticipantData)}
              </p>
              {showUniversity &&
                getParticipantDetails(selectedParticipantData) && (
                  <p className="text-xs text-text-muted mt-0.5">
                    {getParticipantDetails(selectedParticipantData)}
                  </p>
                )}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Select {assignmentLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <select
                required
                value={selectedStaff}
                onChange={(e) => {
                  setSelectedStaff(e.target.value);
                  if (errors.staff) setErrors({ ...errors, staff: "" });
                }}
                className={`w-full pl-9 pr-8 py-2 bg-white border rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none ${
                  errors.staff ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" className="bg-white shadow-sm">
                  Select a {assignmentLabel.toLowerCase()}
                </option>
                {eligibleStaff.length === 0 ? (
                  <option
                    disabled
                    className="bg-white shadow-sm text-text-muted"
                  >
                    No staff members available in your directorate
                  </option>
                ) : (
                  eligibleStaff.map((staff) => (
                    <option
                      key={staff._id}
                      value={staff._id}
                      className="bg-white shadow-sm"
                    >
                      {staff.fullName} {staff.position && `- ${staff.position}`}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.staff && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.staff}
              </p>
            )}
            {eligibleStaff.length === 0 && !errors.staff && (
              <p className="text-yellow-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                No staff members found in your directorate.
              </p>
            )}
          </div>

          {selectedStaff && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            >
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                Selected {assignmentLabel}:
              </p>
              <p className="text-sm font-medium text-text-primary mt-1">
                {eligibleStaff.find((s) => s._id === selectedStaff)?.fullName ||
                  "Unknown"}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {eligibleStaff.find((s) => s._id === selectedStaff)?.position ||
                  "Staff"}
              </p>
            </motion.div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-text-muted flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="font-medium">
                About {assignmentLabel} Assignment:
              </span>
            </p>
            <ul className="text-xs text-text-muted mt-1 space-y-1 ml-4 list-disc">
              <li>
                {assignmentLabel}s will guide {participantLabel.toLowerCase()}s
                through their journey
              </li>
              <li>
                Each {participantLabel.toLowerCase()} should have one assigned{" "}
                {assignmentLabel.toLowerCase()}
              </li>
              <li>
                You can reassign {assignmentLabel.toLowerCase()}s at any time
              </li>
            </ul>
          </div>
        </form>

        <div className="p-5 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <button
              type="submit"
              form="assign-form"
              disabled={
                loading ||
                participantsWithoutAssignment.length === 0 ||
                eligibleStaff.length === 0
              }
              className="btn-filled flex-1 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Assign {assignmentLabel}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-text-secondary py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignAdvisorModal;
