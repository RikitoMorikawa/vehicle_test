import React from 'react';
import { LogOut, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Layers className="h-8 w-8 text-teal-600 mr-2" />
            <span className="text-xl font-semibold text-slate-900">MyApp</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-slate-600 hidden sm:inline-block">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Sign out</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;