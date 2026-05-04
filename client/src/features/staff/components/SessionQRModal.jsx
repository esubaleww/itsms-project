import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Download, QrCode, Copy, Check } from "lucide-react";
import { generateSessionQR } from "../../../utils/qrUtils";

const SessionQRModal = ({ session, onClose }) => {
  const [qrCode, setQrCode] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      const qr = await generateSessionQR(session._id, session);
      setQrCode(qr);
    };
    generateQR();
  }, [session]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `session_${session.title.replace(/\s/g, "_")}.png`;
    link.href = qrCode;
    link.click();
  };

  const handleCopyLink = () => {
    const qrLink = `${window.location.origin}/attendance/scan/${session._id}`;
    navigator.clipboard.writeText(qrLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Session QR Code</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="bg-white rounded-xl p-4 inline-block mx-auto mb-4">
            {qrCode ? (
              <img src={qrCode} alt="Session QR Code" className="w-64 h-64" />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="text-white font-semibold">{session.title}</h3>
            <p className="text-sm text-gray-400">
              Date: {new Date(session.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400">
              Duration: {session.duration} hours
            </p>
            {session.location && (
              <p className="text-sm text-gray-400">
                Location: {session.location}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <Download className="w-4 h-4" />
              Download QR
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Share the link or QR code with trainees to mark attendance
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionQRModal;
