
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  companyId: string;
}

export interface DecodedToken {
  id: string;
  companyId: string;
  role: 'admin' | 'user';
  exp: number;
  iat: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<Product, '_id' | 'companyId' | 'createdAt' | 'updatedAt'>;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AuthResponse {
  token: string;
}

export interface ChatResponse {
  reply: string;
}

export interface ApiError {
  message: string;
}
