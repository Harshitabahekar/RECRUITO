import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Pagination,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { jobService, Job } from '../services/jobService';
import { useAppSelector } from '../redux/hooks';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    loadJobs();
  }, [page, searchTitle, searchLocation]);

  const loadJobs = async () => {
    try {
      const data = await jobService.getAllJobs(page, 10, 'createdAt', 'DESC', searchTitle, searchLocation, 'PUBLISHED');
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const handleSearch = () => {
    setPage(0);
    loadJobs();
  };

  return (
    <Container>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Available Jobs</Typography>
        {(user?.role === 'RECRUITER' || user?.role === 'ADMIN') && (
          <Button variant="contained" onClick={() => navigate('/app/dashboard')}>
            Post New Job
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search by title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          size="small"
        />
        <TextField
          label="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid key={job.id} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {job.location} • {job.department}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                  {job.description.substring(0, 150)}...
                </Typography>
                {job.salaryMin && job.salaryMax && (
                  <Typography variant="body2" color="primary" gutterBottom>
                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Chip label={job.status} color={job.status === 'PUBLISHED' ? 'success' : 'default'} />
                  <Button variant="outlined" onClick={() => navigate(`/app/jobs/${job.id}`)}>
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default Jobs;

