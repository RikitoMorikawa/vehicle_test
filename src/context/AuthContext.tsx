// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AuthContextType, AuthState, User } from "../types/auth";


// コンテキストをエクスポート（useAuthフックから使用できるように）
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const getSession = async () => {
      try {
        const userEmail = localStorage.getItem("user-email");

        if (!userEmail) {
          setState({
            ...initialState,
            loading: false,
          });
          return;
        }

        const { data: user, error } = await supabase.from("users").select("*").eq("email", userEmail).single();

        if (error || !user) {
          localStorage.removeItem("user-email");
          setState({
            ...initialState,
            loading: false,
          });
          return;
        }

        setState({
          user,
          session: { user },
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching session:", error);
        localStorage.removeItem("user-email");
        setState({
          ...initialState,
          loading: false,
        });
      }
    };

    getSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error: queryError } = await supabase.from("users").select("*").eq("email", email).eq("password", password).maybeSingle();

      if (queryError) {
        return { error: { message: "予期せぬエラーが発生しました" } };
      }

      if (!data) {
        return { error: { message: "メールアドレスまたはパスワードが正しくありません" } };
      }

      if (data.role !== "admin" && !data.is_approved) {
        return { needsApproval: true, error: null };
      }

      localStorage.setItem("user-email", email);

      setState({
        user: data,
        session: { user: data },
        loading: false,
      });

      return { error: null, needsApproval: false };
    } catch (error) {
      console.error("Error during signIn:", error);
      return { error: { message: "予期せぬエラーが発生しました" } };
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<User, "id" | "role">) => {
    try {
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).maybeSingle();

      if (existingUser) {
        return { error: { message: "このメールアドレスは既に登録されています" } };
      }

      const { data: error } = await supabase
        .from("users")
        .insert([{ ...userData, password, role: "user" }])
        .select()
        .single();

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error during signUp:", error);
      return { error: { message: "予期せぬエラーが発生しました" } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("user-email");
    setState({
      user: null,
      session: null,
      loading: false,
    });
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
