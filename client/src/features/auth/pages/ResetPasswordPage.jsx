import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  ArrowLeft,
  CheckCircle,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../common/ui/Toast";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword, loading, error } = useAuth();
  const { addToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      addToast("Invalid reset link. Please request a new one.", "error");
      setTimeout(() => {
        navigate("/forgot-password");
      }, 3000);
    }
  }, [token, navigate, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 8) {
      addToast("Password must be at least 8 characters", "error");
      return;
    }

    try {
      await resetPassword(token, password);
      setSubmitted(true);
      addToast("Password reset successful! You can now log in.", "success");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.message.includes("expired") || err.message.includes("Invalid")) {
        addToast("Reset link has expired. Please request a new one.", "error");
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      } else {
        addToast(err.message || "Failed to reset password", "error");
      }
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-2xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1164&q=80"
                alt="Reset password illustration"
                className="relative rounded-2xl shadow-xl object-cover w-full h-150"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-md">
                <h3 className="text-text-primary text-xl font-heading font-medium mb-2">
                  Create New Password
                </h3>
                <p className="text-text-secondary text-sm">
                  Choose a strong password to keep your account secure
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shadow-md">
                    <Lock className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h2 className="text-3xl font-heading font-medium text-text-primary mb-2">
                  Reset Password
                </h2>
                <p className="text-text-muted text-sm">
                  Enter your new password below
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-text-muted" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength="8"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-3 py-2.5 pl-10 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-text-muted text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition duration-150"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-text-muted mt-1.5">
                      Minimum 8 characters
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-text-muted" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full px-3 py-2.5 pl-10 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-text-muted text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition duration-150"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              password.length >= 8
                                ? "w-full bg-accent"
                                : "bg-yellow-500"
                            }`}
                            style={{
                              width: `${Math.min((password.length / 8) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-text-muted">
                          {password.length}/8
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        {password.length < 8
                          ? `Add ${8 - password.length} more character${8 - password.length === 1 ? "" : "s"}`
                          : "✓ Password strength: Good"}
                      </p>
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || password.length < 8}
                    className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-md text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Reset Password
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center text-sm text-accent hover:text-blue-700 transition"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-text-primary text-xl font-heading font-medium mb-2">
                      Password Reset Successfully!
                    </h3>
                    <p className="text-text-muted text-sm">
                      Your password has been updated. You can now log in with
                      your new password.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-md text-sm font-medium text-white bg-accent hover:bg-accent/90 transition duration-150"
                  >
                    Go to Sign In
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
