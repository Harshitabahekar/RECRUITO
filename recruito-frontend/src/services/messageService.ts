import api from './api';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  isRead: boolean;
  chatRoomId: string;
  createdAt: string;
}

export interface MessageRequest {
  receiverEmail: string;
  content: string;
}

export const messageService = {
  sendMessage: async (data: MessageRequest): Promise<Message> => {
    const response = await api.post<Message>('/chat/send', data);
    return response.data;
  },

  getChatMessages: async (otherUserEmail: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/chat/messages?otherUserEmail=${encodeURIComponent(otherUserEmail)}`);
    return response.data;
  },

  markMessagesAsRead: async (chatRoomId: string): Promise<void> => {
    await api.post(`/chat/mark-read?chatRoomId=${chatRoomId}`);
  },

  getUnreadMessageCount: async (): Promise<number> => {
    const response = await api.get<number>('/chat/unread-count');
    return response.data;
  },
};

