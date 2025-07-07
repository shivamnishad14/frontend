import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Ticket, 
  BookOpen, 
  Users, 
  Settings, 
  BarChart3,
  LogOut,
  UserCheck,
  ClipboardList
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { authAPI } from '../../services/api';

const getNavigation = () => {
  const userRole = localStorage.getItem('userRole');
  
  const baseNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Help Center', href: '/help-center', icon: Ticket },
  ];

  // Admin/Manager specific navigation
  if (userRole === 'admin' || userRole === 'product_admin') {
    baseNavigation.unshift({ name: 'Admin Dashboard', href: '/admin-dashboard', icon: LayoutDashboard });
    baseNavigation.push(
      { name: 'Ticket Management', href: '/tickets/dashboard', icon: ClipboardList },
      { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
      { name: 'Manage FAQs & KB', href: '/admin-faq-kb', icon: BookOpen },
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Settings', href: '/settings', icon: Settings }
    );
  }

  // Developer/Agent specific navigation
  if (userRole === 'agent' || userRole === 'admin' || userRole === 'product_admin') {
    baseNavigation.push(
      { name: 'My Tickets', href: '/tickets/my-tickets', icon: UserCheck }
    );
  }

  // Super Admin navigation
  if (userRole === 'super_admin' || userRole === 'SUPER_ADMIN') {
    baseNavigation.unshift({ name: 'Super Admin Dashboard', href: '/super-admin', icon: LayoutDashboard });
    baseNavigation.splice(1, 0, { name: 'Manage FAQs & KB', href: '/admin-faq-kb', icon: BookOpen });
  }

  return baseNavigation;
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 transform bg-background shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-border px-4">
            <h1 className="text-xl font-bold text-foreground">HelpDesk Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {getNavigation().map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Admin User
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@example.com
                </p>
              </div>
            </div>
            <button className="mt-3 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 