import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authService, LoginRequest } from '../services/authService';
import { useAppDispatch } from '../redux/hooks';
import { setCredentials } from '../redux/slices/authSlice';
import { Input, Button, Card, Alert } from '../components/ui';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await authService.login(formData);
      
      dispatch(setCredentials({
        user: {
          userId: response.userId,
          email: response.email,
          role: response.role,
          firstName: response.firstName,
          lastName: response.lastName,
        },
        token: response.token,
      }));

      toast.dismiss(loadingToast);
      toast.success('Welcome back!', {
        duration: 2000,
        icon: '👋',
      });

      // Navigate based on role
      setTimeout(() => {
        if (response.role === 'ADMIN' || response.role === 'RECRUITER') {
          navigate('/app/dashboard');
        } else {
          navigate('/app/jobs');
        }
      }, 500);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errorMsg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo Section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            className="inline-block mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">R</span>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Recruito</h1>
          <p className="text-gray-600 text-sm">Welcome back! Login to your account</p>
        </motion.div>

        {/* Login Card */}
        <Card animated={false} className="p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert type="error" title="Login Failed" description={error} />
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                icon={<Mail size={18} />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  icon={<Lock size={18} />}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full group"
                isLoading={isLoading}
                disabled={isLoading}
              >
                <span>Login to Recruito</span>
                {!isLoading && (
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </form>
        </Card>

        {/* Register Link */}
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <motion.button
              onClick={() => navigate('/register')}
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create one now
            </motion.button>
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 p-4 bg-white rounded-xl border border-gray-100 text-center"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-500">
            Demo credentials:<br />
            <span className="text-gray-700 font-medium">Email: demo@recruito.com</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

