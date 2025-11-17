import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  BarChart3,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { adminService, SystemStats } from '../services/adminService';
import { useAppSelector } from '../redux/hooks';
import { Button, Card } from '../components/ui';

const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load system statistics');
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          icon: Users,
          label: 'Total Users',
          value: stats.totalUsers,
          subtext: `${stats.totalCandidates} candidates, ${stats.totalRecruiters} recruiters`,
          color: 'from-blue-500 to-blue-600',
        },
        {
          icon: Briefcase,
          label: 'Total Jobs',
          value: stats.totalJobs,
          subtext: `${stats.activeJobs} active`,
          color: 'from-purple-500 to-purple-600',
        },
        {
          icon: FileText,
          label: 'Applications',
          value: stats.totalApplications,
          subtext: `${stats.pendingApplications} pending`,
          color: 'from-green-500 to-green-600',
        },
        {
          icon: TrendingUp,
          label: 'Interviews',
          value: stats.totalInterviews,
          subtext: `${stats.upcomingInterviews} upcoming`,
          color: 'from-orange-500 to-orange-600',
        },
      ]
    : [];

  const quickActions = [
    {
      label: 'Manage Users',
      path: '/admin/users',
      icon: Users,
      description: 'View and manage user accounts',
    },
    {
      label: 'Manage Jobs',
      path: '/admin/jobs',
      icon: Briefcase,
      description: 'Control job postings',
    },
    {
      label: 'View Applications',
      path: '/admin/applications',
      icon: FileText,
      description: 'Review all applications',
    },
    {
      label: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
      description: 'System analytics & reports',
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      description: 'System configuration',
    },
  ];

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

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access the admin dashboard. Only administrators can access this section.
          </p>
          <Button variant="primary" onClick={() => (window.location.href = '/')}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.firstName} {user.lastName}. Manage your system here.</p>
        </motion.div>

        {/* Statistics Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <Card hover animated className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                          <Icon size={24} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.subtext}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Card
                        hover
                        animated
                        className="p-6 cursor-pointer group"
                        onClick={() => (window.location.href = action.path)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
                            <Icon size={24} className="text-primary-600" />
                          </div>
                          <ArrowRight
                            size={20}
                            className="text-gray-400 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-all"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.label}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Activity Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">System Health</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Overall System Status</span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-semibold">Operational</span>
                    </span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">All systems running smoothly</p>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
