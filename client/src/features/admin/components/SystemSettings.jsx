// client/src/features/admin/components/SystemSettings.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  RefreshCw,
  Globe,
  Mail,
  FileText,
  Lock,
  Shield,
  Database,
  AlertCircle,
  CheckCircle,
  Upload,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

const SystemSettings = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    siteName: settings?.siteName || "ITSMS",
    siteEmail: settings?.siteEmail || "admin@itsms.gov.et",
    maxFileSize: settings?.maxFileSize || 10,
    allowedFileTypes:
      settings?.allowedFileTypes || ".pdf,.doc,.docx,.jpg,.png,.xlsx",
    sessionTimeout: settings?.sessionTimeout || 60,
    enableEmailVerification: settings?.enableEmailVerification !== false,
    enableNotifications: settings?.enableNotifications !== false,
    maintenanceMode: settings?.maintenanceMode || false,
    twoFactorAuth: settings?.twoFactorAuth || false,
    backupEnabled: settings?.backupEnabled || true,
    logRetentionDays: settings?.logRetentionDays || 90,
  });
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onUpdate(formData);
    setSaving(false);
  };

  const settingsSections = [
    {
      title: "General Settings",
      icon: Globe,
      color: "from-emerald-500 to-teal-700",
      fields: [
        {
          label: "Site Name",
          name: "siteName",
          type: "text",
          placeholder: "System Name",
          help: "This name appears throughout the system",
        },
        {
          label: "Support Email",
          name: "siteEmail",
          type: "email",
          placeholder: "admin@example.com",
          help: "System notifications will be sent from this email",
        },
      ],
    },
    {
      title: "File Upload Settings",
      icon: Upload,
      color: "from-blue-500 to-cyan-700",
      fields: [
        {
          label: "Max File Size (MB)",
          name: "maxFileSize",
          type: "number",
          placeholder: "10",
          help: "Maximum allowed file size for uploads",
        },
        {
          label: "Allowed File Types",
          name: "allowedFileTypes",
          type: "text",
          placeholder: ".pdf,.doc,.jpg",
          help: "Comma-separated list of allowed file extensions",
        },
      ],
    },
    {
      title: "Security Settings",
      icon: Shield,
      color: "from-purple-500 to-indigo-700",
      fields: [
        {
          label: "Session Timeout (minutes)",
          name: "sessionTimeout",
          type: "number",
          placeholder: "60",
          help: "User session will expire after this many minutes of inactivity",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-gray-400 text-sm mt-1">
            Configure system-wide preferences and security settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Settings Sections */}
        {settingsSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className={`bg-linear-to-r ${section.color} px-6 py-4`}>
              <div className="flex items-center gap-3">
                <section.icon className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold text-white">
                  {section.title}
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {section.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.name]:
                          field.type === "number"
                            ? parseInt(e.target.value)
                            : e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder={field.placeholder}
                  />
                  {field.help && (
                    <p className="text-xs text-gray-500 mt-1">{field.help}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Toggle Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
        >
          <div className="bg-linear-to-r from-orange-500 to-red-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">
                Security & Features
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white font-medium">
                  Require Email Verification
                </p>
                <p className="text-xs text-gray-400">
                  Users must verify email before accessing system
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableEmailVerification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enableEmailVerification: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-gray-700">
              <div>
                <p className="text-white font-medium">Enable Notifications</p>
                <p className="text-xs text-gray-400">
                  Send system notifications to users
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableNotifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enableNotifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-gray-700">
              <div>
                <p className="text-white font-medium">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-400">
                  Require 2FA for admin accounts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.twoFactorAuth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      twoFactorAuth: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-gray-700">
              <div>
                <p className="text-white font-medium">Enable Auto Backup</p>
                <p className="text-xs text-gray-400">
                  Automatically backup database daily
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.backupEnabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      backupEnabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-gray-700">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-xs text-gray-400">
                  Put the system in maintenance mode
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Data Retention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
        >
          <div className="bg-linear-to-r from-cyan-500 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">
                Data Management
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Log Retention (days)
              </label>
              <input
                type="number"
                name="logRetentionDays"
                value={formData.logRetentionDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    logRetentionDays: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="90"
              />
              <p className="text-xs text-gray-500 mt-1">
                System logs older than this will be automatically deleted
              </p>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-linear-to-r from-emerald-500 to-teal-700 text-white px-6 py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 shadow-lg"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
