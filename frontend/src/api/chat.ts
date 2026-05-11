import type { ChatResponse } from '@/types';
import api from './client';

export const chatApi = {
  sendMessage: (message: string) =>
    api.post<ChatResponse>('/chat', { message }),
};
