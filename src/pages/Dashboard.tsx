import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { CheckCircle2, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white shadow-sm rounded-lg p-6 animate-fade-in">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Welcome to your dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                You've successfully signed in to your account.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Authenticated
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Your account information
            </h2>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-teal-100 rounded-full">
                  <User className="h-5 w-5 text-teal-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-700">User ID</h3>
                  <p className="mt-1 text-sm text-slate-500 break-all">{user?.id}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-start">
                <div className="flex-shrink-0 p-2 bg-teal-100 rounded-full">
                  <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-700">Email</h3>
                  <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-slate-500">
              This is your protected dashboard. Only authenticated users can access this page.
              You can add more content and features to this page as your application grows.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;