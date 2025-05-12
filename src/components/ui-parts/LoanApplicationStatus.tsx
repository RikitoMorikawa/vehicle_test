import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { LoanApplicationStatus } from "../../types/enum";

interface LoanApplicationStatusViewProps {
  userId: string;
  vehicleId: string;
}

const LoanApplicationStatusView: React.FC<LoanApplicationStatusViewProps> = ({ userId, vehicleId }) => {
  const {
    data: application,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["loanApplication", userId, vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("user_id", userId)
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!userId && !!vehicleId,
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">審査状況の取得に失敗しました</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">まだローン審査の申込がありません</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: number) => {
    switch (status) {
      case LoanApplicationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case LoanApplicationStatus.REVIEWING:
        return "bg-blue-100 text-blue-800";
      case LoanApplicationStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case LoanApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case LoanApplicationStatus.PENDING:
        return "審査待ち";
      case LoanApplicationStatus.REVIEWING:
        return "審査中";
      case LoanApplicationStatus.APPROVED:
        return "承認済み";
      case LoanApplicationStatus.REJECTED:
        return "否認";
      default:
        return "不明";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">ローン審査状況</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">申込日時</span>
          <span className="text-sm text-gray-900">
            {new Date(application.created_at).toLocaleString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">審査状況</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status)}`}>
            {getStatusText(application.status)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationStatusView;
