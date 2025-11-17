import api from './api';

export type InterviewResponseStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Interview {
  id: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  recruiterId: string;
  recruiterName: string;
  recruiterEmail: string;
  scheduledAt: string;
  completedAt?: string;
  notes?: string;
  location?: string;
  interviewType?: string;
  isCompleted: boolean;
  createdAt: string;
  candidateResponseStatus?: InterviewResponseStatus;
  candidateRespondedAt?: string;
  candidateResponseNote?: string;
}

export interface InterviewCreateRequest {
  applicationId: string;
  scheduledAt: string;
  location?: string;
  interviewType?: string;
  notes?: string;
}

export interface InterviewResponseRequest {
  response: InterviewResponseStatus;
  note?: string;
}

export const interviewService = {
  scheduleInterview: async (data: InterviewCreateRequest): Promise<Interview> => {
    const response = await api.post<Interview>('/interviews', data);
    return response.data;
  },

  getMyInterviews: async (): Promise<Interview[]> => {
    const response = await api.get<Interview[]>('/interviews/my-interviews');
    return response.data;
  },

  getRecruiterInterviews: async (): Promise<Interview[]> => {
    const response = await api.get<Interview[]>('/interviews/recruiter/my-interviews');
    return response.data;
  },

  getInterviewById: async (id: string): Promise<Interview> => {
    const response = await api.get<Interview>(`/interviews/${id}`);
    return response.data;
  },

  updateInterview: async (id: string, data: InterviewCreateRequest): Promise<Interview> => {
    const response = await api.put<Interview>(`/interviews/${id}`, data);
    return response.data;
  },

  completeInterview: async (id: string, notes?: string): Promise<Interview> => {
    const response = await api.post<Interview>(`/interviews/${id}/complete`, null, {
      params: { notes },
    });
    return response.data;
  },

  respondToInterview: async (id: string, data: InterviewResponseRequest): Promise<Interview> => {
    const response = await api.post<Interview>(`/interviews/${id}/respond`, data);
    return response.data;
  },
};

