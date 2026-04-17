import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Users, AlertCircle, User, Briefcase } from "lucide-react";

const AddMemberModal = ({ team, staffList, onClose, onSubmit }) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter out staff already in the team
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add Team Member</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5"
          id="add-member-form"
        >
          {/* Team Info */}
          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Team</p>
                <p className="font-semibold text-white">{team?.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <User className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-500">
                    Current members: {team?.members?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Select Staff Member <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                required
                value={selectedStaff}
                onChange={(e) => handleStaffChange(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none ${
                  error ? "border-red-500" : "border-gray-600"
                }`}
              >
                <option value="" className="bg-gray-800">
                  Select a staff member
                </option>
                {availableStaff.length === 0 ? (
                  <option disabled className="bg-gray-800 text-gray-500">
                    No available staff members
                  </option>
                ) : (
                  availableStaff.map((staff) => (
                    <option
                      key={staff._id}
                      value={staff._id}
                      className="bg-gray-800"
                    >
                      {staff.fullName} - {getPositionLabel(staff.position)}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
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
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
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

          {/* Selected Staff Preview */}
          {selectedStaffData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {selectedStaffData.fullName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {getPositionLabel(selectedStaffData.position)}
                  </p>
                  {selectedStaffData.email && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedStaffData.email}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </form>

        {/* Buttons */}
        <div className="p-5 border-t border-gray-700 bg-gray-800/90">
          <div className="flex gap-3">
            <button
              type="submit"
              form="add-member-form"
              disabled={loading || availableStaff.length === 0}
              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
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

export default AddMemberModal;
