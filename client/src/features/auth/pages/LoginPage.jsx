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

const itsmsLogo =
  "https://res.cloudinary.com/dlqn1qugq/image/upload/q_auto/f_auto/v1776159724/itsms-logo_w1jyzl.jpg";

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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-start justify-center px-4 sm:px-6 lg:px-8 font-body pt-20">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-full">
              <div className="absolute inset-0 bg-linear-to-r from-blue-100/50 to-blue-200/50 rounded-2xl blur-3xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-200 h-full flex flex-col justify-center">
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent shadow-lg">
                    <img
                      src={itsmsLogo}
                      alt="ITSMS Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-text-primary text-2xl font-heading font-medium mb-3">
                  Innovation and Technology Service Management
                </h3>
                <p className="text-text-muted text-sm">
                  Streamline your IT service management with our comprehensive
                  platform
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white shadow-sm py-8 px-6 sm:px-10 rounded-2xl border border-gray-200 h-full">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4 lg:hidden">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-md">
                    <LogIn className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-heading font-medium text-text-primary mb-2">
                  Welcome Back
                </h2>
                <p className="text-text-muted text-sm">
                  Sign in to your account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-secondary mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition duration-150"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-text-secondary mb-2"
                  >
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 pl-10 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition duration-150"
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
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-accent hover:text-blue-700 transition"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-md text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
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

                <div className="text-center">
                  <p className="text-sm text-text-muted">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-accent hover:text-blue-700 transition inline-flex items-center"
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
