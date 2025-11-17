import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import PrivateRoute from './components/PrivateRoute';
import { ToastProvider } from './components/ui';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Interviews from './pages/Interviews';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';
import Landing from './pages/Landing';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/app/jobs" replace />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route
              path="dashboard"
              element={
                <PrivateRoute allowedRoles={['ADMIN', 'RECRUITER']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
              <Route path="applications" element={<Applications />} />
              <Route path="interviews" element={<Interviews />} />
              <Route path="chat" element={<Chat />} />
              <Route
                path="analytics"
                element={
                  <PrivateRoute allowedRoles={['ADMIN', 'RECRUITER']}>
                    <Analytics />
                  </PrivateRoute>
                }
              />
            </Route>
            {/* Backward-compatible redirects */}
            <Route path="/jobs" element={<Navigate to="/app/jobs" replace />} />
            <Route path="/applications" element={<Navigate to="/app/applications" replace />} />
            <Route path="/interviews" element={<Navigate to="/app/interviews" replace />} />
            <Route path="/chat" element={<Navigate to="/app/chat" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
          </Routes>
        </Router>
    </Provider>
  );
}

export default App;
