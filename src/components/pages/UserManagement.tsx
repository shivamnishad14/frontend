import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useListUsers, 
  useGetUser, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  useUpdateUserRole,
  useSearchUsers,
  useToggleActive,
  useApproveAdmin,
  useRejectAdmin,
  usePendingAdmins
} from '@/hooks/api/useUsers';
import { useListProducts } from '@/hooks/api/useProducts';
import { useAuth } from '@/hooks/api/useAuth';

interface UserFormData {
  name: string;
  email: string;
  role: string;
  productId: number;
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  // Queries
  const { data: users, isLoading } = useListUsers({
    page: currentPage,
    size: pageSize
  });

  const { data: searchResults } = useSearchUsers({
    query: searchQuery,
    role: roleFilter,
    page: currentPage,
    size: pageSize
  });

  const { data: pendingAdmins } = usePendingAdmins();
  const { data: products } = useListProducts();

  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();
  const toggleActive = useToggleActive();
  const approveAdmin = useApproveAdmin();
  const rejectAdmin = useRejectAdmin();

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'USER',
    productId: selectedProduct
  });

  const [roleData, setRoleData] = useState({
    role: ''
  });

  // Handlers
  const handleCreateUser = async () => {
    try {
      await createUser.mutateAsync(formData);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        role: 'USER',
        productId: selectedProduct
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await updateUser.mutateAsync({
        userId: selectedUser.id,
        user: formData
      });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      await updateRole.mutateAsync({
        userId: selectedUser.id,
        role: roleData.role
      });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setIsRoleDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (userId: number) => {
    try {
      await toggleActive.mutateAsync(userId);
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const handleApproveAdmin = async (userId: number) => {
    try {
      await approveAdmin.mutateAsync(userId);
      toast({
        title: "Success",
        description: "Admin approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve admin",
        variant: "destructive",
      });
    }
  };

  const handleRejectAdmin = async (userId: number) => {
    try {
      await rejectAdmin.mutateAsync(userId);
      toast({
        title: "Success",
        description: "Admin rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject admin",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser.mutateAsync(userId);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'DEVELOPER': return 'default';
      case 'USER': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const displayUsers = searchQuery || roleFilter ? searchResults : users;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New User
        </Button>
      </div>

      <Separator />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="DEVELOPER">Developer</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setRoleFilter('');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="pending">Pending Admins</TabsTrigger>
          <TabsTrigger value="active">Active Users</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Users</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <UsersTable 
            users={displayUsers}
            isLoading={isLoading}
            onEdit={(user) => {
              setSelectedUser(user);
              setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                productId: user.productId
              });
              setIsEditDialogOpen(true);
            }}
            onRole={(user) => {
              setSelectedUser(user);
              setRoleData({ role: user.role });
              setIsRoleDialogOpen(true);
            }}
            onToggleActive={handleToggleActive}
            onApproveAdmin={handleApproveAdmin}
            onRejectAdmin={handleRejectAdmin}
            onDelete={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <UsersTable 
            users={pendingAdmins}
            isLoading={false}
            onEdit={() => {}}
            onRole={() => {}}
            onToggleActive={() => {}}
            onApproveAdmin={handleApproveAdmin}
            onRejectAdmin={handleRejectAdmin}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <UsersTable 
            users={displayUsers?.content?.filter((u: any) => u.isActive)}
            isLoading={false}
            onEdit={() => {}}
            onRole={() => {}}
            onToggleActive={() => {}}
            onApproveAdmin={() => {}}
            onRejectAdmin={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <UsersTable 
            users={displayUsers?.content?.filter((u: any) => !u.isActive)}
            isLoading={false}
            onEdit={() => {}}
            onRole={() => {}}
            onToggleActive={() => {}}
            onApproveAdmin={() => {}}
            onRejectAdmin={() => {}}
            onDelete={() => {}}
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {displayUsers && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: displayUsers.totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(displayUsers.totalPages - 1, currentPage + 1))}
                className={currentPage === displayUsers.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            formData={formData}
            setFormData={setFormData}
            products={products?.content}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={createUser.isLoading}>
              {createUser.isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            formData={formData}
            setFormData={setFormData}
            products={products?.content}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={updateUser.isLoading}>
              {updateUser.isLoading ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Change the user's role and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role</Label>
              <Select value={roleData.role} onValueChange={(value) => setRoleData({ role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="DEVELOPER">Developer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateRole.isLoading}>
              {updateRole.isLoading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// User Form Component
const UserForm: React.FC<{
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  products?: any[];
}> = ({ formData, setFormData, products }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter full name"
        />
      </div>
      
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
        />
      </div>
      
      <div>
        <Label>Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="DEVELOPER">Developer</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Product</Label>
        <Select value={formData.productId.toString()} onValueChange={(value) => setFormData({ ...formData, productId: Number(value) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {products?.map((product: any) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Users Table Component
const UsersTable: React.FC<{
  users?: any;
  isLoading: boolean;
  onEdit: (user: any) => void;
  onRole: (user: any) => void;
  onToggleActive: (userId: number) => void;
  onApproveAdmin: (userId: number) => void;
  onRejectAdmin: (userId: number) => void;
  onDelete: (userId: number) => void;
}> = ({ users, isLoading, onEdit, onRole, onToggleActive, onApproveAdmin, onRejectAdmin, onDelete }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          {users?.totalElements || users?.length || 0} users found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.content?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">#{user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={() => onToggleActive(user.id)}
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onRole(user)}>
                      Role
                    </Button>
                    {user.status === 'pending' && user.role === 'ADMIN' && (
                      <>
                        <Button size="sm" variant="default" onClick={() => onApproveAdmin(user.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onRejectAdmin(user.id)}>
                          Reject
                        </Button>
                      </>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(user.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement; 