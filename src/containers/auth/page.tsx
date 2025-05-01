// src/containers/auth/page.tsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthMode } from "../../types/enum";
import AuthContainer from "../../components/auth/page";

// メインのAuthページコンテナ
const AuthPageContainer: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  return <AuthContainer mode={mode} onModeChange={handleModeChange} />;
};

export default AuthPageContainer;
