export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'product_admin' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  logo?: string;
  supportEmail: string;
  sla: {
    responseTime: number; // in hours
    resolutionTime: number; // in hours
  };
  settings: {
    allowPublicTickets: boolean;
    requireAuthentication: boolean;
    autoAssignTickets: boolean;
  };
  admins: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  productId: string;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  productId: string;
  author: User;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAnalytics {
  productId: string;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResponseTime: number; // in hours
  averageResolutionTime: number; // in hours
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  ticketsByStatus: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'product' | 'ticket' | 'user' | 'knowledge_base';
  entityId: string;
  userId: string;
  changes: Record<string, any>;
  timestamp: string;
} 