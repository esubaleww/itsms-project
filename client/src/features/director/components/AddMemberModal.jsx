import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Users, AlertCircle, User, Briefcase } from "lucide-react";

const AddMemberModal = ({ team, staffList, onClose, onSubmit }) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableStaff = useMemo(() => {
    const currentMemberIds =
      team?.members?.map((m) => m.user?._id || m._id || m) || [];
    return staffList.filter((staff) => !currentMemberIds.includes(staff._id));
  }, [staffList, team]);

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
      setError(err.message || "Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  const handleStaffChange = (staffId) => {
    setSelectedStaff(staffId);
    if (error) setError("");
  };

  const getPositionLabel = (position) => {
    switch (position) {
      case "technical_staff":
        return "Technical Staff";
      case "team_lead":
        return "Team Lead";
      case "trainer":
        return "Trainer";
      case "advisor":
        return "Advisor";
      case "director":
        return "Director";
      case "hr_officer":
        return "HR Officer";
      default:
        return position?.replace(/_/g, " ").toUpperCase() || "Staff";
    }
  };

  const selectedStaffData = availableStaff.find(
    (staff) => staff._id === selectedStaff,
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
              <UserPlus className="w-4 h-4 text-[#111827]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Add Team Member</h2>
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
          id="add-member-form"
        >
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7280]">Team</p>
                <p className="font-semibold text-[#111827]">{team?.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <User className="w-3 h-3 text-[#6b7280]" />
                  <p className="text-xs text-[#6b7280]">
                    Current members: {team?.members?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Select Staff Member <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <select
                required
                value={selectedStaff}
                onChange={(e) => handleStaffChange(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 bg-white border rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all appearance-none ${
                  error ? "border-red-500" : "border-[#D1D5DB]"
                }`}
              >
                <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  Select a staff member
                </option>
                {availableStaff.length === 0 ? (
                  <option disabled className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[#6b7280]">
                    No available staff members
                  </option>
                ) : (
                  availableStaff.map((staff) => (
                    <option
                      key={staff._id}
                      value={staff._id}
                      className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                    >
                      {staff.fullName} - {getPositionLabel(staff.position)}
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
            {availableStaff.length === 0 && !error && (
              <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                All staff members are already in this team.
              </p>
            )}
          </div>

          {selectedStaffData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#EEF2FF] border border-[#2563eb]/30 rounded-lg p-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">
                    {selectedStaffData.fullName}
                  </p>
                  <p className="text-xs text-[#6b7280] mt-0.5">
                    {getPositionLabel(selectedStaffData.position)}
                  </p>
                  {selectedStaffData.email && (
                    <p className="text-xs text-[#6b7280] mt-1">
                      {selectedStaffData.email}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </form>

        <div className="p-5 border-t border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              type="submit"
              form="add-member-form"
              disabled={loading || availableStaff.length === 0}
              className="btn-institutional flex-1 py-2.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add Member
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

export default AddMemberModal;
