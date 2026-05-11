import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFormDialog } from '@/components/products/ProductFormDialog';
import { Button } from '@/components/ui/button';
import { Plus, Package, Loader2 } from 'lucide-react';
import type { Product, ProductFormData } from '@/types';

export function DashboardPage() {
  const { isAdmin } = useAuth();
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreate = async (data: ProductFormData) => {
    await createProduct(data);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleSubmit = async (data: ProductFormData) => {
    if (editingProduct) {
      await updateProduct(editingProduct._id, data);
    } else {
      await handleCreate(data);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">
            {isAdmin ? 'Gerencie o catálogo da sua empresa' : 'Confira os produtos disponíveis'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Admin vê tabela, user vê grid de cards */}
      {isAdmin ? (
        <ProductTable products={products} onEdit={handleEdit} onDelete={deleteProduct} />
      ) : (
        <>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhum produto disponível</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Dialog de criação/edição — só admin */}
      {isAdmin && (
        <ProductFormDialog
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          product={editingProduct}
        />
      )}
    </div>
  );
}
