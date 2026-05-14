import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Users as UsersIcon,
  X,
} from "lucide-react";

const UsersList = ({ users, onResendVerification, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = users?.filter((u) => {
    if (filterStatus !== "all") {
      if (filterStatus === "verified" && !u.emailVerified) return false;
      if (filterStatus === "unverified" && u.emailVerified) return false;
    }
    if (
      searchTerm &&
      !u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading && !users) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Users Management</h2>
          <p className="text-sm text-[#6b7280] mt-1">
            Manage registered users ({users?.length || 0} total)
          </p>
        </div>
      </div>

      {/* Search and Filter - Dropdown like original */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-50">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all" className="bg-white text-[#111827]">
            All Users
          </option>
          <option value="verified" className="bg-white text-[#111827]">
            Verified
          </option>
          <option value="unverified" className="bg-white text-[#111827]">
            Unverified
          </option>
        </select>
      </div>

      {/* Mobile Card View (visible on mobile) */}
      <div className="sm:hidden space-y-3">
        {filtered?.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-full flex items-center justify-center border border-[#2563eb]/20">
                  <span className="text-[#2563eb] text-sm font-bold">
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-[#111827]">{user.fullName}</div>
                  {user.position && (
                    <div className="text-xs text-[#2563eb] mt-0.5 capitalize font-medium">
                      {user.position}
                    </div>
                  )}
                </div>
              </div>
              {!user.emailVerified && (
                <button
                  onClick={() => onResendVerification(user._id)}
                  className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors p-1"
                  title="Resend verification"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm mt-3 pt-3 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6b7280]" />
                <span className="text-[#374151] text-xs break-all">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6b7280]" />
                <span className="text-[#6b7280] text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/20 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-medium">
                    <XCircle className="w-3 h-3" /> Unverified
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden sm:block overflow-x-auto rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E7EB] bg-white">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280] uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" /> User
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280] uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Email
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280] uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Registered
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filtered?.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="hover:bg-[#F9FAFB] transition-all duration-200"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-[#2563eb] text-sm font-bold">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-[#111827]">
                        {user.fullName}
                      </div>
                      {user.position && (
                        <div className="text-xs text-[#2563eb] mt-0.5 capitalize font-medium">
                          {user.position}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-[#374151] text-sm">
                  {user.email}
                </td>
                <td className="px-4 py-4">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EEF2FF] text-[#2563eb] border border-[#2563eb]/20 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-[#6b7280] text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  {!user.emailVerified && (
                    <button
                      onClick={() => onResendVerification(user._id)}
                      className="text-[#2563eb] hover:text-[#1d4ed8] hover:bg-[#EEF2FF] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm transition-colors font-medium border border-transparent hover:border-[#2563eb]/20"
                    >
                      <Mail className="w-4 h-4" /> Resend
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filtered?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB]"
        >
          <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-[#9ca3af]" />
          </div>
          <p className="text-[#111827] font-medium text-lg">No users found</p>
          <p className="text-sm text-[#6b7280] mt-1">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}

      {/* Results Count */}
      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-[#6b7280] font-medium">
          Showing <span className="text-[#111827]">{filtered.length}</span> of <span className="text-[#111827]">{users?.length || 0}</span> users
        </div>
      )}
    </div>
  );
};

export default UsersList;
