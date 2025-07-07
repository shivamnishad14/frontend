import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function useListUsers(params?: { page?: number; size?: number; sort?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/users/list', { params });
      return data.data || data;
    },
    keepPreviousData: true,
  });
}

export function useGetUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/users/${userId}`);
      return data.data || data;
    },
    enabled: !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const { data } = await axios.post('/api/v1/users/create', user);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, user }: { userId: number; user: Partial<User> }) => {
      const { data } = await axios.put(`/api/v1/users/${userId}/update`, user);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      const { data } = await axios.put(`/api/v1/users/${userId}/role`, null, { params: { role } });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const { data } = await axios.delete(`/api/v1/users/${userId}/delete`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useSearchUsers(params: { query: string; role?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['users-search', params],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/users/search', { params });
      return data.data || data;
    },
    enabled: !!params.query,
  });
}

export function useToggleActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.post(`/api/v1/users/toggle-active/${id}`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useApproveAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.post(`/api/v1/users/approve-admin/${id}`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useRejectAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.post(`/api/v1/users/reject-admin/${id}`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function usePendingAdmins() {
  return useQuery({
    queryKey: ['users-pending-admins'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/users/pending-admins');
      return data.data || data;
    },
  });
} 