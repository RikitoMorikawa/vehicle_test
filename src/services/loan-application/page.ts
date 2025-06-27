// src/services/loan-application/page.ts に追加

import { useQuery, useMutation } from "@tanstack/react-query";
import { loanApplicationHandler } from "../../server/loan-application/handler_000";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { LoanApplicationFormData } from "../../types/loan-application/page";

function useSubmitLoanApplication() {
  return useMutation({
    mutationFn: ({ userId, vehicleId, formData }: { userId: string; vehicleId: string; formData: LoanApplicationFormData }) =>
      loanApplicationHandler.submitApplication(userId, vehicleId, formData),
  });
}

// ←ここに追加
function useLoanApplicationStatus(vehicleId: string, userId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.LOAN_APPLICATION_STATUS, vehicleId, userId],
    queryFn: () => loanApplicationHandler.getLoanApplicationStatus(vehicleId, userId),
    enabled: !!vehicleId && !!userId,
  });
}

export const loanApplicationService = {
  useSubmitLoanApplication,
  useLoanApplicationStatus, // ←エクスポートに追加
};
