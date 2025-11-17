import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Settings,
  Bell,
  Lock,
  Database,
  Mail,
  Clock,
  Shield,
} from 'lucide-react';
import { useAppSelector } from '../redux/hooks';
import { Button, Card, Input } from '../components/ui';

interface SystemConfig {
  appName: string;
  maxUsersPerMonth: number;
  maxJobsPerRecruiter: number;
  interviewReminderHours: number;
  maintenanceMode: boolean;
  enableRegistration: boolean;
  enableEmailNotifications: boolean;
}

const AdminSettings: React.FC = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [config, setConfig] = useState<SystemConfig>({
    appName: 'Recruito',
    maxUsersPerMonth: 1000,
    maxJobsPerRecruiter: 50,
    interviewReminderHours: 24,
    maintenanceMode: false,
    enableRegistration: true,
    enableEmailNotifications: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'advanced'>('general');

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this section.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">System Settings</h1>
              <p className="text-gray-600">Configure system-wide settings and preferences</p>
            </div>
            <Settings size={40} className="text-primary-600" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-0 overflow-hidden">
              <div className="flex flex-col">
                {[
                  { id: 'general', label: 'General', icon: Settings },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'advanced', label: 'Advanced', icon: Database },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-3 px-6 py-4 text-left transition-all duration-300 border-l-4 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-600 hover:bg-gray-50'
                      }`}
                      whileHover={{ paddingLeft: 28 }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            className="lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="p-8">
              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Application Name</label>
                    <Input
                      value={config.appName}
                      onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                      placeholder="Application name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Users Per Month
                    </label>
                    <Input
                      type="number"
                      value={config.maxUsersPerMonth}
                      onChange={(e) => setConfig({ ...config, maxUsersPerMonth: Number(e.target.value) })}
                      placeholder="Max users"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Jobs Per Recruiter
                    </label>
                    <Input
                      type="number"
                      value={config.maxJobsPerRecruiter}
                      onChange={(e) => setConfig({ ...config, maxJobsPerRecruiter: Number(e.target.value) })}
                      placeholder="Max jobs"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="enableRegistration"
                      checked={config.enableRegistration}
                      onChange={(e) => setConfig({ ...config, enableRegistration: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="enableRegistration" className="font-medium text-gray-700 cursor-pointer">
                      Enable User Registration
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={config.maintenanceMode}
                      onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="maintenanceMode" className="font-medium text-gray-700 cursor-pointer">
                      Maintenance Mode
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="enableEmailNotifications"
                      checked={config.enableEmailNotifications}
                      onChange={(e) => setConfig({ ...config, enableEmailNotifications: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="enableEmailNotifications" className="font-medium text-gray-700 cursor-pointer">
                      Enable Email Notifications
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock size={16} className="inline mr-2" />
                      Interview Reminder Hours
                    </label>
                    <Input
                      type="number"
                      value={config.interviewReminderHours}
                      onChange={(e) => setConfig({ ...config, interviewReminderHours: Number(e.target.value) })}
                      placeholder="Hours before reminder"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Send reminder X hours before interview
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-800">
                      <Mail size={16} className="inline mr-2" />
                      Email notifications will be sent to all users based on their preferences.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
                    <p className="text-sm text-amber-800">
                      <Shield size={16} className="inline mr-2" />
                      Security settings help protect your system and user data.
                    </p>
                  </div>

                  <Card className="p-6 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Password Policy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                        <span className="text-gray-700">Minimum Password Length</span>
                        <span className="font-semibold text-gray-900">8 characters</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                        <span className="text-gray-700">Require Special Characters</span>
                        <span className="font-semibold text-green-600">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                        <span className="text-gray-700">Session Timeout</span>
                        <span className="font-semibold text-gray-900">30 minutes</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Enable 2FA for admin accounts to add an extra layer of security.
                    </p>
                    <Button variant="secondary">Configure 2FA</Button>
                  </Card>
                </motion.div>
              )}

              {/* Advanced Settings */}
              {activeTab === 'advanced' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Settings</h2>

                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                      <span className="text-gray-700">Database Optimization</span>
                      <Button variant="secondary" size="sm">Run</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                      <span className="text-gray-700">Clear Cache</span>
                      <Button variant="secondary" size="sm">Clear</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                      <span className="text-gray-700">Export System Logs</span>
                      <Button variant="secondary" size="sm">Export</Button>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-sm text-red-800 font-semibold mb-2">Danger Zone</p>
                    <p className="text-sm text-red-700 mb-4">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <Button variant="secondary">Factory Reset</Button>
                  </div>
                </motion.div>
              )}

              {/* Save Button */}
              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button variant="secondary">Cancel</Button>
                <Button
                  variant="primary"
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
