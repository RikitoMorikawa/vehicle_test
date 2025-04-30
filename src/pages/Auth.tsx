import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register'
}

const Auth: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          車両販売プラットフォーム
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">
            {mode === AuthMode.LOGIN ? 'ログイン' : '新規加盟店登録'}
          </h1>

          {mode === AuthMode.LOGIN ? (
            <>
              <LoginForm />
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">新規加盟店登録は</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setMode(AuthMode.REGISTER)}
                    className="text-red-600 hover:text-red-500 font-medium"
                  >
                    こちら
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <RegisterForm />
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">既にアカウントをお持ちの方は</span>{' '}
                <button
                  type="button"
                  onClick={() => setMode(AuthMode.LOGIN)}
                  className="text-red-600 hover:text-red-500 font-medium"
                >
                  ログイン
                </button>
              </div>
            </>
          )}
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          車両販売サイト会員専用ログインページ
        </p>
      </div>
    </div>
  );
};

export default Auth;