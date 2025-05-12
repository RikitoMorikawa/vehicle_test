import { useMutation, useQuery } from "@tanstack/react-query";
import { loanApplicationHandler } from "../../server/loan-application/handler_000";
import type { LoanApplicationFormData } from "../../types/loan-application/page";

function useSubmitLoanApplication() {
  return useMutation({
    mutationFn: ({ userId, vehicleId, formData }: { userId: string; vehicleId: string; formData: LoanApplicationFormData }) =>
      loanApplicationHandler.submitApplication(userId, vehicleId, formData),
  });
}

function useGetUserInfo(userId: string | undefined) {
  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => {
      if (!userId) return null;
      return loanApplicationHandler.getUserInfo(userId);
    },
    enabled: !!userId,
  });
}

export const loanApplicationService = {
  useSubmitLoanApplication,
  useGetUserInfo,
};
