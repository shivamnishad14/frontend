import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register'
import Unauthorized from './pages/Unauthorized';
import HelpCenter from './pages/HelpCenter';
import Landing from './pages/Landing';
import TicketDashboard from './pages/TicketDashboard';
import MyTickets from './pages/MyTickets';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminFAQKB from './pages/AdminFAQKB';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tickets" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Tickets</h1>
                  <p>Coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/knowledge-base" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Knowledge Base</h1>
                  <p>Coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Users</h1>
                  <p>Coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Analytics</h1>
                  <p>Coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <p>Coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tickets/dashboard" element={<ProtectedRoute roles={['admin', 'product_admin']}><TicketDashboard /></ProtectedRoute>} />
          <Route path="/tickets/my-tickets" element={<ProtectedRoute roles={['agent', 'admin', 'product_admin']}><MyTickets /></ProtectedRoute>} />
          <Route path="/super-admin" element={<ProtectedRoute roles={['SUPER_ADMIN', 'super_admin']}>
          <Layout>
            <SuperAdminDashboard />
            </Layout>
            </ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute roles={['admin', 'product_admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-faq-kb" element={<ProtectedRoute roles={['admin', 'product_admin', 'SUPER_ADMIN', 'super_admin']}><AdminFAQKB /></ProtectedRoute>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
