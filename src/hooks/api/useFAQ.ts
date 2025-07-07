import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface FAQ {
  id: number;
  productId: number;
  question: string;
  answer: string;
  category: string;
  orderIndex?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function useListFAQs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/faqs');
      return data.data || data;
    },
  });
}

export function useCreateFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faq: Partial<FAQ>) => {
      const { data } = await axios.post('/api/v1/faqs', faq);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useSearchFAQs(query: string) {
  return useQuery({
    queryKey: ['faqs-search', query],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/faqs/search', { params: { query } });
      return data.data || data;
    },
    enabled: !!query,
  });
}

export function useFAQsByProduct(productId: number) {
  return useQuery({
    queryKey: ['faqs-product', productId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/faqs/product/${productId}`);
      return data.data || data;
    },
    enabled: !!productId,
  });
}

export function useSearchFAQsByProduct(productId: number, query: string) {
  return useQuery({
    queryKey: ['faqs-product-search', productId, query],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/faqs/product/${productId}/search`, { params: { query } });
      return data.data || data;
    },
    enabled: !!productId && !!query,
  });
}

export function useFAQsByCategory(category: string) {
  return useQuery({
    queryKey: ['faqs-category', category],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/faqs/category/${category}`);
      return data.data || data;
    },
    enabled: !!category,
  });
}

export function useFAQsByProductAndCategory(productId: number, category: string) {
  return useQuery({
    queryKey: ['faqs-product-category', productId, category],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/faqs/product/${productId}/category/${category}`);
      return data.data || data;
    },
    enabled: !!productId && !!category,
  });
}

export function useFAQCategories() {
  return useQuery({
    queryKey: ['faq-categories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/faqs/categories');
      return data.data || data;
    },
  });
}

export function useFAQCategoriesByProduct(productId: number) {
  return useQuery({
    queryKey: ['faq-categories-product', productId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/faqs/product/${productId}/categories`);
      return data.data || data;
    },
    enabled: !!productId,
  });
} 