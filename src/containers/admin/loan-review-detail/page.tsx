import React from "react";
import { useParams } from "react-router-dom";
import LoanReviewDetailComponent from "../../../components/admin/loan-review-detail/page";
import { loanReviewService } from "../../../services/admin/loan-review/page";

const LoanReviewDetailContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { application, isLoading, error } = loanReviewService.useLoanApplicationDetail(id!);
  const updateStatus = loanReviewService.useUpdateLoanStatus();

  const handleStatusUpdate = async (applicationId: string, status: number) => {
    try {
      await updateStatus.mutateAsync({ applicationId, status });
    } catch (err) {
      console.error("Error updating loan status:", err);
    }
  };

  return (
    <LoanReviewDetailComponent
      application={application}
      loading={isLoading}
      error={error ? "ローン申請詳細の取得に失敗しました" : null}
      onStatusUpdate={handleStatusUpdate}
      isUpdating={updateStatus.isPending}
    />
  );
};

export default LoanReviewDetailContainer;
