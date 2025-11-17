import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { applicationService, Application } from '../services/applicationService';
import { interviewService, InterviewCreateRequest } from '../services/interviewService';
import { useAppSelector } from '../redux/hooks';

const Applications: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedForView, setSelectedForView] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data =
        user?.role === 'CANDIDATE'
          ? await applicationService.getMyApplications(0, 100)
          : await applicationService.getRecruiterApplications(0, 100);
      setApplications(data.content);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const handleStatusChange = async (id: string, status: Application['status']) => {
    try {
      await applicationService.updateApplicationStatus(id, status);
      loadApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleScheduleInterview = (application: Application) => {
    setSelectedApplication(application);
    setScheduledAt(null);
    setLocation('');
    setInterviewType('');
    setNotes('');
    setScheduleDialogOpen(true);
  };

  const handleViewDetails = (application: Application) => {
    setSelectedForView(application);
    setViewDialogOpen(true);
  };

  const handleScheduleSubmit = async () => {
    if (!selectedApplication || !scheduledAt) {
      alert('Please select a date and time for the interview');
      return;
    }

    try {
      const interviewData: InterviewCreateRequest = {
        applicationId: selectedApplication.id,
        // Send as local date-time without timezone suffix so Spring LocalDateTime can parse it
        scheduledAt: scheduledAt.toISOString().slice(0, 19),
        location: location || undefined,
        interviewType: interviewType || undefined,
        notes: notes || undefined,
      };

      await interviewService.scheduleInterview(interviewData);
      
      // Update application status to INTERVIEW_SCHEDULED
      await applicationService.updateApplicationStatus(selectedApplication.id, 'INTERVIEW_SCHEDULED');
      
      setScheduleDialogOpen(false);
      loadApplications();
      alert('Interview scheduled successfully!');
    } catch (error: any) {
      console.error('Failed to schedule interview:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to schedule interview. Please try again.';
      alert(errorMessage);
    }
  };

  const getStatusColor = (status: Application['status']) => {
    const colors: Record<Application['status'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
      APPLIED: 'default',
      SHORTLISTED: 'primary',
      INTERVIEW_SCHEDULED: 'warning',
      INTERVIEW_COMPLETED: 'warning',
      HIRED: 'success',
      REJECTED: 'error',
    };
    return colors[status];
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {user?.role === 'CANDIDATE' ? 'My Applications' : 'Applications'}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              {user?.role !== 'CANDIDATE' && <TableCell>Candidate</TableCell>}
              {user?.role !== 'CANDIDATE' && <TableCell>Cover Letter</TableCell>}
              {user?.role !== 'CANDIDATE' && <TableCell>Resume</TableCell>}
              <TableCell>Status</TableCell>
              <TableCell>Applied Date</TableCell>
              {user?.role !== 'CANDIDATE' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.jobTitle}</TableCell>
                {user?.role !== 'CANDIDATE' && <TableCell>{app.candidateName}</TableCell>}
                {user?.role !== 'CANDIDATE' && (
                  <TableCell>
                    {app.coverLetter ? `${app.coverLetter.slice(0, 40)}${app.coverLetter.length > 40 ? '…' : ''}` : '-'}
                  </TableCell>
                )}
                {user?.role !== 'CANDIDATE' && (
                  <TableCell>
                    {app.resumeUrl ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => window.open(app.resumeUrl, '_blank')}
                      >
                        View
                      </Button>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Chip label={app.status} color={getStatusColor(app.status)} />
                </TableCell>
                <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                {user?.role !== 'CANDIDATE' && (
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={app.status}
                          label="Status"
                          onChange={(e) => handleStatusChange(app.id, e.target.value as Application['status'])}
                        >
                          <MenuItem value="APPLIED">Applied</MenuItem>
                          <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                          <MenuItem value="INTERVIEW_SCHEDULED">Interview Scheduled</MenuItem>
                          <MenuItem value="INTERVIEW_COMPLETED">Interview Completed</MenuItem>
                          <MenuItem value="HIRED">Hired</MenuItem>
                          <MenuItem value="REJECTED">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                      {(app.status === 'SHORTLISTED' || app.status === 'APPLIED') && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CalendarTodayIcon />}
                          onClick={() => handleScheduleInterview(app)}
                        >
                          Schedule Interview
                        </Button>
                      )}
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleViewDetails(app)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Schedule Interview Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {selectedApplication && (
              <Typography variant="body2" color="text.secondary">
                Candidate: {selectedApplication.candidateName}
              </Typography>
            )}
            <TextField
              label="Interview Date & Time"
              type="datetime-local"
              value={scheduledAt ? new Date(scheduledAt.getTime() - scheduledAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
              onChange={(e) => setScheduledAt(e.target.value ? new Date(e.target.value) : null)}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Location / Video Link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              placeholder="e.g., Conference Room A or https://meet.google.com/..."
            />
            <FormControl fullWidth>
              <InputLabel>Interview Type</InputLabel>
              <Select
                value={interviewType}
                label="Interview Type"
                onChange={(e) => setInterviewType(e.target.value)}
              >
                <MenuItem value="PHONE">Phone</MenuItem>
                <MenuItem value="VIDEO">Video</MenuItem>
                <MenuItem value="IN_PERSON">In Person</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Additional notes or instructions for the candidate..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleScheduleSubmit} variant="contained" disabled={!scheduledAt}>
            Schedule Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Application Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedForView && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="body2">
                <strong>Job:</strong> {selectedForView.jobTitle}
              </Typography>
              <Typography variant="body2">
                <strong>Candidate:</strong> {selectedForView.candidateName} ({selectedForView.candidateEmail})
              </Typography>
              <Typography variant="body2">
                <strong>Applied on:</strong>{' '}
                {new Date(selectedForView.createdAt).toLocaleString()}
              </Typography>
              {selectedForView.coverLetter && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Cover Letter
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {selectedForView.coverLetter}
                  </Typography>
                </Box>
              )}
              {selectedForView.resumeUrl && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Resume
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => window.open(selectedForView.resumeUrl!, '_blank')}
                  >
                    Open Resume
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Applications;

