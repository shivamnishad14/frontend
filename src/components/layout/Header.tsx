import React, { useState } from 'react';
import { Menu, Bell, Search, LogOut, User, ChevronDown, HelpCircle, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { authAPI } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get current user from localStorage instead of API call
  const getCurrentUser = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  };
  
  const currentUser = getCurrentUser();
  const userRole = localStorage.getItem('userRole');

  // Theme switcher logic
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Search and Help Center */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {/* Help Center Link */}
        <Link
          to="/help-center"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help Center</span>
        </Link>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setIsDark(d => !d)}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User menu */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser?.email || 'user@example.com'}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {(currentUser?.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-50 border border-border">
              <div className="px-4 py-2 text-sm text-foreground border-b border-border">
                <p className="font-medium">{currentUser?.name || 'User'}</p>
                <p className="text-gray-500">{userRole || 'USER'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 