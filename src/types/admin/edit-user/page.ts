// src/types/admin/edit-user/page.ts
import { User } from "../../auth/page";

export interface UserQueryResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UserFormData {
  company_name: string;
  user_name: string;
  phone: string;
  email: string;
  password?: string;
  currentPassword?: string;
  is_approved: boolean;
}

export interface UpdateUserData {
  company_name: string;
  user_name: string;
  phone: string;
  email: string;
  password?: string;
  is_approved: boolean;
}