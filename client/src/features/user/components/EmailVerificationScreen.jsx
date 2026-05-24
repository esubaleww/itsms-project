import { motion } from "framer-motion";
import { Mail, Send, RefreshCw, Settings, LogOut } from "lucide-react";
import NotificationBell from "../../../common/components/NotificationBell";

const EmailVerificationScreen = ({
  user,
  onRefresh,
  onResend,
  refreshing,
  isVerifying,
  onNavigate,
  onLogout,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-text-primary">
              Dashboard
            </h1>
            <p className="text-text-muted text-sm">
              {getGreeting()}, {user?.fullName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-5 h-5 text-text-muted ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
            <NotificationBell />
            <button
              onClick={() => onNavigate("/profile")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-text-muted" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 rounded-2xl p-8 border border-yellow-500/30"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-10 h-10 text-yellow-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-heading font-semibold text-yellow-700 mb-2">
                Verify Your Email Address
              </h2>
              <p className="text-text-secondary mb-2">
                Please verify your email address to access all features and
                apply for programs.
              </p>
              <p className="text-sm text-text-muted">
                We've sent a verification link to{" "}
                <strong className="text-yellow-600">{user?.email}</strong>
              </p>
            </div>
            <button
              onClick={onResend}
              disabled={isVerifying}
              className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isVerifying ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Resend Verification Email
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;
