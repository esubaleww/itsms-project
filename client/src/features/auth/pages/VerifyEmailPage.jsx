import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { useToast } from "../../../common/ui/Toast";

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
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");
        addToast(
          "Email verified successfully! You can now apply for programs.",
          "success",
        );

        await getProfile();

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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 font-body">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
          <div className="mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">ITS</span>
              </div>
            </div>
            <h1 className="text-2xl font-heading font-medium text-text-primary">
              ITSMS
            </h1>
            <p className="text-text-muted text-sm">
              Innovation and Technology Service Management
            </p>
          </div>

          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-heading font-medium text-text-primary mb-2">
                Verifying Your Email...
              </h2>
              <p className="text-text-muted">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-2xl font-heading font-medium text-text-primary mb-2">
                Email Verified! 🎉
              </h2>
              <p className="text-text-secondary mb-4">{message}</p>
              <p className="text-sm text-text-muted mb-6">
                Redirecting to dashboard...
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition shadow-md"
              >
                Go to Dashboard
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-heading font-medium text-text-primary mb-2">
                Verification Failed
              </h2>
              <p className="text-text-secondary mb-4">{message}</p>
              <div className="space-y-3">
                <p className="text-sm text-text-muted">
                  The verification link may have expired or is invalid.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition shadow-md"
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
