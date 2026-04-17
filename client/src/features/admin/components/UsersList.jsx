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
          <h2 className="text-2xl font-bold text-white">Users Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage registered users ({users?.length || 0} total)
          </p>
        </div>
      </div>

      {/* Search and Filter - Dropdown like original */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-50">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all" className="bg-gray-800">
            All Users
          </option>
          <option value="verified" className="bg-gray-800">
            Verified
          </option>
          <option value="unverified" className="bg-gray-800">
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
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white">{user.fullName}</div>
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
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  title="Resend verification"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300 text-xs break-all">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="text-gray-400 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
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
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-800/90 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" /> User
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Registered
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
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
                className="hover:bg-gray-700/50 transition-all duration-200"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">
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
                <td className="px-4 py-3 text-gray-300 text-sm">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs">
                      <XCircle className="w-3 h-3" /> Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {!user.emailVerified && (
                    <button
                      onClick={() => onResendVerification(user._id)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-sm transition-colors"
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
          className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700"
        >
          <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No users found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}

      {/* Results Count */}
      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-gray-500">
          Showing {filtered.length} of {users?.length || 0} users
        </div>
      )}
    </div>
  );
};

export default UsersList;
