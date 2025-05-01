export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email?: string;
  password?: string;
  company_name?: string;
  user_name?: string;
  phone?: string;
  role?: string;
  is_approved?: boolean;
}

// `any`型を避けた定義
export interface Session {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  user?: User;
  // 必要に応じて他のセッション関連のプロパティを追加
}

export interface AuthState {
  user: User | null;
  // `any`を具体的な型に変更
  session: Session | null;
  loading: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
  // 必要に応じて他のエラー関連のプロパティを追加
}

export interface AuthContextType extends AuthState {
  // `any`型をより具体的な型に変更
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; needsApproval?: boolean }>;
  signUp: (email: string, password: string, userData: Omit<User, "id" | "role" | "is_approved">) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

export interface AuthFormData {
  email: string;
  password: string;
  company_name?: string;
  user_name?: string;
  phone?: string;
}

export interface FormError {
  email?: string;
  password?: string;
  company_name?: string;
  user_name?: string;
  phone?: string;
  general?: string;
}
