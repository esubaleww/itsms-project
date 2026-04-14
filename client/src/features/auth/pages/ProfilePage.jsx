import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../components/ui/Toast";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Lock,
  LogOut,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Award,
  GraduationCap,
  Users as UsersIcon,
  Eye,
  EyeOff,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    user,
    updateProfile,
    changePassword,
    logout,
    getProfile,
    loading: authLoading,
  } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
    location: "",
    department: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
        department: user.department || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      addToast("Profile updated successfully!", "success");
      setIsEditing(false);
      await getProfile(); // Refresh user data
    } catch (error) {
      addToast(error.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
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
      // Reset visibility toggles
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
        color: "bg-gray-500/20 text-gray-400",
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
    return { label: "User", color: "bg-gray-500/20 text-gray-400", icon: User };
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
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden sticky top-8"
            >
              {/* Cover Photo */}
              <div className="h-24 bg-linear-to-r from-emerald-500 to-teal-700"></div>

              {/* Avatar */}
              <div className="relative px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 bg-gray-800 rounded-full p-1 mx-auto border-2 border-emerald-500">
                    <div className="w-full h-full bg-linear-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-1/3 bg-gray-700 rounded-full p-1.5 shadow-md hover:bg-gray-600 transition">
                    <Camera className="w-4 h-4 text-gray-300" />
                  </button>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">
                    {user?.fullName}
                  </h2>
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

                <div className="border-t border-gray-700 mt-4 pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-4 pt-4 space-y-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Edit Profile
                  </button>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full border border-gray-600 text-gray-300 py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full border border-red-500/30 text-red-400 py-2 rounded-lg hover:bg-red-500/10 transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Modal */}
            {isEditing && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700"
                >
                  <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                      Edit Profile
                    </h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-1 hover:bg-gray-700 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <form
                    onSubmit={handleUpdateProfile}
                    className="p-6 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Bio / About
                      </label>
                      <textarea
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || authLoading}
                        className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2 rounded-lg hover:from-emerald-600 hover:to-teal-800 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Change Password Modal */}
            {showChangePassword && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700"
                >
                  <div className="border-b border-gray-700 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                      Change Password
                    </h2>
                    <button
                      onClick={() => setShowChangePassword(false)}
                      className="p-1 hover:bg-gray-700 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <form
                    onSubmit={handleChangePassword}
                    className="p-6 space-y-4"
                  >
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
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
                      <label className="block text-sm font-medium text-gray-300 mb-1">
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
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 8 characters
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {passwordData.newPassword.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordData.newPassword.length >= 8
                                  ? "w-full bg-emerald-500"
                                  : "bg-yellow-500"
                              }`}
                              style={{
                                width: `${Math.min((passwordData.newPassword.length / 8) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {passwordData.newPassword.length}/8
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {passwordData.newPassword.length < 8
                            ? `Add ${8 - passwordData.newPassword.length} more character${8 - passwordData.newPassword.length === 1 ? "" : "s"}`
                            : "✓ Password strength: Good"}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowChangePassword(false)}
                        className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition text-gray-300"
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
                        className="flex-1 bg-linear-to-r from-emerald-500 to-teal-700 text-white py-2 rounded-lg hover:from-emerald-600 hover:to-teal-800 disabled:opacity-50 flex items-center justify-center gap-2"
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

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                About Me
              </h3>
              <p className="text-gray-300">
                {user?.bio ||
                  "No bio added yet. Click 'Edit Profile' to tell us about yourself."}
              </p>
            </motion.div>

            {/* Account Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Account Security
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div>
                    <p className="font-medium text-white">Email Verification</p>
                    <p className="text-sm text-gray-400">
                      Verify your email address
                    </p>
                  </div>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${user?.emailVerified ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}
                  >
                    {user?.emailVerified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-400">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button className="text-sm text-emerald-400 hover:text-emerald-300">
                    Enable
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Danger Zone
              </h3>
              <p className="text-sm text-red-300/70 mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <button className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition">
                Delete Account
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
