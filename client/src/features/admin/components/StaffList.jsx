import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Key,
  User,
  Mail,
  Phone,
  Building2,
  Users,
  Search,
  Shield,
  X,
} from "lucide-react";

const StaffList = ({
  staff,
  onEdit,
  onDelete,
  onResetPassword,
  onCreate,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");

  const positions = [
    "all",
    "director",
    "team_lead",
    "technical_staff",
    "trainer",
    "advisor",
    "hr_officer",
    "innovation_officer",
  ];

  const getPositionColor = (position) => {
    switch (position) {
      case "director":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "team_lead":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "technical_staff":
        return "bg-gray-500/20 text-[#6b7280] border border-gray-500/30";
      case "trainer":
        return "bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/30";
      case "advisor":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "hr_officer":
        return "bg-pink-500/20 text-pink-400 border border-pink-500/30";
      case "innovation_officer":
        return "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30";
      default:
        return "bg-gray-500/20 text-[#6b7280] border border-gray-500/30";
    }
  };

  const getPositionLabel = (position) => {
    switch (position) {
      case "director":
        return "Director";
      case "team_lead":
        return "Team Lead";
      case "technical_staff":
        return "Technical Staff";
      case "trainer":
        return "Trainer";
      case "advisor":
        return "Advisor";
      case "hr_officer":
        return "HR Officer";
      case "innovation_officer":
        return "Innovation Officer";
      default:
        return position || "Staff";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPosition("all");
  };

  const filtered = staff?.filter((s) => {
    if (filterPosition !== "all" && s.position !== filterPosition) return false;
    if (
      searchTerm &&
      !s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading && !staff) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
            Staff Management
          </h2>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1">
            Manage staff members and their roles ({staff?.length || 0} total)
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#374151]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          className="px-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#111827] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all cursor-pointer shadow-sm"
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
        >
          {positions.map((p) => (
            <option key={p} value={p} className="bg-white text-[#111827]">
              {p === "all" ? "All Positions" : getPositionLabel(p)}
            </option>
          ))}
        </select>

        <button
          onClick={onCreate}
          className="bg-[#2563eb] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1d4ed8] transition-all duration-200 shadow-md whitespace-nowrap font-medium"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((staffMember, index) => (
          <motion.div
            key={staffMember._id || staffMember.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl p-4 sm:p-5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="w-8 h-8 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#2563eb]" />
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(staffMember.position)}`}
                  >
                    {getPositionLabel(staffMember.position)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      staffMember.isActive
                        ? "bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/30"
                        : "bg-red-500/20 text-red-500 border border-red-500/30"
                    }`}
                  >
                    {staffMember.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 className="font-semibold text-[#111827] text-base sm:text-lg mb-1">
                  {staffMember.fullName}
                </h3>
                <div className="flex items-center gap-1 text-sm text-[#6b7280] mt-1">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{staffMember.email}</span>
                </div>
                {staffMember.phone && (
                  <div className="flex items-center gap-1 text-sm text-[#6b7280] mt-1">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{staffMember.phone}</span>
                  </div>
                )}
                {staffMember.directorate?.name && (
                  <div className="flex items-center gap-1 text-xs text-[#6b7280] mt-2">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      Directorate: {staffMember.directorate.name}
                    </span>
                  </div>
                )}
                {staffMember.team?.name && (
                  <div className="flex items-center gap-1 text-xs text-[#6b7280] mt-1">
                    <Users className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      Team: {staffMember.team.name}
                    </span>
                  </div>
                )}
                {staffMember.employeeId && (
                  <p className="text-xs text-[#6b7280] mt-2">
                    ID: {staffMember.employeeId}
                  </p>
                )}
              </div>
              <div className="flex">
                <button
                  onClick={() =>
                    onResetPassword(staffMember._id || staffMember.id)
                  }
                  className="p-1.5 text-[#6b7280] hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                  title="Reset Password"
                >
                  <Key className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onEdit(staffMember)}
                  className="p-1.5 text-[#6b7280] hover:text-[#2563eb] hover:bg-[#EEF2FF] rounded-lg transition"
                  title="Edit"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(staffMember._id || staffMember.id)}
                  className="p-1.5 text-[#6b7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB]"
        >
          <Users className="w-16 h-16 text-[#9ca3af] mx-auto mb-4" />
          <p className="text-[#6b7280]">No staff found</p>
          {(searchTerm || filterPosition !== "all") && (
            <button
              onClick={clearFilters}
              className="mt-2 text-[#2563eb] hover:text-[#1d4ed8] transition text-sm"
            >
              Clear all filters
            </button>
          )}
          <button
            onClick={onCreate}
            className="mt-4 text-[#2563eb] hover:text-[#1d4ed8] transition block mx-auto"
          >
            + Add your first staff member
          </button>
        </motion.div>
      )}

      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-[#6b7280]">
          Showing {filtered.length} of {staff?.length || 0} staff members
        </div>
      )}
    </div>
  );
};

export default StaffList;
