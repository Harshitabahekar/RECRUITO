import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { analyticsService, Analytics } from '../services/analyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await analyticsService.getDashboardAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  if (!analytics) {
    return <Container>Loading...</Container>;
  }

  const applicationsByStatusData = Object.entries(analytics.applicationsByStatus || {})
    .map(([name, value]) => ({
      name,
      value,
    }))
    // Hide zero-value statuses to avoid overlapping labels
    .filter((item) => (item.value as number) > 0);

  const interviewsByMonthData = Object.entries(analytics.interviewsByMonth || {})
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
  <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Jobs</Typography>
            <Typography variant="h4">{analytics.totalJobs}</Typography>
          </Paper>
        </Grid>
  <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Applications</Typography>
            <Typography variant="h4">{analytics.totalApplications}</Typography>
          </Paper>
        </Grid>
  <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Interviews</Typography>
            <Typography variant="h4">{analytics.totalInterviews}</Typography>
          </Paper>
        </Grid>
  <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Conversion Rate</Typography>
            <Typography variant="h4">{analytics.conversionRate.toFixed(2)}%</Typography>
          </Paper>
        </Grid>

  <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Applications by Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationsByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationsByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

  <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Interviews by Month
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={interviewsByMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;

