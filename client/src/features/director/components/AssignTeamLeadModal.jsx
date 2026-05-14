import { useState } from "react";
import { motion } from "framer-motion";
import { X, Crown, UserCheck, AlertCircle } from "lucide-react";

const AssignTeamLeadModal = ({ team, staffList, onClose, onSubmit }) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStaff) {
      setError("Please select a staff member");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(selectedStaff);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to assign team lead");
    } finally {
      setLoading(false);
    }
  };

  const handleStaffChange = (staffId) => {
    setSelectedStaff(staffId);
    if (error) setError("");
  };

  // Filter staff that can be team leads (technical_staff, trainer, advisor, or any staff)
  const eligibleStaff = staffList.filter(
    (staff) =>
      staff.position === "technical_staff" ||
      staff.position === "trainer" ||
      staff.position === "advisor" ||
      staff.position === "team_lead",
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-md overflow-hidden border border-[#E5E7EB] shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#111827]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Assign Team Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F4F6] rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#6b7280] hover:text-[#111827]" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5"
          id="assign-lead-form"
        >
          {/* Team Info */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7280]">Selected Team</p>
                <p className="font-semibold text-[#111827]">{team?.name}</p>
              </div>
            </div>
          </div>

          {/* Staff Selection */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Select Team Lead <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <select
                required
                value={selectedStaff}
                onChange={(e) => handleStaffChange(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all appearance-none ${
                  error ? "border-red-500" : "border-[#D1D5DB]"
                }`}
              >
                <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  Select a staff member
                </option>
                {eligibleStaff.length === 0 ? (
                  <option disabled className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[#6b7280]">
                    No eligible staff available
                  </option>
                ) : (
                  eligibleStaff.map((staff) => (
                    <option
                      key={staff._id}
                      value={staff._id}
                      className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                    >
                      {staff.fullName} -{" "}
                      {staff.position?.replace(/_/g, " ").toUpperCase() ||
                        "Staff"}
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
            {error && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
            {eligibleStaff.length === 0 && !error && (
              <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                No eligible staff found. Staff members need to have positions
                like Technical Staff, Trainer, Advisor, or Team Lead.
              </p>
            )}
          </div>

          {/* Role Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-400 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span className="font-medium">Team Lead Responsibilities:</span>
            </p>
            <ul className="text-xs text-[#6b7280] mt-1 space-y-1 ml-4 list-disc">
              <li>Oversee team activities and performance</li>
              <li>Assign tasks to team members</li>

              <li>Mentor and guide team members...</li>
            </ul>
          </div>

          {/* Current Lead Info (if any) */}
          {team?.lead && (
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 border border-[#E5E7EB]">
              <p className="text-xs text-[#6b7280] flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                Current Team Lead:
              </p>
              <p className="text-sm text-[#111827] mt-1">
                {team.lead.fullName || team.lead.name}
              </p>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {team.lead.position || "Team Lead"}
              </p>
              <p className="text-xs text-yellow-400 mt-2">
                Note: Assigning a new lead will replace the current one.
              </p>
            </div>
          )}
        </form>

        {/* Buttons */}
        <div className="p-5 border-t border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              type="submit"
              form="assign-lead-form"
              disabled={loading || eligibleStaff.length === 0}
              className="flex-1 bg-linear-to-r from-yellow-500 to-orange-600 text-[#111827] py-2.5 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  Assign Lead
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

export default AssignTeamLeadModal;
