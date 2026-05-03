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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Users Management</h2>
          <p className="text-sm text-[#4b5563] mt-1">
            Manage registered users ({users?.length || 0} total)
          </p>
        </div>
      </div>

      {/* Search and Filter - Dropdown like original */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-50">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
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
        <select
          className="px-4 py-2 bg-white/60 border border-[#E5E7EB] rounded-lg text-[#0f172a] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all" className="bg-white">
            All Users
          </option>
          <option value="verified" className="bg-white">
            Verified
          </option>
          <option value="unverified" className="bg-white">
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
            className="bg-white/60 backdrop-blur-sm rounded-xl border border-[#E5E7EB] p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center">
                  <span className="text-[#0f172a] text-sm font-medium">
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-[#0f172a]">{user.fullName}</div>
                  {user.position && (
                    <div className="text-xs text-emerald-300 mt-0.5 capitalize">
                      {user.position}
                    </div>
                  )}
                </div>
              </div>
              {!user.emailVerified && (
                <button
                  onClick={() => onResendVerification(user._id)}
                  className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                  title="Resend verification"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-[#64748b]" />
                <span className="text-[#334155] text-xs break-all">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-[#64748b]" />
                <span className="text-[#4b5563] text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#2563eb]/10 text-[#2563eb] rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    <XCircle className="w-3 h-3" /> Unverified
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#E5E7EB]">
        <table className="w-full">
          <thead className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#4b5563]">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" /> User
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#4b5563]">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#4b5563]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#4b5563]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Registered
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#4b5563]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filtered?.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center">
                      <span className="text-[#0f172a] text-xs font-medium">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-[#0f172a]">
                        {user.fullName}
                      </div>
                      {user.position && (
                        <div className="text-xs text-emerald-300 mt-0.5 capitalize">
                          {user.position}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#334155] text-sm">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30 rounded-full text-xs">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs">
                      <XCircle className="w-3 h-3" /> Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#4b5563] text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {!user.emailVerified && (
                    <button
                      onClick={() => onResendVerification(user._id)}
                      className="text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1 text-sm transition-colors"
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
          className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E5E7EB]"
        >
          <UsersIcon className="w-12 h-12 text-[#64748b] mx-auto mb-3" />
          <p className="text-[#4b5563]">No users found</p>
          <p className="text-sm text-[#64748b] mt-1">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}

      {/* Results Count */}
      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-[#64748b]">
          Showing {filtered.length} of {users?.length || 0} users
        </div>
      )}
    </div>
  );
};

export default UsersList;
