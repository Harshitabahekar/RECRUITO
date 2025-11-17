import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { applicationService, Application } from '../services/applicationService';
import { interviewService, InterviewCreateRequest } from '../services/interviewService';
import { useAppSelector } from '../redux/hooks';
import { Button, Card, Input, Badge, Alert } from '../components/ui';

const Applications: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduledAt: '',
    location: '',
    interviewType: 'PHONE',
    notes: '',
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data =
        user?.role === 'CANDIDATE'
          ? await applicationService.getMyApplications(0, 100)
          : await applicationService.getRecruiterApplications(0, 100);
      setApplications(data.content);
    } catch (error) {
      toast.error('Failed to load applications');
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!selectedApplication || !scheduleData.scheduledAt) {
      toast.error('Please fill in all required fields');
      return;
    }

    const loadingToast = toast.loading('Scheduling interview...');
    try {
      const interviewData: InterviewCreateRequest = {
        applicationId: selectedApplication.id,
        scheduledAt: new Date(scheduleData.scheduledAt).toISOString(),
        location: scheduleData.location,
        interviewType: scheduleData.interviewType as any,
        notes: scheduleData.notes,
      };

      await interviewService.scheduleInterview(interviewData);
      toast.dismiss(loadingToast);
      toast.success('Interview scheduled successfully!');
      setShowScheduleDialog(false);
      setSelectedApplication(null);
      setScheduleData({
        scheduledAt: '',
        location: '',
        interviewType: 'PHONE',
        notes: '',
      });
      loadApplications();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || 'Failed to schedule interview');
    }
  };

  const handleRejectApplication = async (appId: string) => {
    const loadingToast = toast.loading('Rejecting application...');
    try {
      await applicationService.updateApplicationStatus(appId, 'REJECTED');
      toast.dismiss(loadingToast);
      toast.success('Application rejected');
      loadApplications();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || 'Failed to reject application');
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

  const getStatusColor = (status: string): 'primary' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'APPLIED':
        return 'primary';
      case 'SHORTLISTED':
        return 'success';
      case 'INTERVIEWED':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SHORTLISTED':
        return <CheckCircle size={18} />;
      case 'REJECTED':
        return <AlertCircle size={18} />;
      default:
        return <Briefcase size={18} />;
    }
  };

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
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Applications</h1>
            <p className="text-gray-600">
              {user?.role === 'CANDIDATE'
                ? 'Track your job applications'
                : 'Manage candidate applications'}
            </p>
          </div>
        </motion.div>

        {/* Applications Grid */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {applications.length > 0 ? (
            applications.map((application, index) => (
              <motion.div
                key={application.id}
                variants={itemVariants}
              >
                <Card hover animated={false} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Job Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {application.jobTitle}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {application.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Candidate Info (for recruiters) */}
                    {user?.role !== 'CANDIDATE' && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Candidate</p>
                        <p className="font-semibold text-gray-900">
                          {application.candidateName}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {application.candidateEmail}
                        </p>
                      </div>
                    )}

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <Badge variant={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                      <div className="flex gap-2 mt-auto">
                        {user?.role !== 'CANDIDATE' &&
                          application.status === 'SHORTLISTED' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowScheduleDialog(true);
                              }}
                            >
                              <Button variant="primary" size="sm">
                                <Calendar size={16} />
                                Schedule
                              </Button>
                            </motion.button>
                          )}
                        {user?.role !== 'CANDIDATE' &&
                          application.status !== 'REJECTED' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRejectApplication(application.id)}
                            >
                              <Button variant="secondary" size="sm">
                                <X size={16} />
                                Reject
                              </Button>
                            </motion.button>
                          )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">
                {user?.role === 'CANDIDATE'
                  ? 'No applications yet'
                  : 'No applications received'}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Schedule Interview Modal */}
        <AnimatePresence>
          {showScheduleDialog && selectedApplication && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setShowScheduleDialog(false)}
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
                <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8">
                  <h2 className="text-2xl font-bold gradient-text mb-6">Schedule Interview</h2>

                  <div className="space-y-4 mb-6">
                    <Alert
                      type="info"
                      description={`Scheduling interview with ${selectedApplication.candidateName}`}
                    />

                    <Input
                      label="Date & Time"
                      type="datetime-local"
                      value={scheduleData.scheduledAt}
                      onChange={(e) =>
                        setScheduleData({ ...scheduleData, scheduledAt: e.target.value })
                      }
                    />

                    <Input
                      label="Interview Location"
                      placeholder="e.g., Conference Room A / Video Call"
                      value={scheduleData.location}
                      onChange={(e) =>
                        setScheduleData({ ...scheduleData, location: e.target.value })
                      }
                    />

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interview Type
                      </label>
                      <select
                        className="input-field"
                        value={scheduleData.interviewType}
                        onChange={(e) =>
                          setScheduleData({ ...scheduleData, interviewType: e.target.value })
                        }
                      >
                        <option value="PHONE">Phone</option>
                        <option value="VIDEO">Video Call</option>
                        <option value="IN_PERSON">In-Person</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        className="input-field resize-none"
                        rows={3}
                        placeholder="Add any notes for the interview..."
                        value={scheduleData.notes}
                        onChange={(e) =>
                          setScheduleData({ ...scheduleData, notes: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowScheduleDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleScheduleInterview}
                    >
                      Schedule
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

export default Applications;
