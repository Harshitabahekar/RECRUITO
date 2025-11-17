import api from './api';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'INTERVIEW_COMPLETED' | 'HIRED' | 'REJECTED';
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationCreateRequest {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface ApplicationPage {
  content: Application[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const applicationService = {
  createApplication: async (data: ApplicationCreateRequest): Promise<Application> => {
    const response = await api.post<Application>('/applications', data);
    return response.data;
  },

  getMyApplications: async (page = 0, size = 10): Promise<ApplicationPage> => {
    const response = await api.get<ApplicationPage>(`/applications/my-applications?page=${page}&size=${size}`);
    return response.data;
  },

  getApplicationsByJob: async (jobId: string, page = 0, size = 10): Promise<ApplicationPage> => {
    const response = await api.get<ApplicationPage>(`/applications/job/${jobId}?page=${page}&size=${size}`);
    return response.data;
  },

  getRecruiterApplications: async (page = 0, size = 10): Promise<ApplicationPage> => {
    const response = await api.get<ApplicationPage>(`/applications/recruiter/my-applications?page=${page}&size=${size}`);
    return response.data;
  },

  getApplicationById: async (id: string): Promise<Application> => {
    const response = await api.get<Application>(`/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id: string, status: Application['status']): Promise<Application> => {
    const response = await api.patch<Application>(`/applications/${id}/status?status=${status}`);
    return response.data;
  },
};

