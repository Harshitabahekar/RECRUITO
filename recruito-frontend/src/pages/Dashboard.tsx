import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  Users,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { jobService, Job, JobCreateRequest } from '../services/jobService';
import { useAppSelector } from '../redux/hooks';
import { Button, Card, Input, Badge, Alert } from '../components/ui';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<JobCreateRequest>({
    title: '',
    description: '',
    location: '',
    department: '',
    employmentType: '',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobService.getMyJobs(0, 100);
      setJobs(data.content);
    } catch (error) {
      toast.error('Failed to load jobs');
      console.error('Failed to load jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Creating job...');

    try {
      await jobService.createJob(formData);
      toast.dismiss(loadingToast);
      toast.success('Job created successfully!');
      setOpenDialog(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        department: '',
        employmentType: '',
      });
      setError('');
      loadJobs();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMsg = error.response?.data?.error || 'Failed to create job';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    const loadingToast = toast.loading('Publishing job...');
    try {
      await jobService.publishJob(id);
      toast.dismiss(loadingToast);
      toast.success('Job published successfully!');
      loadJobs();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || 'Failed to publish job');
    }
  };

  const handleClose = async (id: string) => {
    const loadingToast = toast.loading('Closing job...');
    try {
      await jobService.closeJob(id);
      toast.dismiss(loadingToast);
      toast.success('Job closed successfully!');
      loadJobs();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || 'Failed to close job');
    }
  };

  const publishedCount = jobs.filter(j => j.status === 'PUBLISHED').length;
  const draftCount = jobs.filter(j => j.status === 'DRAFT').length;
  const totalApplications = jobs.reduce((acc, j) => acc + (j.applicationCount || 0), 0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Job Management</h1>
              <p className="text-gray-600">Create, manage, and track your job postings</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenDialog(true)}
            >
              <Button variant="primary" size="lg">
                <Plus size={20} />
                New Job
              </Button>
            </motion.button>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{jobs.length}</div>
                <p className="text-gray-600 text-sm">Total Jobs</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">{publishedCount}</div>
                <p className="text-gray-600 text-sm">Published</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">{draftCount}</div>
                <p className="text-gray-600 text-sm">Drafts</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-accent-600 mb-2">{totalApplications}</div>
                <p className="text-gray-600 text-sm">Applications</p>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Jobs Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr className="text-left">
                  <th className="px-6 py-4 font-semibold text-gray-900">Job Title</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-center">Applications</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{job.title}</div>
                          <p className="text-sm text-gray-500">{job.department}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{job.location}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              job.status === 'PUBLISHED'
                                ? 'success'
                                : job.status === 'DRAFT'
                                ? 'secondary'
                                : 'error'
                            }
                          >
                            {job.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            <Users size={16} />
                            {job.applicationCount || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {job.status === 'DRAFT' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePublish(job.id)}
                                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors text-emerald-600"
                                title="Publish"
                              >
                                <Check size={18} />
                              </motion.button>
                            )}
                            {job.status === 'PUBLISHED' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleClose(job.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                title="Close"
                              >
                                <X size={18} />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toast.success('View feature coming soon!')}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                              title="View"
                            >
                              <Eye size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-600"
                        >
                          <Plus size={48} className="mx-auto text-gray-300 mb-4" />
                          <p className="text-lg font-medium">No jobs created yet</p>
                          <p className="text-sm">Create your first job posting to get started</p>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Create Job Modal */}
        <AnimatePresence>
          {openDialog && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => !isLoading && setOpenDialog(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
                  <h2 className="text-2xl font-bold gradient-text mb-6">Create New Job</h2>

                  {error && (
                    <Alert type="error" title="Error" description={error} className="mb-6" />
                  )}

                  <div className="space-y-4">
                    <Input
                      label="Job Title"
                      placeholder="e.g., Senior React Developer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      disabled={isLoading}
                    />

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        className="input-field resize-none"
                        rows={4}
                        placeholder="Enter job description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Location"
                        placeholder="e.g., New York, NY"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={isLoading}
                      />
                      <Input
                        label="Department"
                        placeholder="e.g., Engineering"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>

                    <Input
                      label="Employment Type"
                      placeholder="e.g., Full-time, Part-time"
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => !isLoading && setOpenDialog(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleCreateJob}
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      Create Job
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;

