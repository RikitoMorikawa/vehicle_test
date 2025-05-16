// src/services/admin/loan-review/page.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loanReviewHandler } from "../../../server/admin/loan-review/handler_000";
import { LoanApplicationsQueryResult } from "../../../types/admin/loan-review/page";

function useLoanApplications(): LoanApplicationsQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["loanApplications"],
    queryFn: () => loanReviewHandler.fetchLoanApplications(),
  });

  return {
    applications: data || [],
    isLoading,
    error: error as Error | null,
  };
}

function useUpdateLoanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: number }) =>
      loanReviewHandler.updateLoanStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loanApplications"] });
    },
  });
}

export const loanReviewService = {
  useLoanApplications,
  useUpdateLoanStatus,
};