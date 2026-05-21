import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../common/ui/Toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
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
      const response = await register(formData);

      addToast(
        "Registration successful! Please check your email to verify your account before logging in.",
        "success",
        5000,
      );

      navigate("/dashboard");
    } catch (err) {
      addToast(err.message || "Registration failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-start justify-center pt-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#DBEAFE]/50 to-[#BFDBFE]/50 rounded-2xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Team collaboration"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-150"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-[#E5E7EB] shadow-2xl">
                <h3 className="text-[#111827] text-xl font-bold mb-2">
                  Join Innovation Bureau
                </h3>
                <p className="text-[#6b7280] text-sm font-medium">
                  Start your journey with us and explore a world of
                  opportunities
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
            <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-[#E5E7EB]">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[#2563eb] rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-[#0f172a]" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-[#0f172a] mb-2">
                  Create Account
                </h2>
                <p className="text-[#4b5563] text-sm">
                  Join ITSMS in seconds. Choose your path after login.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-[#374151] mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#6b7280]" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 pl-10 bg-white border border-[#D1D5DB] rounded-lg shadow-sm placeholder-gray-400 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent sm:text-sm transition duration-150"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#374151] mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#6b7280]" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 pl-10 bg-white border border-[#D1D5DB] rounded-lg shadow-sm placeholder-gray-400 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent sm:text-sm transition duration-150"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#374151] mb-2"
                  >
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#6b7280]" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength="6"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 pl-10 pr-10 bg-white border border-[#D1D5DB] rounded-lg shadow-sm placeholder-gray-400 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent sm:text-sm transition duration-150"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6b7280] hover:text-[#374151]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Minimum 8 characters
                  </p>
                </div>

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
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create account
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-[#6b7280]">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-[#2563eb] hover:text-[#1d4ed8] transition inline-flex items-center"
                    >
                      Sign in
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </p>
                </div>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 bg-[#EEF2FF] border border-[#2563eb]/20 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#1d4ed8]">
                    📧 After registration, you will receive a verification
                    email. Please check your inbox and click the link to verify
                    your email address before logging in.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
