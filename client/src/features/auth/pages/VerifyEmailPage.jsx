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
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 text-center border border-[#E5E7EB]">
          <div className="mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-[#2563eb] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">ITS</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#111827]">ITSMS</h1>
            <p className="text-[#6b7280] text-sm">
              Innovation and Technology Service Management
            </p>
          </div>

          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-[#2563eb] animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#111827] mb-2">
                Verifying Your Email...
              </h2>
              <p className="text-[#6b7280]">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-[#2563eb]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">
                Email Verified! 🎉
              </h2>
              <p className="text-[#374151] mb-4">{message}</p>
              <p className="text-sm text-slate-500 mb-6">
                Redirecting to dashboard...
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-[#2563eb] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition"
              >
                Go to Dashboard
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">
                Verification Failed
              </h2>
              <p className="text-[#374151] mb-4">{message}</p>
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  The verification link may have expired or is invalid.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-[#2563eb] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition"
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
