import { useState, useCallback, useEffect } from 'react';
import { productsApi } from '@/api/products';
import type { Product, ProductFormData } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productsApi.findAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const createProduct = useCallback(async (data: ProductFormData) => {
    const { data: product } = await productsApi.create(data);
    setProducts((prev) => [...prev, product]);
    return product;
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<ProductFormData>) => {
    const { data: product } = await productsApi.update(id, data);
    setProducts((prev) => prev.map((p) => (p._id === id ? product : p)));
    return product;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await productsApi.delete(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }, []);

  return { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
}
