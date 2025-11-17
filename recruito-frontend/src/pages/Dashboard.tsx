import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { jobService, Job, JobCreateRequest } from '../services/jobService';
import { useAppSelector } from '../redux/hooks';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
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
    try {
      const data = await jobService.getMyJobs(0, 100);
      setJobs(data.content);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const handleCreateJob = async () => {
    try {
      await jobService.createJob(formData);
      setOpenDialog(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        department: '',
        employmentType: '',
      });
      loadJobs();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await jobService.publishJob(id);
      loadJobs();
    } catch (error) {
      console.error('Failed to publish job:', error);
    }
  };

  const handleClose = async (id: string) => {
    try {
      await jobService.closeJob(id);
      loadJobs();
    } catch (error) {
      console.error('Failed to close job:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Job Management Dashboard</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Create New Job
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applications</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Chip
                    label={job.status}
                    color={
                      job.status === 'PUBLISHED'
                        ? 'success'
                        : job.status === 'DRAFT'
                        ? 'default'
                        : 'error'
                    }
                  />
                </TableCell>
                <TableCell>{job.applicationCount}</TableCell>
                <TableCell>
                  {job.status === 'DRAFT' && (
                    <Button size="small" onClick={() => handlePublish(job.id)}>
                      Publish
                    </Button>
                  )}
                  {job.status === 'PUBLISHED' && (
                    <Button size="small" onClick={() => handleClose(job.id)}>
                      Close
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Job</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            margin="normal"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Location"
            margin="normal"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Department"
            margin="normal"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <TextField
            fullWidth
            label="Employment Type"
            margin="normal"
            value={formData.employmentType}
            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateJob} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;

