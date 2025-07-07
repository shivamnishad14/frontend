import axios from 'axios';
import { Product, User, Ticket, KnowledgeBaseArticle } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Handle successful login response
    if (response.config.url?.includes('/auth/login') && response.data.success) {
      const { token, role, user } = response.data.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userInfo', JSON.stringify(user));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  logout: () => 
    api.post('/auth/logout'),
  getCurrentUser: () => 
    api.get('/auth/me'),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  // Helper methods
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  hasRole: (role: string) => {
    const userRole = localStorage.getItem('userRole');
    return userRole === role;
  },
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
  }
};

// Product API
export const productAPI = {
  getAll: (pageable?: any) => 
    api.get<{ content: Product[], totalElements: number, totalPages: number }>('/products/list', { params: pageable }),
  getById: (id: string) => 
    api.get<Product>(`/products/${id}`),
  create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Product>('/products/create', product),
  update: (id: string, product: Partial<Product>) => 
    api.put<Product>(`/products/${id}/update`, product),
  delete: (id: string) => 
    api.delete(`/products/${id}/delete`),
  search: (query?: string, category?: string, pageable?: any) => 
    api.get<{ content: Product[], totalElements: number, totalPages: number }>('/products/search', { 
      params: { query, category, ...pageable } 
    }),
  updateStatus: (id: string, status: string) => 
    api.put<Product>(`/products/${id}/status`, null, { params: { status } }),
};

// User API
export const userAPI = {
  getAll: (productId: string, pageable?: any) => 
    api.get<{ content: User[], totalElements: number, totalPages: number }>('/users/list', { 
      params: { productId, ...pageable } 
    }),
  getById: (id: string) => 
    api.get<User>(`/users/${id}`),
  create: (productId: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<User>('/users/create', user, { params: { productId } }),
  update: (id: string, user: Partial<User>) => 
    api.put<User>(`/users/${id}/update`, user),
  delete: (id: string) => 
    api.delete(`/users/${id}/delete`),
  search: (productId: string, query?: string, role?: string, pageable?: any) => 
    api.get<{ content: User[], totalElements: number, totalPages: number }>('/users/search', { 
      params: { productId, query, role, ...pageable } 
    }),
  updateRole: (id: string, role: string) => 
    api.put<User>(`/users/${id}/role`, null, { params: { role } }),
  getPendingAdmins: () => api.get('/users/pending-admins'),
  approveAdmin: (id: string) => api.post(`/users/approve-admin/${id}`),
  rejectAdmin: (id: string) => api.post(`/users/reject-admin/${id}`),
  toggleActive: (id: string) => api.post(`/users/toggle-active/${id}`),
};

// Ticket API
export const ticketAPI = {
  getAll: (productId: string, pageable?: any) => 
    api.get<{ content: Ticket[], totalElements: number, totalPages: number }>('/tickets/list', { 
      params: { productId, ...pageable } 
    }),
  getById: (id: string) => 
    api.get<Ticket>(`/tickets/${id}`),
  create: (productId: string, userId: string, ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Ticket>('/tickets/create', ticket, { params: { productId, userId } }),
  update: (id: string, ticket: Partial<Ticket>) => 
    api.put<Ticket>(`/tickets/${id}/update`, ticket),
  delete: (id: string) => 
    api.delete(`/tickets/${id}/delete`),
  addComment: (ticketId: string, userId: string, comment: { content: string }) => 
    api.post(`/tickets/${ticketId}/comments/add`, comment, { params: { userId } }),
  getComments: (ticketId: string, pageable?: any) => 
    api.get<{ content: any[], totalElements: number, totalPages: number }>(`/tickets/${ticketId}/comments`, { 
      params: pageable 
    }),
  updateStatus: (ticketId: string, status: string) => 
    api.put<Ticket>(`/tickets/${ticketId}/status`, null, { params: { status } }),
  search: (productId: string, query?: string, status?: string, pageable?: any) => 
    api.get<{ content: Ticket[], totalElements: number, totalPages: number }>('/tickets/search', { 
      params: { productId, query, status, ...pageable } 
    }),
  publicCreate: (data: { email: string; subject: string; description: string; priority: string; productId: string }) =>
    api.post('/tickets/public-create', data),
};

// Knowledge Base API
export const knowledgeBaseAPI = {
  getAll: (productId: string, pageable?: any) => 
    api.get<{ content: KnowledgeBaseArticle[], totalElements: number, totalPages: number }>('/knowledge-base/articles/list', { 
      params: { productId, ...pageable } 
    }),
  getById: (id: string) => 
    api.get<KnowledgeBaseArticle>(`/knowledge-base/articles/${id}`),
  create: (article: Omit<KnowledgeBaseArticle, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<KnowledgeBaseArticle>('/knowledge-base/articles/create', article),
  update: (id: string, article: Partial<KnowledgeBaseArticle>) => 
    api.put<KnowledgeBaseArticle>(`/knowledge-base/articles/${id}/update`, article),
  delete: (id: string) => 
    api.delete(`/knowledge-base/articles/${id}/delete`),
  search: (productId: string, query: string, category?: string, pageable?: any) => 
    api.get<{ content: KnowledgeBaseArticle[], totalElements: number, totalPages: number }>('/knowledge-base/articles/search', { 
      params: { productId, query, category, ...pageable } 
    }),
  getCategories: (productId: string) => 
    api.get<string[]>(`/knowledge-base/articles/categories`, { params: { productId } }),
  publish: (articleId: string, published: boolean) => 
    api.put<KnowledgeBaseArticle>(`/knowledge-base/articles/${articleId}/publish`, null, { 
      params: { published } 
    }),
};

// AI API
export const aiAPI = {
  ask: (question: string, productId: string) => 
    api.post('/ai/ask', null, { params: { question, productId } }),
  analyzeTicket: (ticketId: string, productId: string) => 
    api.post('/ai/analyze-ticket', null, { params: { ticketId, productId } }),
  generateResponse: (ticketId: string, productId: string, responseType: string) => 
    api.post('/ai/generate-response', null, { params: { ticketId, productId, responseType } }),
  searchKnowledge: (query: string, productId: string) => 
    api.post('/ai/search-knowledge', null, { params: { query, productId } }),
  getStatus: () => 
    api.get('/ai/status'),
};

// File API
export const fileAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  download: (filename: string) => 
    api.get(`/files/download/${filename}`, { responseType: 'blob' }),
  getInfo: (filename: string) => 
    api.get(`/files/${filename}`),
  delete: (filename: string) => 
    api.delete(`/files/${filename}/delete`),
  list: () => 
    api.get('/files/list'),
};

export default api; 