import React, { createContext, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { supabase } from "../lib/supabase";
import { AuthContextType, AuthState, User } from "../types/auth";

// AuthContextを名前付きエクスポートとして公開
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

const TOKEN_COOKIE_NAME = "auth_token";
const TOKEN_EXPIRY_MINUTES = 720; // 12時間
const CHECK_INTERVAL = 3600; // 1時間ごとにチェック

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 初期セッションチェック
  useEffect(() => {
    getSession();
  }, []);

  // ログアウトタイマーのセットアップ
  useEffect(() => {
    if (state.user) {
      // 既存のタイマーをクリア
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }

      // 新しいタイマーをセット
      logoutTimerRef.current = setTimeout(() => {
        console.log("セッション期限切れのためログアウトします");
        signOut();
      }, TOKEN_EXPIRY_MINUTES * 60 * 1000);

      // バックグラウンドチェックも設定
      const intervalId = setInterval(() => {
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        if (!token && state.user) {
          console.log("Cookieが見つかりません。ログアウトします");
          signOut();
        }
      }, CHECK_INTERVAL * 1000);

      return () => {
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
        }
        clearInterval(intervalId);
      };
    }
  }, [state.user]);

  const getSession = async () => {
    try {
      const token = Cookies.get(TOKEN_COOKIE_NAME);

      if (!token) {
        setState({
          ...initialState,
          loading: false,
        });
        return;
      }

      const { data: user, error } = await supabase.from("users").select("*").eq("id", token).single();

      if (error || !user) {
        Cookies.remove(TOKEN_COOKIE_NAME);
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
      Cookies.remove(TOKEN_COOKIE_NAME);
      setState({
        ...initialState,
        loading: false,
      });
    }
  };

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

      // 既存のCookieをクリア（念のため）
      Cookies.remove(TOKEN_COOKIE_NAME);

      // 新しいCookieを設定
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + TOKEN_EXPIRY_MINUTES);

      Cookies.set(TOKEN_COOKIE_NAME, data.id, {
        expires: expiryDate,
        secure: true,
        sameSite: "strict",
      });

      setState({
        user: data,
        session: { user: data },
        loading: false,
      });

      // コンソールに有効期限表示
      console.log(`セッション有効期限: ${expiryDate.toLocaleTimeString()}`);

      return { error: null, needsApproval: false };
    } catch (error) {
      console.error("Error during sign in:", error);
      return { error: { message: "予期せぬエラーが発生しました" } };
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<User, "id" | "role">) => {
    try {
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).maybeSingle();

      if (existingUser) {
        return { error: { message: "このメールアドレスは既に登録されています" } };
      }

      const { error } = await supabase
        .from("users")
        .insert([{ ...userData, password, role: "user" }])
        .select()
        .single();

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error during sign up:", error);
      return { error: { message: "予期せぬエラーが発生しました" } };
    }
  };

  const signOut = async () => {
    // Cookieを確実に削除
    document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
    Cookies.remove(TOKEN_COOKIE_NAME);

    // タイマーをクリア
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    setState({
      user: null,
      session: null,
      loading: false,
    });

    console.log("ログアウト完了");
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
