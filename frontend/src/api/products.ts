import type { Product, ProductFormData } from '@/types';
import api from './client';

export const productsApi = {
  findAll: () =>
    api.get<Product[]>('/products'),

  create: (data: ProductFormData) =>
    api.post<Product>('/products', data),

  update: (id: string, data: Partial<ProductFormData>) =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete(`/products/${id}`),
};
