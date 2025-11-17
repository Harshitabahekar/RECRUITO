import api from './api';

export interface UploadResponse {
  url: string;
  fileName: string;
}

export const fileService = {
  uploadResume: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};


