import React from 'react';
import { Layers } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  description 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 mb-4">
                <Layers className="h-6 w-6 text-teal-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
              {description && (
                <p className="text-slate-500">{description}</p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;