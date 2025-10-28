import { useState, useEffect } from 'react';
import { StripeProductWithPrice } from '@/services/stripeProductService';

interface UseStripeProductsOptions {
  category?: string;
  search?: string;
  featured?: boolean;
  autoFetch?: boolean;
}

interface UseStripeProductsReturn {
  products: StripeProductWithPrice[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getProductsByCategory: (category: string) => Promise<void>;
  getFeaturedProducts: () => Promise<void>;
}

export const useStripeProducts = (options: UseStripeProductsOptions = {}): UseStripeProductsReturn => {
  const { category, search, featured, autoFetch = true } = options;
  
  const [products, setProducts] = useState<StripeProductWithPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (params: Record<string, string | boolean> = {}) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/products?${searchParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    const params: Record<string, string | boolean> = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (featured) params.featured = featured;
    
    await fetchProducts(params);
  };

  const searchProducts = async (query: string) => {
    await fetchProducts({ search: query });
  };

  const getProductsByCategory = async (cat: string) => {
    await fetchProducts({ category: cat });
  };

  const getFeaturedProducts = async () => {
    await fetchProducts({ featured: true });
  };

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      const params: Record<string, string | boolean> = {};
      if (category) params.category = category;
      if (search) params.search = search;
      if (featured) params.featured = featured;
      
      fetchProducts(params);
    }
  }, [category, search, featured, autoFetch]);

  return {
    products,
    loading,
    error,
    refetch,
    searchProducts,
    getProductsByCategory,
    getFeaturedProducts
  };
};

export default useStripeProducts;
