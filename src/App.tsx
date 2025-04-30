import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import VehicleList from './pages/VehicleList';
import AdminDashboard from './pages/AdminDashboard';
import EditUser from './pages/EditUser';
import AccountSettings from './pages/AccountSettings';
import Favorites from './pages/Favorites';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']} requireApproval={true}>
                <VehicleList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']} requireApproval={false}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/users/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['admin']} requireApproval={false}>
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-settings"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']} requireApproval={true}>
                <AccountSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']} requireApproval={true}>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']} requireApproval={true}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;