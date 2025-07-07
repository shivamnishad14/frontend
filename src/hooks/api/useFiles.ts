import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface FileInfo {
  filename: string;
  url: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

export function useListFiles() {
  return useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/files/list');
      return data.data || data;
    },
  });
}

export function useGetFileInfo(filename: string) {
  return useQuery({
    queryKey: ['file-info', filename],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/files/${filename}`);
      return data.data || data;
    },
    enabled: !!filename,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axios.post('/api/v1/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async (filename: string) => {
      const { data } = await axios.get(`/api/v1/files/download/${filename}`, { responseType: 'blob' });
      return data;
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (filename: string) => {
      const { data } = await axios.delete(`/api/v1/files/${filename}/delete`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
} 