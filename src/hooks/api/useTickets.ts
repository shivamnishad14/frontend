import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Ticket {
  id: number;
  productId: number;
  userId: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  resolution?: string;
  assignedTo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function useListTickets(params?: { productId?: number; page?: number; size?: number; sort?: string }) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/tickets/list', { params });
      return data.data || data;
    },
    keepPreviousData: true,
  });
}

export function useGetTicket(ticketId: number) {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/tickets/${ticketId}`);
      return data.data || data;
    },
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: Partial<Ticket>) => {
      const { data } = await axios.post('/api/v1/tickets/create', ticket);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, ticket }: { ticketId: number; ticket: Partial<Ticket> }) => {
      const { data } = await axios.put(`/api/v1/tickets/${ticketId}/update`, ticket);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticketId: number) => {
      const { data } = await axios.delete(`/api/v1/tickets/${ticketId}/delete`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { ticketId: number; assignedToId: number; managerId: number }) => {
      const { data } = await axios.post('/api/v1/tickets/assign', payload);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, status, userId }: { ticketId: number; status: string; userId: number }) => {
      const { data } = await axios.put(`/api/v1/tickets/${ticketId}/status`, { status, userId });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useResolveTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, resolution }: { ticketId: number; resolution: string }) => {
      const { data } = await axios.post(`/api/v1/tickets/${ticketId}/resolve`, { resolution });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useApproveTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, approvedById, approvalNotes }: { ticketId: number; approvedById: number; approvalNotes: string }) => {
      const { data } = await axios.post(`/api/v1/tickets/${ticketId}/approve`, { approvedById, approvalNotes });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useRejectTicketResolution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, rejectedById, rejectionReason }: { ticketId: number; rejectedById: number; rejectionReason: string }) => {
      const { data } = await axios.post(`/api/v1/tickets/${ticketId}/reject-resolution`, { rejectedById, rejectionReason });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAddTicketComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, userId, content }: { ticketId: number; userId: number; content: string }) => {
      const { data } = await axios.post(`/api/v1/tickets/${ticketId}/comments/add`, { userId, content });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useGetTicketComments(ticketId: number) {
  return useQuery({
    queryKey: ['ticket-comments', ticketId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/tickets/${ticketId}/comments`);
      return data.data || data;
    },
    enabled: !!ticketId,
  });
}

export function useSearchTickets(params: { productId?: number; query?: string; status?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['tickets-search', params],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/tickets/search', { params });
      return data.data || data;
    },
    enabled: !!params.query || !!params.status,
  });
}

export function useCountTickets(params: { productId: number; status?: string }) {
  return useQuery({
    queryKey: ['tickets-count', params],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/tickets/count', { params });
      return data.data || data;
    },
    enabled: !!params.productId,
  });
}

export function useTicketsByAssignee(assigneeId: number) {
  return useQuery({
    queryKey: ['tickets-assignee', assigneeId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/tickets/assigned/${assigneeId}`);
      return data.data || data;
    },
    enabled: !!assigneeId,
  });
}

export function useTicketsByUser(userId: number) {
  return useQuery({
    queryKey: ['tickets-user', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/tickets/my-tickets/${userId}`);
      return data.data || data;
    },
    enabled: !!userId,
  });
}

export function usePendingApprovalTickets() {
  return useQuery({
    queryKey: ['tickets-pending-approval'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/tickets/pending-approval');
      return data.data || data;
    },
  });
}

export function usePublicCreateTicket() {
  return useMutation({
    mutationFn: async (ticket: Partial<Ticket> & { email: string }) => {
      const { data } = await axios.post('/api/v1/tickets/public-create', ticket);
      return data.data || data;
    },
  });
} 