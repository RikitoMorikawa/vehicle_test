import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requireApproval?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, requireApproval = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-slate-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 承認が必要で、まだ承認されていない場合
  if (requireApproval && !user.is_approved) {
    return <Navigate to="/pending-approval" replace />;
  }

  // ユーザーのロールが許可されているロールに含まれているか確認
  if (!allowedRoles.includes(user.role || "")) {
    // adminの場合は管理者ページへ、それ以外はダッシュボードへリダイレクト
    return <Navigate to={user.role === "admin" ? "/admin" : "/vehicles"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
