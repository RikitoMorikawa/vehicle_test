// src/components/admin/loan-review/page.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import Button from "../../ui/Button";
import Pagination from "../../ui/Pagination";
import type { LoanApplication } from "../../../types/admin/loan-review/page";
import { LOAN_STATUS } from "../../../types/admin/loan-review/page";

interface LoanReviewComponentProps {
  applications: LoanApplication[];
  loading: boolean;
  error: string | null;
  onStatusUpdate: (applicationId: string, status: number) => Promise<void>;
  isUpdating: boolean;
  // ページネーション関連のpropsを追加
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const LoanReviewComponent: React.FC<LoanReviewComponentProps> = ({
  applications,
  loading,
  error,
  onStatusUpdate,
  isUpdating,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const getStatusBadge = (status: number) => {
    const statusText = LOAN_STATUS[status as keyof typeof LOAN_STATUS];
    const colorClass =
      status === 0
        ? "bg-yellow-100 text-yellow-800"
        : status === 1
        ? "bg-blue-100 text-blue-800"
        : status === 2
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>{statusText}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-full mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">ローン審査管理</h1>
              </div>
              <div className="bg-white rounded-lg shadow">
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-full mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">ローン審査管理</h1>
            </div>

            <div className="bg-white rounded-lg shadow">
              {error ? (
                <div className="p-6 text-red-600">{error}</div>
              ) : applications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">審査待ちの申請はありません</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申請日時</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申請者</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">車両</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((application) => (
                          <tr key={application.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(application.created_at).toLocaleString("ja-JP")}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{application.customer_name}</div>
                              <div className="text-sm text-gray-500">{application.customer_name_kana}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.vehicle_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{application.vehicle_price.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(application.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <Link
                                to={`/admin/loan-review/${application.id}`}
                                className="inline-flex items-center mr-2 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                詳細
                              </Link>

                              {application.status === 0 && (
                                <>
                                  <Button
                                    onClick={() => onStatusUpdate(application.id, 2)}
                                    disabled={isUpdating}
                                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm text-white bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    承認
                                  </Button>
                                  <Button
                                    onClick={() => onStatusUpdate(application.id, 3)}
                                    disabled={isUpdating}
                                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm text-white bg-red-600 hover:bg-red-700"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    否認
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginationコンポーネントを追加 */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={onPageChange}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LoanReviewComponent;
