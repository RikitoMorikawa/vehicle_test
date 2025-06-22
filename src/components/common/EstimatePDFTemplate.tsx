import React from 'react';
import type { EstimatePDFData } from '../../types/common/pdf/page';

interface EstimatePDFTemplateProps {
  data: EstimatePDFData;
  className?: string;
}

const EstimatePDFTemplate: React.FC<EstimatePDFTemplateProps> = ({ data, className = '' }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const documentType = data.document_type || 'estimate';
  const documentLabel = documentType === 'estimate' ? '見積書' : 
                       documentType === 'invoice' ? '請求書' : 
                       documentType === 'order' ? '注文書' : '見積書';

  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto ${className}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 border-b-4 border-black pb-2">{documentLabel}</h1>
        <div className="flex justify-between items-start mb-6">
          <div className="text-left text-sm">
            <div className="mb-1">書類番号：{data.estimateNumber}</div>
            <div>日付：{formatDate(data.estimateDate)}</div>
          </div>
          <div className="text-right border-2 border-gray-300 p-4 bg-gray-50 w-80">
            <h3 className="font-bold mb-2">販売店情報</h3>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">販売店名:</span> {data.dealerInfo.name}</div>
              <div><span className="font-medium">担当者:</span> {data.dealerInfo.representative}</div>
              <div><span className="font-medium">電話番号:</span> {data.dealerInfo.phone}</div>
              <div><span className="font-medium">住所:</span> {data.dealerInfo.address}</div>
              <div><span className="font-medium">Email:</span> {data.dealerInfo.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 顧客情報 */}
      <div className="mb-6">
        <div className="border-b-2 border-black py-2 mb-4">
          <span className="font-bold text-lg">{data.customerInfo.name} 様</span>
          <div className="text-sm mt-1">ご住所：{data.customerInfo.address}</div>
          <div className="text-sm">ご連絡先：{data.customerInfo.phone}</div>
        </div>
      </div>

      {/* 見積車両情報 */}
      <div className="mb-6">
        <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">見積車両</div>
        <div className="border-2 border-t-0 border-black">
          <div className="flex">
            <div className="flex-1 border-r-2 border-black p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">車名:</span> {data.estimateVehicle.maker} {data.estimateVehicle.name}</div>
                <div><span className="font-medium">グレード:</span> {data.estimateVehicle.grade || '-'}</div>
                <div><span className="font-medium">型式:</span> {data.estimateVehicle.model || '-'}</div>
                <div><span className="font-medium">初度登録年月:</span> {data.estimateVehicle.year}年</div>
                <div><span className="font-medium">走行距離:</span> {formatNumber(data.estimateVehicle.mileage)}km</div>
                <div><span className="font-medium">修復歴:</span> {data.estimateVehicle.repairHistory ? '有' : '無'}</div>
                <div><span className="font-medium">外装色:</span> {data.estimateVehicle.exteriorColor || '-'}</div>
              </div>
            </div>
            <div className="w-40 p-4 text-center bg-yellow-50">
              <div className="text-2xl font-bold text-red-600">
                ¥{formatNumber(data.salesPrices.payment_total)}
              </div>
              <div className="text-xs mt-1">
                (内消費税 ¥{formatNumber(Math.floor(data.salesPrices.consumption_tax))})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 価格詳細 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* 左側：価格内訳 + 下取車両情報 */}
        <div className="space-y-4">
          {/* 販売価格内訳 */}
          <div>
            <div className="bg-gray-200 px-2 py-1 font-bold border-2 border-black text-sm">販売価格内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-xs">
              <tbody>
                <tr className="border-b border-black"><td className="p-2">車両本体価格</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.base_price)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">値引き</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.discount)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">車検整備費用</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.inspection_fee)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">付属品・特別仕様 ・・・(A)</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.accessories_fee)}</td></tr>
                <tr className="border-b border-black bg-gray-100"><td className="p-2 font-bold">車両販売価格①</td><td className="p-2 text-right font-bold">¥{formatNumber(data.salesPrices.vehicle_price)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">税金・保険料 ・・・(B)</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.tax_insurance)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">預り法定費用 ・・・(C)</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.legal_fee)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">手続代行費用 ・・・(D)</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.processing_fee)}</td></tr>
                <tr className="border-b border-black bg-gray-100"><td className="p-2 font-bold">販売諸費用②</td><td className="p-2 text-right font-bold">¥{formatNumber(data.salesPrices.misc_fee)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">現金販売価格①＋②</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.total_price)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">内消費税</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.consumption_tax)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">下取車価格</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.trade_in_price)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">下取車残債</td><td className="p-2 text-right">¥{formatNumber(data.salesPrices.trade_in_debt)}</td></tr>
                <tr className="bg-yellow-100"><td className="p-2 font-bold">販売価格</td><td className="p-2 text-right font-bold">¥{formatNumber(data.salesPrices.payment_total)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* 下取車両情報 */}
          <div>
            <div className="bg-gray-200 px-2 py-1 font-bold border-2 border-black text-sm">下取車両情報</div>
            <table className="w-full border-2 border-t-0 border-black text-xs">
              <tbody>
                <tr className="border-b border-black"><td className="p-2">車名</td><td className="p-2">{data.tradeInVehicle?.vehicle_name || ''}</td></tr>
                <tr className="border-b border-black"><td className="p-2">登録番号</td><td className="p-2">{data.tradeInVehicle?.registration_number || ''}</td></tr>
                <tr className="border-b border-black"><td className="p-2">走行距離</td><td className="p-2">{data.tradeInVehicle?.mileage ? formatNumber(data.tradeInVehicle.mileage) + 'km' : ''}</td></tr>
                <tr className="border-b border-black"><td className="p-2">初度登録年月</td><td className="p-2">{data.tradeInVehicle?.first_registration_date ? formatDate(data.tradeInVehicle.first_registration_date) : ''}</td></tr>
                <tr className="border-b border-black"><td className="p-2">車検満了日</td><td className="p-2">{data.tradeInVehicle?.inspection_expiry_date ? formatDate(data.tradeInVehicle.inspection_expiry_date) : ''}</td></tr>
                <tr className="border-b border-black"><td className="p-2">車台番号</td><td className="p-2">{data.tradeInVehicle?.chassis_number || ''}</td></tr>
                <tr><td className="p-2">外装色</td><td className="p-2">{data.tradeInVehicle?.exterior_color || ''}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 右側：詳細内訳 */}
        <div className="space-y-4">
          {/* (A) 付属品・特別仕様 */}
          <div>
            <div className="bg-gray-200 px-2 py-1 font-bold border-2 border-black text-sm">(A) 付属品・特別仕様 内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="p-2 text-left">品名</th>
                  <th className="p-2 text-right">金額</th>
                </tr>
              </thead>
              <tbody>
                {data.accessories.length > 0 ? (
                  data.accessories.map((accessory, index) => (
                    <tr key={index} className="border-b border-black">
                      <td className="p-2">{accessory.name}</td>
                      <td className="p-2 text-right">¥{formatNumber(accessory.price)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2} className="p-2 text-center">-</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* (B) 税金・保険料 */}
          <div>
            <div className="bg-gray-200 px-2 py-1 font-bold border-2 border-black text-sm">(B) 税金・保険料 内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-xs">
              <tbody>
                <tr className="border-b border-black"><td className="p-2">自動車税</td><td className="p-2 text-right">¥{formatNumber(data.taxInsuranceFees.automobile_tax)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">環境性能割</td><td className="p-2 text-right">¥{formatNumber(data.taxInsuranceFees.environmental_performance_tax)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">重量税</td><td className="p-2 text-right">¥{formatNumber(data.taxInsuranceFees.weight_tax)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">自賠責保険料</td><td className="p-2 text-right">¥{formatNumber(data.taxInsuranceFees.liability_insurance_fee)}</td></tr>
                <tr><td className="p-2">任意保険料</td><td className="p-2 text-right">¥{formatNumber(data.taxInsuranceFees.voluntary_insurance_fee)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* (C) 預り法定費用 */}
          <div>
            <div className="bg-gray-200 px-2 py-1 font-bold border-2 border-black text-sm">(C) 預り法定費用 内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-xs">
              <tbody>
                <tr className="border-b border-black"><td className="p-2">検査登録 （印紙代）</td><td className="p-2 text-right">¥{formatNumber(data.legalFees.inspection_registration_stamp)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">車庫証明 （印紙代）</td><td className="p-2 text-right">¥{formatNumber(data.legalFees.parking_certificate_stamp)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">下取車手続・処分 （印紙代）</td><td className="p-2 text-right">¥{formatNumber(data.legalFees.trade_in_stamp)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">リサイクル預託金</td><td className="p-2 text-right">¥{formatNumber(data.legalFees.recycling_deposit)}</td></tr>
                <tr><td className="p-2">その他非課税費用</td><td className="p-2 text-right">¥{formatNumber(data.legalFees.other_nontaxable)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* (D) 手続代行費用 */}
          <div>
            <div className="bg-gray-200 px-2 py-1 font-bold border-2 border-black text-sm">(D) 手続代行費用 内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-xs">
              <tbody>
                <tr className="border-b border-black"><td className="p-2">検査登録手続代行</td><td className="p-2 text-right">¥{formatNumber(data.processingFees.inspection_registration_fee)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">車庫証明手続代行</td><td className="p-2 text-right">¥{formatNumber(data.processingFees.parking_certificate_fee)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">下取車手続・処分手続代行</td><td className="p-2 text-right">¥{formatNumber(data.processingFees.trade_in_processing_fee)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">下取車査定料</td><td className="p-2 text-right">¥{formatNumber(data.processingFees.trade_in_assessment_fee)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">リサイクル管理費用</td><td className="p-2 text-right">¥{formatNumber(data.processingFees.recycling_management_fee)}</td></tr>
                <tr className="border-b border-black"><td className="p-2">納車費用</td><td className="p-2 text-right">¥{formatNumber(data.processingFees.delivery_fee)}</td></tr>
                <tr><td className="p-2">その他費用</td><td className="p-2 text-right">¥{formatNumber(data.processingFees.other_fees)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ローン計算 */}
      {data.loanCalculation && (
        <div className="mb-6">
          <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">ローン計算</div>
          <table className="w-full border-2 border-t-0 border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="p-3 w-1/4">頭金</td>
                <td className="p-3 text-right w-1/4">¥{formatNumber(data.loanCalculation.down_payment)}</td>
                <td className="p-3 w-1/4">支払回数</td>
                <td className="p-3 text-right w-1/4">{formatNumber(data.loanCalculation.payment_count)}回</td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-3">現金・割賦元金</td>
                <td className="p-3 text-right">¥{formatNumber(data.loanCalculation.principal)}</td>
                <td className="p-3">支払期間</td>
                <td className="p-3 text-right">{formatNumber(data.loanCalculation.payment_period)}年</td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-3">分割払手数料</td>
                <td className="p-3 text-right">¥{formatNumber(data.loanCalculation.interest_fee)}</td>
                <td className="p-3">初回支払額</td>
                <td className="p-3 text-right">¥{formatNumber(data.loanCalculation.first_payment)}</td>
              </tr>
              <tr className={`${data.loanCalculation.bonus_amount > 0 ? 'border-b border-black' : ''}`}>
                <td className="p-3">分割支払金合計</td>
                <td className="p-3 text-right">¥{formatNumber(data.loanCalculation.total_payment)}</td>
                <td className="p-3">２回目以降支払額</td>
                <td className="p-3 text-right">¥{formatNumber(data.loanCalculation.monthly_payment)}</td>
              </tr>
              {data.loanCalculation.bonus_amount > 0 && (
                <tr>
                  <td className="p-3">ボーナス加算月</td>
                  <td className="p-3 text-right">{data.loanCalculation.bonus_months.join('・')}月</td>
                  <td className="p-3">ボーナス加算額</td>
                  <td className="p-3 text-right">¥{formatNumber(data.loanCalculation.bonus_amount)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EstimatePDFTemplate;