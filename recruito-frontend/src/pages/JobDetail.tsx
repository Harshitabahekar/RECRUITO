import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
} from '@mui/material';
import { jobService, Job } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { fileService } from '../services/fileService';
import { useAppSelector } from '../redux/hooks';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    try {
      const data = await jobService.getJobById(id!);
      setJob(data);
    } catch (error) {
      console.error('Failed to load job:', error);
    }
  };

  const handleApply = async () => {
    if (!id) return;

    try {
      let resumeUrl: string | undefined;
      if (resumeFile) {
        const upload = await fileService.uploadResume(resumeFile);
        // Backend serves files under /files/** so build absolute URL
        const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';
        resumeUrl = `${baseUrl}${upload.url}`;
      }

      await applicationService.createApplication({
        jobId: id!,
        coverLetter,
        resumeUrl,
      });
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setTimeout(() => navigate('/applications'), 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to submit application' });
    }
  };

  if (!job) {
    return <Container>Loading...</Container>;
  }

  const isCandidate = user?.role === 'CANDIDATE';

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {job.location} • {job.department} • {job.employmentType}
        </Typography>
        {job.salaryMin && job.salaryMax && (
          <Typography variant="h6" color="primary" gutterBottom>
            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
          </Typography>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Job Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {job.description}
          </Typography>
        </Box>

        {isCandidate && job.status === 'PUBLISHED' && (
          <Box sx={{ mt: 4 }}>
            {message && (
              <Alert severity={message.type} sx={{ mb: 2 }}>
                {message.text}
              </Alert>
            )}
            <Typography variant="h6" gutterBottom>
              Apply for this Job
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Cover Letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Upload Resume (PDF / DOC / DOCX)
              </Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setResumeFile(file);
                }}
              />
            </Box>
            <Button variant="contained" onClick={handleApply}>
              Submit Application
            </Button>
          </Box>
        )}

        {(user?.role === 'RECRUITER' || user?.role === 'ADMIN') && job.recruiterId === user?.userId && (
          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/app/dashboard')}>
              Manage Job
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default JobDetail;

