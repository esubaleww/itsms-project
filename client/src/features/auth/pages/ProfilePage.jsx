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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const getUserTypeDisplay = () => {
    if (user?.role === "admin")
      return {
        label: "Administrator",
        color: "bg-purple-50 text-purple-600",
        icon: Award,
      };
    if (user?.role === "staff") {
      if (user?.position === "director")
        return {
          label: "Director",
          color: "bg-blue-50 text-blue-600",
          icon: Briefcase,
        };
      if (user?.position === "team_lead")
        return {
          label: "Team Lead",
          color: "bg-green-50 text-green-600",
          icon: UsersIcon,
        };
      return {
        label: "Staff",
        color: "bg-gray-100 text-text-muted",
        icon: User,
      };
    }
    if (user?.role === "intern")
      return {
        label: "Intern",
        color: "bg-cyan-50 text-cyan-600",
        icon: GraduationCap,
      };
    if (user?.role === "innovator")
      return {
        label: "Innovator",
        color: "bg-orange-50 text-orange-600",
        icon: Award,
      };
    if (user?.role === "startup")
      return {
        label: "Startup",
        color: "bg-amber-50 text-amber-600",
        icon: Award,
      };
    return {
      label: "User",
      color: "bg-gray-100 text-text-muted",
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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-8 font-body">
      <div className="max-w-md mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="h-24 bg-accent"></div>

          <div className="relative px-6 pb-6">
            <div className="relative -mt-12 mb-4">
              <div className="w-24 h-24 bg-white rounded-full p-1 mx-auto border-2 border-accent shadow-md">
                <div className="w-full h-full bg-accent rounded-full flex items-center justify-center">
                  <span className="text-3xl font-heading font-medium text-white">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-heading font-medium text-text-primary">
                {user?.fullName}
              </h2>
              <div className="flex items-center justify-center gap-1 mt-1">
                <UserTypeIcon className="w-4 h-4 text-text-muted" />
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${userType.color}`}
                >
                  {userType.label}
                </span>
              </div>
              {user?.emailVerified && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-accent">
                  <CheckCircle className="w-3 h-3" />
                  <span>Email Verified</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Mail className="w-4 h-4 text-text-muted" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Phone className="w-4 h-4 text-text-muted" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user?.location && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span>{user.location}</span>
                </div>
              )}
              {user?.department && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Briefcase className="w-4 h-4 text-text-muted" />
                  <span>{user.department}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span>Member since {memberSince}</span>
              </div>
              {user?.bio && (
                <div className="border-t border-gray-200 mt-2 pt-3">
                  <p className="text-xs text-text-muted mb-1">Bio</p>
                  <p className="text-sm text-text-secondary">{user.bio}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full border border-gray-300 text-text-secondary py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Change Password
              </button>

              <button
                onClick={handleLogout}
                className="w-full border border-red-200 text-red-500 py-2 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </motion.div>

        {showChangePassword && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-lg border border-gray-200"
            >
              <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                <h2 className="text-xl font-heading font-medium text-text-primary">
                  Change Password
                </h2>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent pr-10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
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
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent pr-10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Minimum 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent pr-10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-text-secondary"
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
                    className="flex-1 bg-accent text-white py-2 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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
