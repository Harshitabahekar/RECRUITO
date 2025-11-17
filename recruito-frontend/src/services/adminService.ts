import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  profile?: {
    phone?: string;
    location?: string;
    avatar?: string;
  };
}

export interface UserPage {
  content: User[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface SystemStats {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  totalAdmins: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  totalInterviews: number;
  upcomingInterviews: number;
}

export interface UpdateUserRequest {
  name?: string;
  role?: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  isActive?: boolean;
}

export const adminService = {
  // User Management
  getAllUsers: async (page = 0, size = 10): Promise<UserPage> => {
    const response = await api.get<UserPage>(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  changeUserRole: async (id: string, role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'): Promise<User> => {
    const response = await api.put<User>(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await api.put<User>(`/admin/users/${id}/toggle-status`, {});
    return response.data;
  },

  // System Stats
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await api.get<SystemStats>('/admin/stats');
    return response.data;
  },

  // Jobs Management
  getAllJobs: async (page = 0, size = 10) => {
    const response = await api.get(`/admin/jobs?page=${page}&size=${size}`);
    return response.data;
  },

  closeJob: async (jobId: string): Promise<void> => {
    await api.post(`/admin/jobs/${jobId}/close`, {});
  },

  deleteJob: async (jobId: string): Promise<void> => {
    await api.delete(`/admin/jobs/${jobId}`);
  },

  // Applications Management
  getAllApplications: async (page = 0, size = 10) => {
    const response = await api.get(`/admin/applications?page=${page}&size=${size}`);
    return response.data;
  },

  // Analytics
  getDashboardAnalytics: async () => {
    const response = await api.get('/admin/analytics/dashboard');
    return response.data;
  },

  getReports: async (type: 'users' | 'jobs' | 'applications' | 'interviews') => {
    const response = await api.get(`/admin/analytics/reports/${type}`);
    return response.data;
  },
};
