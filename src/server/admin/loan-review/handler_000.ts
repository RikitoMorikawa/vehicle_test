// src/server/admin/loan-review/handler_000.ts
import { supabase } from "../../../lib/supabase";
import { LoanApplication } from "../../../types/admin/loan-review/page";

export const loanReviewHandler = {
  async fetchLoanApplications(): Promise<LoanApplication[]> {
    const { data, error } = await supabase
      .from("loan_applications")
      .select(`
        *,
        vehicle:vehicles(name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((application) => ({
      ...application,
      vehicle_name: application.vehicle?.name || "Unknown",
    }));
  },

  async updateLoanStatus(applicationId: string, status: number): Promise<void> {
    const { error } = await supabase.from("loan_applications").update({ status }).eq("id", applicationId);

    if (error) throw error;
  },
};