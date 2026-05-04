import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../common/ui/Toast";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Lock,
  LogOut,
  ChevronLeft,
  CheckCircle,
  Award,
  GraduationCap,
  Users as UsersIcon,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, changePassword, logout, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("New passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      addToast("Password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      addToast("Password changed successfully!", "success");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      addToast(error.message || "Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Get user type display
  const getUserTypeDisplay = () => {
    if (user?.role === "admin")
      return {
        label: "Administrator",
        color: "bg-purple-500/20 text-purple-400",
        icon: Award,
      };
    if (user?.role === "staff") {
      if (user?.position === "director")
        return {
          label: "Director",
          color: "bg-blue-500/20 text-blue-400",
          icon: Briefcase,
        };
      if (user?.position === "team_lead")
        return {
          label: "Team Lead",
          color: "bg-green-500/20 text-green-400",
          icon: UsersIcon,
        };
      return {
        label: "Staff",
        color: "bg-slate-500/20 text-slate-400",
        icon: User,
      };
    }
    if (user?.role === "intern")
      return {
        label: "Intern",
        color: "bg-cyan-500/20 text-cyan-400",
        icon: GraduationCap,
      };
    if (user?.role === "innovator")
      return {
        label: "Innovator",
        color: "bg-orange-500/20 text-orange-400",
        icon: Award,
      };
    if (user?.role === "startup")
      return {
        label: "Startup",
        color: "bg-amber-500/20 text-amber-400",
        icon: Award,
      };
    return {
      label: "User",
      color: "bg-slate-500/20 text-slate-400",
      icon: User,
    };
  };

  const userType = getUserTypeDisplay();
  const UserTypeIcon = userType.icon;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        {/* Profile Card - Left Column Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden"
        >
          {/* Cover Photo */}
          <div className="h-24 bg-linear-to-r from-emerald-500 to-teal-600"></div>

          {/* Avatar */}
          <div className="relative px-6 pb-6">
            <div className="relative -mt-12 mb-4">
              <div className="w-24 h-24 bg-slate-800 rounded-full p-1 mx-auto border-2 border-emerald-500">
                <div className="w-full h-full bg-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
              <div className="flex items-center justify-center gap-1 mt-1">
                <UserTypeIcon className="w-4 h-4" />
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${userType.color}`}
                >
                  {userType.label}
                </span>
              </div>
              {user?.emailVerified && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>Email Verified</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-700 mt-4 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user?.location && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{user.location}</span>
                </div>
              )}
              {user?.department && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>{user.department}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Member since {memberSince}</span>
              </div>
              {user?.bio && (
                <div className="border-t border-slate-700 mt-2 pt-3">
                  <p className="text-xs text-slate-400 mb-1">Bio</p>
                  <p className="text-sm text-slate-300">{user.bio}</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-700 mt-4 pt-4 space-y-2">
              {/* Change Password Button - KEPT */}
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full border border-slate-600 text-slate-300 py-2 rounded-lg hover:bg-slate-700 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Change Password
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full border border-red-500/30 text-red-400 py-2 rounded-lg hover:bg-red-500/10 transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Change Password Modal - KEPT */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700"
            >
              <div className="border-b border-slate-700 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Change Password
                </h2>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="p-1 hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Minimum 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      authLoading ||
                      passwordData.newPassword.length < 8
                    }
                    className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 text-white py-2 rounded-lg hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
