// src/services/admin/loan-review/page.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { loanReviewHandler } from "../../../server/admin/loan-review/handler_000";
import { LoanApplicationsQueryResult, LoanApplicationDetailQueryResult } from "../../../types/admin/loan-review/page";

// ページネーション対応のfetchLoanApplicationsを使用
function useLoanApplications(page: number = 1, itemsPerPage: number = 10): LoanApplicationsQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.LOAN_APPLICATIONS, page, itemsPerPage],
    queryFn: () => loanReviewHandler.fetchLoanApplications(page, itemsPerPage),
  });

  return {
    applications: data?.applications || [],
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalItems: data?.totalItems || 0,
    itemsPerPage: data?.itemsPerPage || 10,
    isLoading,
    error: error as Error | null,
  };
}

function useLoanApplicationDetail(id: string): LoanApplicationDetailQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.LOAN_APPLICATION_DETAIL, id],
    queryFn: () => loanReviewHandler.fetchLoanApplicationById(id),
    enabled: !!id,
  });

  return {
    application: data || null,
    isLoading,
    error: error as Error | null,
  };
}

function useUpdateLoanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: number }) => loanReviewHandler.updateLoanStatus(applicationId, status),
    onSuccess: () => {
      // すべてのページのデータを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOAN_APPLICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOAN_APPLICATION_DETAIL });
    },
  });
}

export const loanReviewService = {
  useLoanApplications,
  useLoanApplicationDetail,
  useUpdateLoanStatus,
};
