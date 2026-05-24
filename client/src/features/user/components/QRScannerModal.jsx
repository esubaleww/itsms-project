import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X, Camera, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTrainee } from "../../../hooks/useTrainee";

const QRScannerModal = ({ onClose, onSuccess }) => {
  const { markAttendance } = useTrainee();
  const [status, setStatus] = useState("scanning");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          showTorchButtonIfSupported: true,
        },
        false,
      );

      scanner.render(
        async (decodedText) => {
          if (status !== "scanning") return;

          setStatus("processing");
          scanner.clear();

          try {
            let sessionId;
            try {
              const qrData = JSON.parse(decodedText);
              sessionId = qrData.sessionId;
            } catch {
              sessionId = decodedText;
            }

            await markAttendance(sessionId);
            setStatus("success");

            setTimeout(() => {
              if (onSuccess) onSuccess();
              onClose();
            }, 1500);
          } catch (error) {
            let userMessage = error.message || "Failed to mark attendance";

            if (
              userMessage.includes("hasn't started") ||
              userMessage.includes("starts on")
            ) {
              userMessage = "⏰ " + userMessage;
            } else if (userMessage.includes("expired")) {
              userMessage = "⌛ " + userMessage;
            } else if (userMessage.includes("already")) {
              userMessage = "✅ " + userMessage;
            } else if (userMessage.includes("not found")) {
              userMessage =
                "❌ Session not found. Please check the QR code and try again.";
            } else if (userMessage.includes("not assigned")) {
              userMessage = "🔒 You are not assigned to this session.";
            }

            setStatus("error");
            setErrorMessage(userMessage);
            setTimeout(() => {
              setStatus("scanning");
              setErrorMessage("");
              scanner.render();
            }, 3000);
          }
        },
        (error) => {
          console.error("QR Scan error:", error);
        },
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        #qr-reader {
          border: none !important;
          border-radius: 1rem !important;
          overflow: hidden !important;
        }
        #qr-reader video {
          border-radius: 1rem !important;
        }
        #qr-reader__dashboard_section {
          background: #F9FAFB !important;
          padding: 1rem !important;
          border-radius: 0.75rem !important;
          border: 1px solid #E5E7EB !important;
          margin-top: 1rem !important;
        }
        #qr-reader__dashboard_section button {
          background: #2563eb !important;
          color: white !important;
          border: none !important;
          border-radius: 0.5rem !important;
          padding: 0.6rem 1.2rem !important;
          font-size: 0.875rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.1) !important;
        }
        #qr-reader__dashboard_section button:hover {
          background: #1d4ed8 !important;
          transform: translateY(-1px) !important;
        }
        #qr-reader__dashboard_section label {
          background: white !important;
          color: #374151 !important;
          border: 1px solid #D1D5DB !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.875rem !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        #qr-reader__dashboard_section label:hover {
          border-color: #2563eb !important;
          color: #2563eb !important;
        }
        #qr-reader__dashboard_section span,
        #qr-reader__dashboard_section div {
          color: #4B5563 !important;
        }
        #qr-reader__dashboard_section select {
          background: white !important;
          color: #111827 !important;
          border: 1px solid #D1D5DB !important;
          border-radius: 0.5rem !important;
          padding: 0.4rem 0.8rem !important;
          font-size: 0.875rem !important;
          outline: none !important;
        }
        #qr-reader__dashboard_section select:focus {
          border-color: #2563eb !important;
          ring: 2px solid #2563eb !important;
        }
        #qr-reader__dashboard_section_fps span {
          color: #9ca3af !important;
          font-size: 0.75rem !important;
        }
        #qr-reader__scan_region img {
          opacity: 0.6 !important;
          filter: grayscale(100%) !important;
        }
      `}</style>

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-md border border-gray-200">
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-heading font-medium text-text-primary">
                Scan QR Code
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
            </button>
          </div>

          <div className="p-6">
            {status === "scanning" && (
              <>
                <div id="qr-reader" className="w-full"></div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 text-center">
                    Position the QR code within the frame to mark attendance
                  </p>
                </div>
              </>
            )}

            {status === "processing" && (
              <div className="text-center py-12">
                <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto mb-4" />
                <h3 className="text-text-primary font-heading font-medium mb-2">
                  Processing...
                </h3>
                <p className="text-text-muted text-sm">
                  Recording your attendance
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="text-text-primary font-heading font-medium mb-2">
                  Attendance Recorded!
                </h3>
                <p className="text-text-muted text-sm">
                  Your attendance has been successfully recorded
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-text-primary font-heading font-medium mb-2">
                  Cannot Mark Attendance
                </h3>
                <p className="text-red-600 text-sm">{errorMessage}</p>
                <button
                  onClick={() => {
                    setStatus("scanning");
                    setErrorMessage("");
                    window.location.reload();
                  }}
                  className="btn-filled mt-4 px-4 py-2"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QRScannerModal;
