// src/server/admin/loan-review/handler_000.ts
import { supabase } from "../../../lib/supabase";
import { LoanApplication } from "../../../types/admin/loan-review/page";

interface LoanApplicationsWithPagination {
  applications: LoanApplication[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export const loanReviewHandler = {
  async fetchLoanApplications(page: number = 1, itemsPerPage: number = 10): Promise<LoanApplicationsWithPagination> {
    // 総件数を取得
    const { count, error: countError } = await supabase.from("loan_applications").select("*", { count: "exact", head: true });

    if (countError) throw countError;

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (page - 1) * itemsPerPage;

    // ページネーション対応のデータ取得
    const { data, error } = await supabase
      .from("loan_applications")
      .select(
        `
        *,
        vehicle:vehicles(name)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + itemsPerPage - 1);

    if (error) throw error;

    const applications = data.map((application) => ({
      ...application,
      vehicle_name: application.vehicle?.name || "Unknown",
    }));

    return {
      applications,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage,
    };
  },

  async fetchLoanApplicationById(id: string): Promise<LoanApplication> {
    const { data, error } = await supabase
      .from("loan_applications")
      .select(
        `
        *,
        vehicle:vehicles(name, maker)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return {
      ...data,
      vehicle_name: data.vehicle?.name || "Unknown",
      vehicle_maker: data.vehicle?.maker || "Unknown",
    };
  },

  async updateLoanStatus(applicationId: string, status: number): Promise<void> {
    const { error } = await supabase.from("loan_applications").update({ status }).eq("id", applicationId);

    if (error) throw error;
  },
};
