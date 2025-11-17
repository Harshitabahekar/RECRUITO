import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, UserCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authService, RegisterRequest } from '../services/authService';
import { useAppDispatch } from '../redux/hooks';
import { setCredentials } from '../redux/slices/authSlice';
import { Input, Button, Card, Alert } from '../components/ui';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'CANDIDATE',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      const response = await authService.register(formData);
      
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
      toast.success('Account created successfully!', {
        duration: 2000,
        icon: '🎉',
      });

      setTimeout(() => {
        if (response.role === 'ADMIN' || response.role === 'RECRUITER') {
          navigate('/app/dashboard');
        } else {
          navigate('/app/jobs');
        }
      }, 500);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
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
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const roles = [
    { value: 'CANDIDATE', label: 'Job Candidate', icon: UserCheck },
    { value: 'RECRUITER', label: 'Recruiter', icon: User },
  ];

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
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">R</span>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Join Recruito</h1>
          <p className="text-gray-600 text-sm">Create your account and get started</p>
        </motion.div>

        {/* Register Card */}
        <Card animated={false} className="p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert type="error" title="Registration Failed" description={error} />
              </motion.div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div variants={itemVariants}>
                <Input
                  label="First Name"
                  placeholder="John"
                  icon={<User size={18} />}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={isLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
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
                  placeholder="At least 6 characters"
                  icon={<Lock size={18} />}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  helperText="Must be at least 6 characters"
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

            {/* Phone Field */}
            <motion.div variants={itemVariants}>
              <Input
                label="Phone (Optional)"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={<Phone size={18} />}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isLoading}
              />
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = formData.role === role.value;
                  
                  return (
                    <motion.button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value as any })}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center gap-2 justify-center ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-primary-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{role.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Register Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full group"
                isLoading={isLoading}
                disabled={isLoading}
              >
                <span>Create Account</span>
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

        {/* Login Link */}
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <motion.button
              onClick={() => navigate('/login')}
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login here
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;

