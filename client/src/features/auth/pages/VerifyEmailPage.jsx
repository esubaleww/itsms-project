// client/src/features/auth/pages/VerifyEmailPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { useToast } from "../../../components/ui/Toast";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { verifyEmail, getProfile } = useAuthStore();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        addToast("No verification token provided", "error");
        return;
      }

      try {
        // Step 1: Verify email
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");
        addToast(
          "Email verified successfully! You can now apply for programs.",
          "success",
        );

        // ✅ Step 2: Force refresh profile to get updated user
        await getProfile();

        // ✅ Step 3: Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error) {
        setStatus("error");
        const errorMsg = error.response?.data?.message || "Verification failed";
        setMessage(errorMsg);
        addToast(errorMsg, "error");
      }
    };

    verify();
  }, [token, navigate, verifyEmail, getProfile, addToast]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">ITSMS</h1>
            <p className="text-gray-500 text-sm">
              Innovation and Technology Service Management
            </p>
          </div>

          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Verifying Your Email...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Verified! 🎉</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to dashboard...
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  The verification link may have expired or is invalid.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
