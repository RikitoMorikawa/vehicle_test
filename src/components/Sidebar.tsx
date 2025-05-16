import React from "react";
import { NavLink } from "react-router-dom";
import { Search, Heart, FileText, Users, PlusCircle, CreditCard } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const navItems = [
    { to: "/vehicles", icon: <Search className="w-5 h-5" />, label: "車両検索", exact: false },
    { to: "/favorites", icon: <Heart className="w-5 h-5" />, label: "お気に入り一覧", exact: true },
    { to: "/reports", icon: <FileText className="w-5 h-5" />, label: "帳票管理", exact: true },
    ...(isAdmin
      ? [
          { to: "/admin", icon: <Users className="w-5 h-5" />, label: "ユーザー管理", exact: true },
          { to: "/admin/loan-review", icon: <CreditCard className="w-5 h-5" />, label: "ローン審査", exact: true },
          { to: "/admin/vehicles/new", icon: <PlusCircle className="w-5 h-5" />, label: "車両登録", exact: true },
        ]
      : []),
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 ${isActive ? "bg-red-50 text-red-700" : ""}`
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
