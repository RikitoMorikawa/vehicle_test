import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Button from "../ui/Button";
import type { EstimateError, EstimateFormData, Accessory } from "../../types/estimate/page";
// 子コンポーネントのインポート
import VehicleInfo from "../ui-parts/estimate/VehicleInfo";
import TradeInInfo from "../ui-parts/estimate/TradeInInfo";
import SalesPriceInfo from "../ui-parts/estimate/SalesPriceInfo";
import AccessoriesInfo from "../ui-parts/estimate/AccessoriesInfo";
import ProcessingFeesInfo from "../ui-parts/estimate/ProcessingFeesInfo";
import LegalFeesInfo from "../ui-parts/estimate/LegalFeesInfo";
import TaxInsuranceInfo from "../ui-parts/estimate/TaxInsuranceInfo";
import LoanCalculation from "../ui-parts/estimate/LoanCalculation";
import PaymentSummary from "../ui-parts/estimate/PaymentSummary";
import { Vehicle } from "../../types/db/vehicle";

// onInputChange 関数の型を拡張して "accessories" セクションも含める
export interface EstimateComponentProps {
  vehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  formData: EstimateFormData;
  errors: EstimateError | null;
  success: string | null;
  onInputChange: (
    section: "tradeIn" | "salesPrice" | "loanCalculation" | "processingFees" | "legalFees" | "taxInsuranceFees",
    name: string,
    value: number | string
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onAccessoryChange: (
    action: "add" | "remove", // ここを修正
    value: Accessory | number // ここを修正
  ) => void; // アクセサリーの変更を処理するための関数
}

const EstimateComponent: React.FC<EstimateComponentProps> = ({
  vehicle,
  loading,
  error,
  formData,
  errors,
  success,
  onInputChange,
  onSubmit,
  onCancel,
  onAccessoryChange, // アクセサリーの変更を処理するための関数
}) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-red-600">{error || "車両情報が見つかりません"}</p>
              </div>
            </div>
          </div>
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
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">見積書作成</h1>
              </div>

              {errors?.general && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {success && (
                <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="p-6 space-y-8">
                <VehicleInfo vehicle={vehicle} />
                <TradeInInfo tradeIn={formData.tradeIn} onInputChange={onInputChange} errors={errors} />
                <SalesPriceInfo salesPrice={formData.salesPrice} onInputChange={onInputChange} errors={errors} />
                <AccessoriesInfo
                  accessories={formData.accessories}
                  onInputChange={onAccessoryChange} // onAccessoryChangeを渡す
                  errors={errors}
                />
                <ProcessingFeesInfo processingFees={formData.processingFees} onInputChange={onInputChange} errors={errors} />
                <LegalFeesInfo legalFees={formData.legalFees} onInputChange={onInputChange} errors={errors} />
                <TaxInsuranceInfo taxInsuranceFees={formData.taxInsuranceFees} onInputChange={onInputChange} errors={errors} />
                <LoanCalculation loanCalculation={formData.loanCalculation} onInputChange={onInputChange} errors={errors} />
                <PaymentSummary vehicle={vehicle} />

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    キャンセル
                  </Button>
                  <Button type="submit">保存</Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EstimateComponent;
