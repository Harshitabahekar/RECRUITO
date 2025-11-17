import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  ChevronRight,
  Search,
  Plus,
} from 'lucide-react';
import { jobService, Job } from '../services/jobService';
import { useAppSelector } from '../redux/hooks';
import { Button, Card, Input, Badge } from '../components/ui';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [page, searchTitle, searchLocation]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobService.getAllJobs(page, 10, 'createdAt', 'DESC', searchTitle, searchLocation, 'PUBLISHED');
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load jobs');
      console.error('Failed to load jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    loadJobs();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
      'Engineering': 'primary',
      'Design': 'secondary',
      'Marketing': 'warning',
      'Sales': 'success',
      'HR': 'error',
    };
    return colors[department] || 'primary';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Available Opportunities</h1>
              <p className="text-gray-600">Find your next amazing role</p>
            </div>
            {(user?.role === 'RECRUITER' || user?.role === 'ADMIN') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/app/dashboard')}
              >
                <Button variant="primary" size="lg">
                  <Plus size={20} />
                  Post New Job
                </Button>
              </motion.button>
            )}
          </div>

          {/* Search Bar */}
          <motion.div
            className="flex gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              placeholder="Search by job title..."
              icon={<Search size={18} />}
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Search by location..."
              icon={<MapPin size={18} />}
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              className="whitespace-nowrap"
            >
              <Search size={20} />
              Search
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">{jobs.length}</p>
              <p className="text-gray-600 text-sm">Jobs Displayed</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-accent-600">{totalPages}</p>
              <p className="text-gray-600 text-sm">Pages Available</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{jobs.length * (page + 1)}</p>
              <p className="text-gray-600 text-sm">Total Positions</p>
            </Card>
          </motion.div>
        </motion.div>

        {/* Jobs Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                onClick={() => navigate(`/app/jobs/${job.id}`)}
                className="cursor-pointer"
              >
                <Card hover animated={false} className="h-full p-6 group">
                  <div className="space-y-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{job.department}</p>
                      </div>
                      <Briefcase size={24} className="text-primary-500 flex-shrink-0" />
                    </div>

                    {/* Location & Type */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        Full-time
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm flex-grow line-clamp-3">
                      {job.description}
                    </p>

                    {/* Salary & Badges */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      {job.salaryMin && job.salaryMax && (
                        <div className="flex items-center gap-2">
                          <DollarSign size={18} className="text-emerald-600" />
                          <span className="font-semibold text-emerald-600">
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Status & CTA */}
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="primary">{job.status}</Badge>
                        <motion.button
                          className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          View Details
                          <ChevronRight size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No jobs found matching your criteria</p>
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="secondary"
              disabled={page === 0}
              onClick={() => setPage(Math.max(0, page - 1))}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    page === i
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {i + 1}
                </motion.button>
              ))}
              {totalPages > 5 && <span className="px-2 text-gray-600">...</span>}
            </div>
            <Button
              variant="secondary"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

