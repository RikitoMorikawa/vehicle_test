import type { User } from "../auth/page";

export interface AccountQueryResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateProfileData {
  id: string;
  company_name: string;
  user_name: string;
  phone: string;
  email: string;
}

export interface UpdatePasswordData {
  id: string;
  currentPassword: string;
  newPassword: string;
}