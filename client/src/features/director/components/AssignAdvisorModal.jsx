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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-md overflow-hidden border border-[#E5E7EB] shadow-2xl"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-[#111827]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5"
          id="assign-form"
        >
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Select {participantLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <select
                required
                value={selectedParticipant}
                onChange={(e) => {
                  setSelectedParticipant(e.target.value);
                  if (errors.participant)
                    setErrors({ ...errors, participant: "" });
                }}
                className={`w-full pl-9 pr-8 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all appearance-none ${
                  errors.participant ? "border-red-500" : "border-[#D1D5DB]"
                }`}
              >
                <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  Select a {participantLabel.toLowerCase()}
                </option>
                {participantsWithoutAssignment.length === 0 ? (
                  <option disabled className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[#6b7280]">
                    No {participantLabel.toLowerCase()}s without{" "}
                    {assignmentLabel.toLowerCase()}
                  </option>
                ) : (
                  participantsWithoutAssignment.map((participant) => (
                    <option
                      key={participant._id}
                      value={participant._id}
                      className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
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
                  className="w-4 h-4 text-[#6b7280]"
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
                <p className="text-[#2563eb] text-xs mt-1 flex items-center gap-1">
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
              className="bg-[#EEF2FF] border border-[#2563eb]/30 rounded-lg p-3"
            >
              <p className="text-xs text-[#2563eb] flex items-center gap-1">
                <User className="w-3 h-3" />
                Selected {participantLabel}:
              </p>
              <p className="text-sm text-[#111827] font-medium mt-1">
                {getParticipantName(selectedParticipantData)}
              </p>
              {showUniversity &&
                getParticipantDetails(selectedParticipantData) && (
                  <p className="text-xs text-[#6b7280] mt-0.5">
                    {getParticipantDetails(selectedParticipantData)}
                  </p>
                )}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Select {assignmentLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <select
                required
                value={selectedStaff}
                onChange={(e) => {
                  setSelectedStaff(e.target.value);
                  if (errors.staff) setErrors({ ...errors, staff: "" });
                }}
                className={`w-full pl-9 pr-8 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all appearance-none ${
                  errors.staff ? "border-red-500" : "border-[#D1D5DB]"
                }`}
              >
                <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  Select a {assignmentLabel.toLowerCase()}
                </option>
                {eligibleStaff.length === 0 ? (
                  <option disabled className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[#6b7280]">
                    No staff members available in your directorate
                  </option>
                ) : (
                  eligibleStaff.map((staff) => (
                    <option
                      key={staff._id}
                      value={staff._id}
                      className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                    >
                      {staff.fullName} {staff.position && `- ${staff.position}`}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-[#6b7280]"
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
              <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                No staff members found in your directorate.
              </p>
            )}
          </div>

          {selectedStaff && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
            >
              <p className="text-xs text-blue-400 flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                Selected {assignmentLabel}:
              </p>
              <p className="text-sm text-[#111827] font-medium mt-1">
                {eligibleStaff.find((s) => s._id === selectedStaff)?.fullName ||
                  "Unknown"}
              </p>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {eligibleStaff.find((s) => s._id === selectedStaff)?.position ||
                  "Staff"}
              </p>
            </motion.div>
          )}

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 border border-[#E5E7EB]">
            <p className="text-xs text-[#6b7280] flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="font-medium">
                About {assignmentLabel} Assignment:
              </span>
            </p>
            <ul className="text-xs text-[#6b7280] mt-1 space-y-1 ml-4 list-disc">
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

        <div className="p-5 border-t border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              type="submit"
              form="assign-form"
              disabled={
                loading ||
                participantsWithoutAssignment.length === 0 ||
                eligibleStaff.length === 0
              }
              className="btn-institutional flex-1 py-2.5 disabled:opacity-50"
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
              className="flex-1 border border-[#D1D5DB] text-[#374151] py-2.5 rounded-lg hover:bg-[#F3F4F6] transition-all duration-200"
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
