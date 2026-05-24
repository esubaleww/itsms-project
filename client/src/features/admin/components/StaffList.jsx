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
        return "bg-purple-50 text-purple-600 border border-purple-500/30";
      case "team_lead":
        return "bg-blue-50 text-blue-600 border border-blue-500/30";
      case "technical_staff":
        return "bg-gray-100 text-text-muted border border-gray-300";
      case "trainer":
        return "bg-blue-50 text-accent border border-accent/30";
      case "advisor":
        return "bg-yellow-50 text-yellow-600 border border-yellow-500/30";
      case "hr_officer":
        return "bg-pink-50 text-pink-600 border border-pink-500/30";
      case "innovation_officer":
        return "bg-indigo-50 text-indigo-600 border border-indigo-500/30";
      default:
        return "bg-gray-100 text-text-muted border border-gray-300";
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-medium text-text-primary">
            Staff Management
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage staff members and their roles ({staff?.length || 0} total)
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer shadow-sm"
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
        >
          {positions.map((p) => (
            <option key={p} value={p} className="bg-white text-text-primary">
              {p === "all" ? "All Positions" : getPositionLabel(p)}
            </option>
          ))}
        </select>

        <button
          onClick={onCreate}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-accent/90 transition-all duration-200 shadow-md whitespace-nowrap font-medium"
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
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="w-8 h-8 bg-blue-50 border border-accent/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(staffMember.position)}`}
                  >
                    {getPositionLabel(staffMember.position)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      staffMember.isActive
                        ? "bg-blue-50 text-accent border border-accent/30"
                        : "bg-red-50 text-red-600 border border-red-500/30"
                    }`}
                  >
                    {staffMember.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 className="font-heading font-medium text-text-primary text-base sm:text-lg mb-1">
                  {staffMember.fullName}
                </h3>
                <div className="flex items-center gap-1 text-sm text-text-muted mt-1">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{staffMember.email}</span>
                </div>
                {staffMember.phone && (
                  <div className="flex items-center gap-1 text-sm text-text-muted mt-1">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{staffMember.phone}</span>
                  </div>
                )}
                {staffMember.directorate?.name && (
                  <div className="flex items-center gap-1 text-xs text-text-muted mt-2">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      Directorate: {staffMember.directorate.name}
                    </span>
                  </div>
                )}
                {staffMember.team?.name && (
                  <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                    <Users className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      Team: {staffMember.team.name}
                    </span>
                  </div>
                )}
                {staffMember.employeeId && (
                  <p className="text-xs text-text-muted mt-2">
                    ID: {staffMember.employeeId}
                  </p>
                )}
              </div>
              <div className="flex">
                <button
                  onClick={() =>
                    onResetPassword(staffMember._id || staffMember.id)
                  }
                  className="p-1.5 text-text-muted hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                  title="Reset Password"
                >
                  <Key className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(staffMember)}
                  className="p-1.5 text-text-muted hover:text-accent hover:bg-blue-50 rounded-lg transition"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(staffMember._id || staffMember.id)}
                  className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
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
          className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200"
        >
          <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No staff found</p>
          {(searchTerm || filterPosition !== "all") && (
            <button
              onClick={clearFilters}
              className="mt-2 text-accent hover:text-blue-700 transition text-sm"
            >
              Clear all filters
            </button>
          )}
          <button
            onClick={onCreate}
            className="mt-4 text-accent hover:text-blue-700 transition block mx-auto"
          >
            + Add your first staff member
          </button>
        </motion.div>
      )}

      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-text-muted">
          Showing {filtered.length} of {staff?.length || 0} staff members
        </div>
      )}
    </div>
  );
};

export default StaffList;
