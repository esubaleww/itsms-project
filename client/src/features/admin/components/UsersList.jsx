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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-heading font-medium text-text-primary">
            Users Management
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Manage registered users ({users?.length || 0} total)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-50">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all" className="bg-white text-text-primary">
            All Users
          </option>
          <option value="verified" className="bg-white text-text-primary">
            Verified
          </option>
          <option value="unverified" className="bg-white text-text-primary">
            Unverified
          </option>
        </select>
      </div>

      <div className="sm:hidden space-y-3">
        {filtered?.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-accent/20">
                  <span className="text-accent text-sm font-bold">
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-text-primary">
                    {user.fullName}
                  </div>
                  {user.position && (
                    <div className="text-xs text-accent mt-0.5 capitalize font-medium">
                      {user.position}
                    </div>
                  )}
                </div>
              </div>
              {!user.emailVerified && (
                <button
                  onClick={() => onResendVerification(user._id)}
                  className="text-accent hover:text-blue-700 transition-colors p-1"
                  title="Resend verification"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary text-xs break-all">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span className="text-text-muted text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-accent border border-accent/20 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-600 border border-yellow-500/30 rounded-full text-xs font-medium">
                    <XCircle className="w-3 h-3" /> Unverified
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" /> User
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Email
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Registered
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered?.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 border border-accent/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-accent text-sm font-bold">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        {user.fullName}
                      </div>
                      {user.position && (
                        <div className="text-xs text-accent mt-0.5 capitalize font-medium">
                          {user.position}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-text-secondary text-sm">
                  {user.email}
                </td>
                <td className="px-4 py-4">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-accent border border-accent/20 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-600 border border-yellow-500/30 rounded-full text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-text-muted text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  {!user.emailVerified && (
                    <button
                      onClick={() => onResendVerification(user._id)}
                      className="text-accent hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm transition-colors font-medium border border-transparent hover:border-accent/20"
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

      {filtered?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white shadow-sm rounded-xl border border-gray-200"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-primary font-medium text-lg">
            No users found
          </p>
          <p className="text-sm text-text-muted mt-1">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}

      {filtered?.length > 0 && (
        <div className="mt-4 text-right text-sm text-text-muted font-medium">
          Showing <span className="text-text-primary">{filtered.length}</span>{" "}
          of <span className="text-text-primary">{users?.length || 0}</span>{" "}
          users
        </div>
      )}
    </div>
  );
};

export default UsersList;
