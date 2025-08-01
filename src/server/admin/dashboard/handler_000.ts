// src/server/admin/dashboard/handler_000.ts
import { supabase } from "../../../lib/supabase";
import type { User } from "../../../types/auth/page";

interface UsersWithPagination {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export const adminDashboardHandler = {
  async fetchUsers(page: number = 1, itemsPerPage: number = 10): Promise<UsersWithPagination> {
    // 総件数を取得
    const { count, error: countError } = await supabase.from("users").select("*", { count: "exact", head: true });

    if (countError) throw countError;

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (page - 1) * itemsPerPage;

    // ページネーション対応のデータ取得
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("role", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + itemsPerPage - 1);

    if (error) throw error;

    // 管理者を優先してソート
    const sortedUsers = (data || []).sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return 0;
    });

    return {
      users: sortedUsers,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage,
    };
  },
};
