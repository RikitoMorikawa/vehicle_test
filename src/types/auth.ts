export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email?: string;
  company_name?: string;
  user_name?: string;
  phone?: string;
  role?: string;
  is_approved?: boolean;
}

export interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any; needsApproval?: boolean }>;
  signUp: (email: string, password: string, userData: Omit<User, 'id' | 'role' | 'is_approved'>) => Promise<{ error: any }>;
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