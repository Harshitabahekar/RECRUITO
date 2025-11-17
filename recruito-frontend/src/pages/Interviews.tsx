import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import EditIcon from '@mui/icons-material/Edit';
import { interviewService, Interview, InterviewCreateRequest, InterviewResponseStatus } from '../services/interviewService';
import { applicationService, Application } from '../services/applicationService';
import { useAppSelector } from '../redux/hooks';

const Interviews: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [location, setLocation] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [notes, setNotes] = useState('');

  const isCandidate = user?.role === 'CANDIDATE';
  const isRecruiter = user?.role === 'RECRUITER' || user?.role === 'ADMIN';

  const [pendingApplicationsCount, setPendingApplicationsCount] = useState<number>(0);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState<Application | null>(null);

  useEffect(() => {
    loadInterviews();
    // Auto-refresh interviews every 30 seconds to see updates
    const interval = setInterval(loadInterviews, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isRecruiter) {
      loadPendingApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecruiter]);

  const loadInterviews = async () => {
    try {
      const data =
        user?.role === 'CANDIDATE'
          ? await interviewService.getMyInterviews()
          : await interviewService.getRecruiterInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Failed to load interviews:', error);
    }
  };

  const loadPendingApplications = async () => {
    try {
      const data = await applicationService.getRecruiterApplications(0, 100);
      const pending = data.content.filter(
        (app) => app.status === 'APPLIED' || app.status === 'SHORTLISTED'
      );
      setPendingApplicationsCount(pending.length);
    } catch (error) {
      console.error('Failed to load recruiter applications for notifications:', error);
    }
  };

  const handleChatClick = (receiverEmail: string) => {
    // Navigate to chat with pre-filled receiver email under /app namespace
    navigate(`/app/chat?email=${encodeURIComponent(receiverEmail)}`);
  };

  const handleEditClick = (interview: Interview) => {
    setSelectedInterview(interview);
    setScheduledAt(new Date(interview.scheduledAt).toISOString().slice(0, 16));
    setLocation(interview.location || '');
    setInterviewType(interview.interviewType || '');
    setNotes(interview.notes || '');
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedInterview || !scheduledAt) {
      alert('Please select a date and time for the interview');
      return;
    }

    try {
      const interviewData: InterviewCreateRequest = {
        applicationId: selectedInterview.applicationId,
        // Send as local date-time without timezone suffix so Spring LocalDateTime can parse it
        scheduledAt: new Date(scheduledAt).toISOString().slice(0, 19),
        location: location || undefined,
        interviewType: interviewType || undefined,
        notes: notes || undefined,
      };

      await interviewService.updateInterview(selectedInterview.id, interviewData);
      setEditDialogOpen(false);
      loadInterviews();
      alert('Interview updated successfully!');
    } catch (error: any) {
      console.error('Failed to update interview:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update interview. Please try again.';
      alert(errorMessage);
    }
  };

  const handleResponse = async (interview: Interview, response: InterviewResponseStatus) => {
    try {
      let note: string | undefined;
      if (response === 'REJECTED') {
        note = window.prompt('Share a reason for rejecting the interview (optional)') || undefined;
      }
      await interviewService.respondToInterview(interview.id, { response, note });
      loadInterviews();
      alert(`Interview ${response === 'ACCEPTED' ? 'accepted' : 'rejected'} successfully!`);
    } catch (error: any) {
      console.error('Failed to submit interview response:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to submit response. Please try again.';
      alert(errorMessage);
    }
  };

  const getResponseLabel = (status: InterviewResponseStatus): string => {
    switch (status) {
      case 'ACCEPTED':
        return 'Accepted';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Awaiting response';
    }
  };

  const handleViewApplicationFromInterview = async (applicationId: string) => {
    try {
      const app = await applicationService.getApplicationById(applicationId);
      setApplicationDetails(app);
      setApplicationDialogOpen(true);
    } catch (error) {
      console.error('Failed to load application details from interview:', error);
      alert('Unable to load application details. Please try again from the Applications page.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {user?.role === 'CANDIDATE' ? 'My Interviews' : 'Scheduled Interviews'}
      </Typography>

      {isRecruiter && pendingApplicationsCount > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.light' }}>
          <Typography variant="body1">
            You have <strong>{pendingApplicationsCount}</strong> application
            {pendingApplicationsCount > 1 ? 's' : ''} waiting for review or interview scheduling.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button variant="outlined" size="small" onClick={() => navigate('/app/applications')}>
              Go to Applications
            </Button>
          </Box>
        </Paper>
      )}

      <List>
        {interviews.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No interviews scheduled yet.
            </Typography>
          </Paper>
        ) : (
          interviews.map((interview) => {
            const otherPersonEmail = isCandidate 
              ? interview.recruiterEmail 
              : interview.candidateEmail;
            const otherPersonName = isCandidate
              ? interview.recruiterName
              : interview.candidateName;
            const responseStatus: InterviewResponseStatus = interview.candidateResponseStatus || 'PENDING';
            const showResponseActions = isCandidate && !interview.isCompleted && responseStatus === 'PENDING';
            const chipColor =
              responseStatus === 'ACCEPTED'
                ? 'success'
                : responseStatus === 'REJECTED'
                ? 'error'
                : 'warning';

            return (
              <Paper key={interview.id} sx={{ mb: 2, p: 2 }}>
                <ListItem>
                  <ListItemText
                    disableTypography
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">
                          Interview with {otherPersonName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={interview.isCompleted ? 'Completed' : 'Scheduled'}
                            color={interview.isCompleted ? 'success' : 'primary'}
                          />
                          <Chip
                            label={getResponseLabel(responseStatus)}
                            color={chipColor}
                          />
                          {otherPersonEmail && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ChatIcon />}
                              onClick={() => handleChatClick(otherPersonEmail)}
                            >
                              Chat
                            </Button>
                          )}
                          {!interview.isCompleted && isRecruiter && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => handleEditClick(interview)}
                            >
                              Edit
                            </Button>
                          )}
                          {isRecruiter && (
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => handleViewApplicationFromInterview(interview.applicationId)}
                            >
                              View Application
                            </Button>
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                          📅 Date & Time: {new Date(interview.scheduledAt).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                        {interview.location && (
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            📍 Location: {interview.location}
                          </Typography>
                        )}
                        {interview.interviewType && (
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            💼 Type: {interview.interviewType.replace('_', ' ')}
                          </Typography>
                        )}
                        {interview.notes && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                            📝 Notes: {interview.notes}
                          </Typography>
                        )}
                        {interview.isCompleted && interview.completedAt && (
                          <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                            ✅ Completed on: {new Date(interview.completedAt).toLocaleString()}
                          </Typography>
                        )}
                        {!interview.isCompleted && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            🎯 Candidate response: {getResponseLabel(responseStatus)}
                          </Typography>
                        )}
                        {interview.candidateRespondedAt && (
                          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                            Last updated: {new Date(interview.candidateRespondedAt).toLocaleString()}
                          </Typography>
                        )}
                        {interview.candidateResponseNote && (
                          <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                            Candidate note: {interview.candidateResponseNote}
                          </Typography>
                        )}
                        {showResponseActions && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleResponse(interview, 'ACCEPTED')}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleResponse(interview, 'REJECTED')}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </Paper>
            );
          })
        )}
      </List>

      {/* Edit Interview Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Interview</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {selectedInterview && (
              <Typography variant="body2" color="text.secondary">
                Candidate: {selectedInterview.candidateName}
              </Typography>
            )}
            <TextField
              label="Interview Date & Time"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
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
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={!scheduledAt}>
            Update Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* Application details dialog from interview */}
      <Dialog
        open={applicationDialogOpen}
        onClose={() => setApplicationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {applicationDetails && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="body2">
                <strong>Job:</strong> {applicationDetails.jobTitle}
              </Typography>
              <Typography variant="body2">
                <strong>Candidate:</strong> {applicationDetails.candidateName} ({applicationDetails.candidateEmail})
              </Typography>
              <Typography variant="body2">
                <strong>Applied on:</strong>{' '}
                {new Date(applicationDetails.createdAt).toLocaleString()}
              </Typography>
              {applicationDetails.coverLetter && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Cover Letter
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {applicationDetails.coverLetter}
                  </Typography>
                </Box>
              )}
              {applicationDetails.resumeUrl && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Resume
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => window.open(applicationDetails.resumeUrl!, '_blank')}
                  >
                    Open Resume
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicationDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Interviews;

