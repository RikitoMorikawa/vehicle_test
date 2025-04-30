import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hourglass } from 'lucide-react';

const PendingApproval: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.is_approved) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 rounded-full p-3">
            <Hourglass className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          承認待ち
        </h1>
        <p className="text-slate-600 mb-6">
          アカウントは現在承認待ちの状態です。管理者による承認をお待ちください。
          承認後、ログインが可能になります。
        </p>
        <div className="text-sm text-slate-500">
          ご不明な点がございましたら、管理者にお問い合わせください。
        </div>
      </div>
    </div>
  );
}

export default PendingApproval;