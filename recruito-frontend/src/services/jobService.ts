import api from './api';

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  department?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  recruiterId: string;
  recruiterName: string;
  createdAt: string;
  publishedAt?: string;
  applicationCount: number;
}

export interface JobCreateRequest {
  title: string;
  description: string;
  location: string;
  department?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface JobPage {
  content: Job[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const jobService = {
  getAllJobs: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'DESC', title?: string, location?: string, status?: string): Promise<JobPage> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });
    if (title) params.append('title', title);
    if (location) params.append('location', location);
    if (status) params.append('status', status);
    
    const response = await api.get<JobPage>(`/jobs?${params}`);
    return response.data;
  },

  getJobById: async (id: string): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: JobCreateRequest): Promise<Job> => {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  },

  updateJob: async (id: string, data: JobCreateRequest): Promise<Job> => {
    const response = await api.put<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  publishJob: async (id: string): Promise<void> => {
    await api.post(`/jobs/${id}/publish`);
  },

  closeJob: async (id: string): Promise<void> => {
    await api.post(`/jobs/${id}/close`);
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  getMyJobs: async (page = 0, size = 10): Promise<JobPage> => {
    const response = await api.get<JobPage>(`/jobs/recruiter/my-jobs?page=${page}&size=${size}`);
    return response.data;
  },
};

