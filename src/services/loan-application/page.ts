import { useMutation } from "@tanstack/react-query";
import { loanApplicationHandler } from "../../server/loan-application/handler_000";
import type { LoanApplicationFormData } from "../../types/loan-application/page";

function useSubmitLoanApplication() {
  return useMutation({
    mutationFn: ({ userId, vehicleId, formData }: { userId: string; vehicleId: string; formData: LoanApplicationFormData }) =>
      loanApplicationHandler.submitApplication(userId, vehicleId, formData),
  });
}

export const loanApplicationService = {
  useSubmitLoanApplication,
};
