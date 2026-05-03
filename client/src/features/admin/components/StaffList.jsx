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
        return "bg-gray-500/20 text-[#4b5563] border border-gray-500/30";
      case "trainer":
        return "bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30";
      case "advisor":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "hr_officer":
        return "bg-pink-500/20 text-pink-400 border border-pink-500/30";
      case "innovation_officer":
        return "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30";
      default:
        return "bg-gray-500/20 text-[#4b5563] border border-gray-500/30";
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
            Staff Management
          </h2>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-1">
            Manage staff members and their roles ({staff?.length || 0} total)
          </p>
        </div>
      </div>

      {/* Search, Filter and Add Button - Inline */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white/60 border border-[#E5E7EB] rounded-lg text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#334155]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Position Filter Dropdown */}
        <select
          className="px-4 py-2 bg-white/60 border border-[#E5E7EB] rounded-lg text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all cursor-pointer"
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
        >
          {positions.map((p) => (
            <option key={p} value={p} className="bg-white">
              {p === "all" ? "All Positions" : getPositionLabel(p)}
            </option>
          ))}
        </select>

        {/* Add Button */}
        <button
          onClick={onCreate}
          className="bg-[#2563eb] text-[#0f172a] px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 shadow-lg whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((staffMember, index) => (
          <motion.div
            key={staffMember._id || staffMember.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white/60 backdrop-blur-sm border border-[#E5E7EB] rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-[#E5E7EB] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#0f172a]" />
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(staffMember.position)}`}
                  >
                    {getPositionLabel(staffMember.position)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      staffMember.isActive
                        ? "bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {staffMember.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 className="font-semibold text-[#0f172a] text-base sm:text-lg mb-1">
                  {staffMember.fullName}
                </h3>
                <div className="flex items-center gap-1 text-sm text-[#4b5563] mt-1">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{staffMember.email}</span>
                </div>
                {staffMember.phone && (
                  <div className="flex items-center gap-1 text-sm text-[#4b5563] mt-1">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{staffMember.phone}</span>
                  </div>
                )}
                {staffMember.directorate?.name && (
                  <div className="flex items-center gap-1 text-xs text-[#64748b] mt-2">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      Directorate: {staffMember.directorate.name}
                    </span>
                  </div>
                )}
                {staffMember.team?.name && (
                  <div className="flex items-center gap-1 text-xs text-[#64748b] mt-1">
                    <Users className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      Team: {staffMember.team.name}
                    </span>
                  </div>
                )}
                {staffMember.employeeId && (
                  <p className="text-xs text-[#64748b] mt-2">
                    ID: {staffMember.employeeId}
                  </p>
                )}
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() =>
                    onResetPassword(staffMember._id || staffMember.id)
                  }
                  className="p-1.5 text-[#64748b] hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition"
                  title="Reset Password"
                >
                  <Key className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(staffMember)}
                  className="p-1.5 text-[#64748b] hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(staffMember._id || staffMember.id)}
                  className="p-1.5 text-[#64748b] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filtered?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E5E7EB]"
        >
          <Users className="w-16 h-16 text-[#64748b] mx-auto mb-4" />
          <p className="text-[#4b5563]">No staff found</p>
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

      {/* Results Count */}
      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-[#64748b]">
          Showing {filtered.length} of {staff?.length || 0} staff members
        </div>
      )}
    </div>
  );
};

export default StaffList;
