import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../common/ui/Toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData.email, formData.password);
      addToast(`Welcome back, ${response.user.fullName}!`, "success");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      addToast(errorMessage, "error");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Team collaboration"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-150"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-slate-900/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <h3 className="text-white text-xl font-bold mb-2">
                  Innovation and Technology Service Management
                </h3>
                <p className="text-slate-300 text-sm">
                  Streamline your IT service management with our comprehensive
                  platform
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-slate-700">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <LogIn className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-slate-400 text-sm">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 pl-10 bg-slate-700 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:text-sm transition duration-150"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 pl-10 pr-10 bg-slate-700 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:text-sm transition duration-150"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign in
                    </>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-emerald-400 hover:text-emerald-300 transition inline-flex items-center"
                    >
                      Sign up
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
