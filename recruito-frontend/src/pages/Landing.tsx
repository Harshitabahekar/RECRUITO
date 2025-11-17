import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Top Nav */}
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(12px)', bgcolor: 'rgba(10,10,25,0.8)' }}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Recruito
          </Typography>
          <Button color="inherit" onClick={() => scrollToSection('features')}>
            Features
          </Button>
          <Button color="inherit" onClick={() => scrollToSection('testimonials')}>
            Testimonials
          </Button>
          <Button color="inherit" onClick={() => scrollToSection('analytics')}>
            Analytics
          </Button>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="contained" sx={{ ml: 1 }} onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          pt: 12,
          pb: 10,
          background: 'radial-gradient(circle at top left, #1976d2 0, #0a0b1a 50%)',
          color: 'common.white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
                Hire faster. <br /> Interview smarter.
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Recruito brings jobs, candidates, interviews, chat, and analytics into one modern workspace
                for recruiters and talent.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/register')}
                >
                  Start as Recruiter
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  sx={{ borderColor: 'white', color: 'white' }}
                  onClick={() => navigate('/register')}
                >
                  I&apos;m a Candidate
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: 'rgba(15,23,42,0.95)',
                  boxShadow: 6,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  End-to-end recruitment in one view:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                  <li>Post jobs and manage pipelines from a clean dashboard.</li>
                  <li>Let candidates apply, track status, and respond to interview invites.</li>
                  <li>Schedule interviews with calendar-aware UI and automatic validation.</li>
                  <li>Chat in real-time and monitor hiring performance with analytics.</li>
                </ul>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700 }}>
            Everything you need to run hiring
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Designed for recruiters, hiring managers, and candidates to stay perfectly in sync.
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Authentication & Roles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Secure login/registration with role-based routing for Admins, Recruiters, and Candidates.
                    Each role sees a tailored dashboard and actions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Job & Candidate Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recruiters publish jobs, candidates apply in one click, and everyone tracks application
                    status from a clean, responsive UI.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Interviews & Chat
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Schedule interviews, let candidates accept or reject, and discuss details instantly
                    through built-in messaging.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        id="testimonials"
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #0f172a, #020617)',
          color: 'common.white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700 }}>
            Loved by modern hiring teams
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 6, opacity: 0.8 }}>
            Teams use Recruito to move from resumes to offers in days, not weeks.
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'rgba(15,23,42,0.9)' }}>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    “We cut our time-to-hire in half. The interview scheduling and built-in chat keep
                    everyone aligned.”
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Priya, Senior Recruiter
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    SaaS Scale-up
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'rgba(15,23,42,0.9)' }}>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    “Candidates finally know exactly where they stand. The dashboard is super intuitive.”
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Arjun, Talent Partner
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Product Studio
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'rgba(15,23,42,0.9)' }}>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    “The analytics dashboard gives us real visibility into which roles and sources are
                    actually working.”
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Neha, Head of People
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Fintech Company
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Analytics / CTA */}
      <Box id="analytics" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                See your hiring funnel at a glance
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Track applications, interviews, and offers with interactive charts and stats so you can
                optimize your recruitment process.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
              >
                Launch Recruito Dashboard
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: 4,
                  p: 3,
                  bgcolor: 'background.paper',
                  boxShadow: 4,
                  border: '1px solid rgba(148,163,184,0.4)',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Modules included:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
                  <li>Authentication with role-based routing</li>
                  <li>Job posting, candidate dashboard & resume uploads</li>
                  <li>Interview scheduling with automatic validation</li>
                  <li>Messaging for real-time candidate & recruiter chat</li>
                  <li>Analytics dashboard with charts and performance metrics</li>
                </ul>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, borderTop: '1px solid rgba(148,163,184,0.3)', textAlign: 'center', bgcolor: '#020617', color: 'rgba(148,163,184,0.9)' }}>
        <Typography variant="body2">© {new Date().getFullYear()} Recruito. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Landing;


