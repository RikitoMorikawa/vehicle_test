// src/server/admin/loan-review/handler_000.ts
import { supabase } from "../../../lib/supabase";
import { LoanApplication } from "../../../types/admin/loan-review/page";

export const loanReviewHandler = {
  async fetchLoanApplications(): Promise<LoanApplication[]> {
    const { data, error } = await supabase
      .from("loan_applications")
      .select(
        `
        *,
        vehicle:vehicles(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((application) => ({
      ...application,
      vehicle_name: application.vehicle?.name || "Unknown",
    }));
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
