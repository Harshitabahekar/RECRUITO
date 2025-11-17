import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
  phone?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
  userId: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};

