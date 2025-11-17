import api from './api';

export interface Analytics {
  totalJobs: number;
  totalApplications: number;
  totalInterviews: number;
  totalUsers: number;
  activeRecruiters: number;
  activeCandidates: number;
  applicationsByStatus: Record<string, number>;
  interviewsByMonth: Record<string, number>;
  conversionRate: number;
  jobsByStatus: Record<string, number>;
}

export const analyticsService = {
  getDashboardAnalytics: async (): Promise<Analytics> => {
    const response = await api.get<Analytics>('/analytics/dashboard');
    return response.data;
  },
};

