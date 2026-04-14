// client/src/features/admin/pages/SystemSettingsPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../hooks/useAdmin";
import { useToast } from "../../../components/ui/Toast";
import { motion } from "framer-motion";
import { ChevronLeft, Settings } from "lucide-react";
import SystemSettings from "../components/SystemSettings";

const SystemSettingsPage = () => {
  const navigate = useNavigate();
  const { systemSettings, updateSettings, loading } = useAdmin();
  const { addToast } = useToast();

  const handleUpdateSettings = async (data) => {
    try {
      await updateSettings(data);
      addToast("Settings saved successfully!", "success");
    } catch (error) {
      addToast(error.message || "Failed to save settings", "error");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">System Settings</h1>
              <p className="text-sm text-gray-400">
                Configure system-wide preferences and security settings
              </p>
            </div>
          </div>

          <SystemSettings
            settings={systemSettings}
            onUpdate={handleUpdateSettings}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
