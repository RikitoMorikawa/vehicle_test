// src / containers / admin / loan - review / page.tsx;
import React from "react";
import LoanReviewComponent from "../../../components/admin/loan-review/page";
import { loanReviewService } from "../../../services/admin/loan-review/page";

const LoanReviewContainer: React.FC = () => {
  const { applications, isLoading, error } = loanReviewService.useLoanApplications();
  const updateStatus = loanReviewService.useUpdateLoanStatus();

  const handleStatusUpdate = async (applicationId: string, status: number) => {
    try {
      await updateStatus.mutateAsync({ applicationId, status });
    } catch (err) {
      console.error("Error updating loan status:", err);
    }
  };

  return (
    <LoanReviewComponent
      applications={applications}
      loading={isLoading}
      error={error ? "ローン申請データの取得に失敗しました" : null}
      onStatusUpdate={handleStatusUpdate}
      isUpdating={updateStatus.isPending}
    />
  );
};

export default LoanReviewContainer;