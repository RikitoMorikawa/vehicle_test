import React from "react";
import { Link } from "react-router-dom";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import Button from "../../ui/Button";
import { LoanApplication } from "../../../types/admin/loan-review/page";
import { FileText, CheckCircle, XCircle, Eye } from "lucide-react";

interface LoanReviewComponentProps {
  applications: LoanApplication[];
  loading: boolean;
  error: string | null;
  onStatusUpdate: (applicationId: string, status: number) => Promise<void>;
  isUpdating: boolean;
}

const LoanReviewComponent: React.FC<LoanReviewComponentProps> = ({ applications, loading, error, onStatusUpdate, isUpdating }) => {
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">審査待ち</span>;
      case 1:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">審査中</span>;
      case 2:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">承認済み</span>;
      case 3:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">否認</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-full mx-auto">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-red-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">ローン審査</h2>
                </div>
              </div>

              {error ? (
                <div className="p-6 text-red-600">{error}</div>
              ) : applications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">審査待ちの申請はありません</div>
              ) : (
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
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
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
