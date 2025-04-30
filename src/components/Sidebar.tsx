import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Heart, FileText, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { to: '/dashboard', icon: <Search className="w-5 h-5" />, label: '車両検索' },
    { to: '/favorites', icon: <Heart className="w-5 h-5" />, label: 'お気に入り一覧' },
    { to: '/reports', icon: <FileText className="w-5 h-5" />, label: '帳票管理' },
    ...(isAdmin ? [
      { to: '/admin', icon: <Users className="w-5 h-5" />, label: 'ユーザー管理' }
    ] : [])
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 ${
                    isActive ? 'bg-red-50 text-red-700' : ''
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;