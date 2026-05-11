import type { AuthResponse } from '@/types';
import api from './client';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  register: (email: string, password: string, role: 'admin' | 'user', companyId: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, role, companyId }),
};
