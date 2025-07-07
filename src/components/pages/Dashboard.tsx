import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/api/useAuth';
import { useListTickets } from '@/hooks/api/useTickets';
import { useListUsers } from '@/hooks/api/useUsers';
import { useListProducts } from '@/hooks/api/useProducts';
import { useListFAQs } from '@/hooks/api/useFAQ';
import { useListArticles } from '@/hooks/api/useKnowledgeBase';

interface DashboardData {
  metrics: {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    totalUsers: number;
    totalFAQs: number;
    totalKBArticles: number;
  };
  recentActivity: {
    recentTickets: any[];
    recentUsers: any[];
    pendingApprovals: any[];
  };
  quickActions: Array<{
    action: string;
    url: string;
  }>;
  role: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data based on user role
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard', user?.role, selectedProduct],
    queryFn: async () => {
      const endpoint = user?.role === 'ADMIN' ? '/admin' : 
                      user?.role === 'DEVELOPER' ? '/developer' : '/user';
      const { data } = await axios.get(`/api/v1/dashboard${endpoint}`, {
        params: { productId: selectedProduct }
      });
      return data.data as DashboardData;
    },
    enabled: !!user?.role,
  });

  // Additional data queries
  const { data: tickets } = useListTickets({ productId: selectedProduct, page: 0, size: 5 });
  const { data: users } = useListUsers({ page: 0, size: 5 });
  const { data: products } = useListProducts();
  const { data: faqs } = useListFAQs();
  const { data: articles } = useListArticles({ productId: selectedProduct, page: 0, size: 5 });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load dashboard data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name} ({user?.role})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{user?.role}</Badge>
        </div>
      </div>

      <Separator />

      {/* Product Selector */}
      {products && (
        <Card>
          <CardHeader>
            <CardTitle>Select Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {products.content?.map((product: any) => (
                <Button
                  key={product.id}
                  variant={selectedProduct === product.id ? "default" : "outline"}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  {product.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab dashboardData={dashboardData} />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <TicketsTab tickets={tickets} />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UsersTab users={users} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ dashboardData?: DashboardData }> = ({ dashboardData }) => {
  if (!dashboardData) return null;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tickets"
          value={dashboardData.metrics.totalTickets}
          description="All tickets in the system"
          icon="🎫"
        />
        <MetricCard
          title="Open Tickets"
          value={dashboardData.metrics.openTickets}
          description="Tickets awaiting response"
          icon="📝"
        />
        <MetricCard
          title="In Progress"
          value={dashboardData.metrics.inProgressTickets}
          description="Tickets being worked on"
          icon="⚡"
        />
        <MetricCard
          title="Resolved"
          value={dashboardData.metrics.resolvedTickets}
          description="Successfully resolved tickets"
          icon="✅"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardData.quickActions.map((action, index) => (
              <Button key={index} variant="outline" className="h-20 flex-col">
                <span className="text-lg">{action.action}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTickets tickets={dashboardData.recentActivity.recentTickets} />
        <RecentUsers users={dashboardData.recentActivity.recentUsers} />
      </div>
    </div>
  );
};

// Tickets Tab Component
const TicketsTab: React.FC<{ tickets?: any }> = ({ tickets }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
        <CardDescription>Latest tickets in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.content?.map((ticket: any) => (
              <TableRow key={ticket.id}>
                <TableCell>#{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <Badge variant={ticket.status === 'OPEN' ? 'default' : 'secondary'}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={ticket.priority === 'HIGH' ? 'destructive' : 'outline'}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Users Tab Component
const UsersTab: React.FC<{ users?: any }> = ({ users }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>Latest registered users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.content?.map((user: any) => (
            <div key={user.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="outline">{user.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>System performance and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground">Analytics charts will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: number;
  description: string;
  icon: string;
}> = ({ title, value, description, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Recent Tickets Component
const RecentTickets: React.FC<{ tickets: any[] }> = ({ tickets }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets?.slice(0, 5).map((ticket: any) => (
            <div key={ticket.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{ticket.subject}</p>
                <p className="text-sm text-muted-foreground">#{ticket.id}</p>
              </div>
              <Badge variant={ticket.status === 'OPEN' ? 'default' : 'secondary'}>
                {ticket.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Recent Users Component
const RecentUsers: React.FC<{ users: any[] }> = ({ users }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.slice(0, 5).map((user: any) => (
            <div key={user.id} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 