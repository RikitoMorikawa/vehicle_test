import React from "react";
import { Link } from "react-router-dom";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import Button from "../../ui/Button";
import { LoanApplication, LOAN_STATUS } from "../../../types/admin/loan-review/page";
import { ArrowLeft, FileText, CheckCircle, XCircle, Download, User, Building, Car, CreditCard } from "lucide-react";

interface LoanReviewDetailComponentProps {
  application: LoanApplication | null;
  loading: boolean;
  error: string | null;
  onStatusUpdate: (applicationId: string, status: number) => Promise<void>;
  isUpdating: boolean;
}

const LoanReviewDetailComponent: React.FC<LoanReviewDetailComponentProps> = ({ application, loading, error, onStatusUpdate, isUpdating }) => {
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

  if (error || !application) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error || "申請データが見つかりません"}</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: number) => {
    const statusText = LOAN_STATUS[status as keyof typeof LOAN_STATUS];
    const colorClasses = {
      0: "bg-yellow-100 text-yellow-800",
      1: "bg-blue-100 text-blue-800",
      2: "bg-green-100 text-green-800",
      3: "bg-red-100 text-red-800",
    };

    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses[status as keyof typeof colorClasses]}`}>{statusText}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="mb-6">
              <Link to="/admin/loan-review" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ローン審査一覧に戻る
              </Link>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FileText className="h-6 w-6 text-red-600 mr-2" />
                    ローン審査詳細
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">申請ID: {application.id}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(application.status)}
                  {application.status === 0 && (
                    <div className="space-x-2">
                      <Button
                        onClick={() => onStatusUpdate(application.id, 2)}
                        disabled={isUpdating}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        承認
                      </Button>
                      <Button
                        onClick={() => onStatusUpdate(application.id, 3)}
                        disabled={isUpdating}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        否認
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 申請者情報 */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">申請者情報</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">氏名</label>
                    <p className="text-gray-900">{application.customer_name}</p>
                    <p className="text-sm text-gray-600">{application.customer_name_kana}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">生年月日</label>
                    <p className="text-gray-900">{application.customer_birth_date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">住所</label>
                    <p className="text-gray-900">〒{application.customer_postal_code}</p>
                    <p className="text-gray-900">{application.customer_address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">電話番号</label>
                    <p className="text-gray-900">{application.customer_mobile_phone}</p>
                    {application.customer_phone && <p className="text-gray-900">{application.customer_phone}</p>}
                  </div>
                </div>
              </div>

              {/* 勤務先情報 */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Building className="h-5 w-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">勤務先情報</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">勤務先名</label>
                    <p className="text-gray-900">{application.employer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">住所</label>
                    <p className="text-gray-900">〒{application.employer_postal_code}</p>
                    <p className="text-gray-900">{application.employer_address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">電話番号</label>
                    <p className="text-gray-900">{application.employer_phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">雇用形態</label>
                    <p className="text-gray-900">{application.employment_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">勤続年数</label>
                    <p className="text-gray-900">{application.years_employed}年</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">年収</label>
                    <p className="text-gray-900">¥{application.annual_income.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 車両・ローン情報 */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Car className="h-5 w-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">車両情報</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">車両名</label>
                    <p className="text-gray-900">{application.vehicle_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">車両価格</label>
                    <p className="text-gray-900">¥{application.vehicle_price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* ローン詳細 */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">ローン詳細</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">頭金</label>
                    <p className="text-gray-900">¥{application.down_payment.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">支払期間</label>
                    <p className="text-gray-900">{application.payment_months}ヶ月</p>
                  </div>
                  {application.bonus_months && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">ボーナス支払月</label>
                      <p className="text-gray-900">{application.bonus_months}</p>
                    </div>
                  )}
                  {application.bonus_amount && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">ボーナス支払額</label>
                      <p className="text-gray-900">¥{application.bonus_amount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 連帯保証人情報（存在する場合のみ表示） */}
            {(application.guarantor_name || application.guarantor_phone) && (
              <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">連帯保証人情報</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {application.guarantor_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">氏名</label>
                      <p className="text-gray-900">{application.guarantor_name}</p>
                      {application.guarantor_name_kana && <p className="text-sm text-gray-600">{application.guarantor_name_kana}</p>}
                    </div>
                  )}
                  {application.guarantor_relationship && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">続柄</label>
                      <p className="text-gray-900">{application.guarantor_relationship}</p>
                    </div>
                  )}
                  {application.guarantor_phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">電話番号</label>
                      <p className="text-gray-900">{application.guarantor_phone}</p>
                    </div>
                  )}
                  {application.guarantor_address && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">住所</label>
                      <p className="text-gray-900">〒{application.guarantor_postal_code}</p>
                      <p className="text-gray-900">{application.guarantor_address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 添付書類 */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">添付書類</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.identification_doc_url ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">本人確認書類</h3>
                    <a
                      href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/loan-documents/${application.identification_doc_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      ダウンロード
                    </a>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-500 mb-2">本人確認書類</h3>
                    <p className="text-sm text-gray-500">添付されていません</p>
                  </div>
                )}

                {application.income_doc_url ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">収入証明書類</h3>
                    <a
                      href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/loan-documents/${application.income_doc_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      ダウンロード
                    </a>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-500 mb-2">収入証明書類</h3>
                    <p className="text-sm text-gray-500">添付されていません</p>
                  </div>
                )}
              </div>
            </div>

            {/* 備考（存在する場合のみ表示） */}
            {application.notes && (
              <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">備考</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{application.notes}</p>
                </div>
              </div>
            )}

            {/* 申請履歴 */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">申請履歴</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">申請日時</span>
                  <span className="text-sm text-gray-900">{new Date(application.created_at).toLocaleString("ja-JP")}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">最終更新日時</span>
                  <span className="text-sm text-gray-900">{new Date(application.updated_at).toLocaleString("ja-JP")}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">現在のステータス</span>
                  {getStatusBadge(application.status)}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LoanReviewDetailComponent;
