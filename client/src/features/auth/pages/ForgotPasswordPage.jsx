import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send, Loader, CheckCircle } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../common/ui/Toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading, error, clearError } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSubmitted(true);
      addToast(
        "Password reset email sent! Please check your inbox.",
        "success",
        5000,
      );
    } catch (err) {
      addToast(err.message || "Failed to send reset email", "error");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-start justify-center pt-14 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-100/50 to-blue-200/50 rounded-2xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
                alt="Password reset illustration"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-150"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-2xl">
                <h3 className="text-text-primary text-xl font-heading font-medium mb-2">
                  Forgot Your Password?
                </h3>
                <p className="text-text-muted text-sm font-medium">
                  Don't worry! We'll help you reset it and get back to your
                  account.
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
            <div className="bg-white shadow-sm py-8 px-6 sm:px-10 rounded-2xl border border-gray-200">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-md">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-heading font-medium text-text-primary mb-2">
                  Reset Password
                </h2>
                <p className="text-text-muted text-sm">
                  Enter your email address and we'll send you a link to reset
                  your password
                </p>
              </div>

              {!submitted ? (
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
                        value={email}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-text-muted text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition duration-150"
                        placeholder="you@example.com"
                      />
                    </div>
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
                    className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-md text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Reset Link
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
                      Check Your Email
                    </h3>
                    <p className="text-text-muted text-sm">
                      We've sent a password reset link to:
                    </p>
                    <p className="text-accent font-medium mt-1">{email}</p>
                  </div>
                  <div className="bg-blue-50 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm text-text-secondary">
                      📧 The reset link will expire in 1 hour. If you don't see
                      the email, please check your spam folder.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-text-secondary hover:bg-gray-50 bg-white transition duration-150"
                  >
                    Return to Sign In
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

export default ForgotPasswordPage;
