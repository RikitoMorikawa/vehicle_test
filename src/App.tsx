import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import VehicleListPage from "./pages/vehicle-list/page";
import AdminDashboardPage from "./pages/admin/dashboard/page";
import EditUserPage from "./pages/admin/edit-user/page";
import LoanReviewPage from "./pages/admin/loan-review/page";
import AccountSettingsPage from "./pages/account-settings/page";
import FavoritesContainer from "./containers/favorites/page";
import ReportsContainer from "./containers/reports/page";
import AuthPageContainer from "./containers/auth/page";
import VehicleDetailPage from "./pages/vehicle-detail/page";
import VehicleRegisterPage from "./pages/vehicle-register/page";
import VehicleEditPage from "./pages/vehicle-edit/page";
import LoanApplicationPage from "./pages/loan-application/page";
import { JSX } from "react/jsx-runtime";

// ProtectedRouteをラップするヘルパー関数
const createProtectedRoute = (
  element: string | number | boolean | JSX.Element | Iterable<React.ReactNode> | null | undefined,
  allowedRoles: string[],
  requireApproval: boolean | undefined
) => ({
  element: (
    <ProtectedRoute allowedRoles={allowedRoles} requireApproval={requireApproval}>
      {element}
    </ProtectedRoute>
  ),
});

// ルート設定
const routes = [
  {
    path: "/login",
    element: <AuthPageContainer />,
  },
  {
    path: "/vehicles",
    ...createProtectedRoute(<VehicleListPage />, ["user", "admin"], true),
  },
  {
    path: "/admin/vehicles/new",
    ...createProtectedRoute(<VehicleRegisterPage />, ["admin"], false),
  },
  {
    path: "/admin/vehicles/:id/edit",
    ...createProtectedRoute(<VehicleEditPage />, ["admin"], false),
  },
  {
    path: "/vehicle/:id",
    ...createProtectedRoute(<VehicleDetailPage />, ["user", "admin"], true),
  },
  {
    path: "/admin",
    ...createProtectedRoute(<AdminDashboardPage />, ["admin"], false),
  },
  {
    path: "/admin/users/:id/edit",
    ...createProtectedRoute(<EditUserPage />, ["admin"], false),
  },
  {
    path: "/admin/loan-review",
    ...createProtectedRoute(<LoanReviewPage />, ["admin"], false),
  },
  {
    path: "/account-settings",
    ...createProtectedRoute(<AccountSettingsPage />, ["user", "admin"], true),
  },
  {
    path: "/favorites",
    ...createProtectedRoute(<FavoritesContainer />, ["user", "admin"], true),
  },
  {
    path: "/reports",
    ...createProtectedRoute(<ReportsContainer />, ["user", "admin"], true),
  },
  {
    path: "/loan-application/:vehicleId",
    ...createProtectedRoute(<LoanApplicationPage />, ["user", "admin"], true),
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
