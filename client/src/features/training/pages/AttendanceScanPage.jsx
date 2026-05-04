import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTrainee } from "../../../hooks/useTrainee";

const AttendanceScanPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { markAttendance, loading } = useTrainee();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const recordAttendance = async () => {
      try {
        await markAttendance(sessionId);
        setStatus("success");
        setMessage("✅ Attendance recorded successfully!");
        setTimeout(() => navigate("/dashboard?tab=my-sessions"), 2000);
      } catch (error) {
        let userMessage = error.message || "Failed to record attendance";

        if (
          userMessage.includes("hasn't started") ||
          userMessage.includes("starts on")
        ) {
          userMessage = "⏰ " + userMessage;
        } else if (userMessage.includes("expired")) {
          userMessage = "⌛ " + userMessage;
        } else if (
          userMessage.includes("already marked") ||
          userMessage.includes("already recorded")
        ) {
          userMessage = "✅ " + userMessage;
        } else if (userMessage.includes("not found")) {
          userMessage = "❌ Session not found. Please check the QR code.";
        } else if (userMessage.includes("not assigned")) {
          userMessage = "🔒 You are not assigned to this session.";
        } else if (userMessage.includes("500")) {
          userMessage = "⚠️ Server error. Please try again later.";
        }

        setStatus("error");
        setMessage(userMessage);
        setTimeout(() => navigate("/dashboard?tab=my-sessions"), 4000);
      }
    };

    if (sessionId) {
      recordAttendance();
    }
  }, [sessionId, markAttendance, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/60 rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Recording Attendance...
            </h2>
            <p className="text-gray-400">
              Please wait while we record your attendance
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Attendance Recorded!
            </h2>
            <p className="text-emerald-400 text-sm">{message}</p>
            <p className="text-gray-500 text-xs mt-4">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Cannot Mark Attendance
            </h2>
            <p className="text-red-400 text-sm">{message}</p>
            <button
              onClick={() => navigate("/dashboard?tab=my-sessions")}
              className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceScanPage;
