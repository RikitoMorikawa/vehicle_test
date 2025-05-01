import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-full mx-2 px-2 sm:px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center text-xl font-semibold text-gray-900">
            車両販売プラットフォーム
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center text-gray-700 hover:text-gray-900">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  <Link to="/account-settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <Settings className="h-4 w-4 mr-2" />
                    アカウント設定
                  </Link>
                  <button onClick={signOut} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <LogOut className="h-4 w-4 mr-2" />
                    サインアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
