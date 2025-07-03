// src/types/admin/dashboard/page.ts
import { User } from "../../auth/page";

// ページネーション対応のクエリ結果
export interface UsersQueryResult {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  error: Error | null;
}
