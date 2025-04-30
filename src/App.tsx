import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/AuthPage';
import VehicleListPage from './pages/VehicleList/page';
import AdminDashboardPage from './pages/admin/dashboard/page';
import EditUserPage from './pages/admin/edit-user/page';
import AccountSettingsPage from './pages/account-settings/page';
import FavoritesContainer from './containers/favorites/page';
import ReportsContainer from './containers/reports/page';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']} requireApproval={true}>
                <VehicleListPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']} requireApproval={false}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/users/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['admin']} requireApproval={false}>
                <EditUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-settings"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']} requireApproval={true}>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']} requireApproval={true}>
                <FavoritesContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']} requireApproval={true}>
                <ReportsContainer />
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