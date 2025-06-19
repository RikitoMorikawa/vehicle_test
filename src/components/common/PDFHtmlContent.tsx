// src/components/common/PDFHtmlContent.tsx
import type { EstimatePDFData } from "../../types/common/pdf/page";

export const generateEstimateHTML = (data: EstimatePDFData, isPDF: boolean = false): string => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  };
  const documentType = data.document_type || "estimate";
  const documentLabel = documentType === "estimate" ? "見積書" : documentType === "invoice" ? "請求書" : documentType === "order" ? "注文書" : "見積書";

  const formatNumber = (num: number) => num.toLocaleString();

  // PDF用の場合、印刷スタイルを強制適用するCSS
  const pdfForceStyles = isPDF
    ? `
  /* PDF用: 印刷スタイルを強制適用 */
/* PDF用: 印刷スタイルを強制適用 */
body { 
    padding: 8mm !important; 
    font-size: 9px !important; 
    width: 210mm !important;
    margin: 0 auto !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.container {
    max-width: 170mm !important;
    margin: 0 auto !important;
}

table {
    font-size: 8.5px !important;
    border-collapse: collapse !important;
    width: 100% !important;
}

th, td {
    padding: 4px 6px !important;
    border: 0.5px solid #000 !important;
    min-height: 20px !important;
    vertical-align: middle !important;
    text-align: left !important;
    line-height: 1.4 !important;
}

.amount {
    text-align: right !important;
}

.detail-table th, .detail-table td {
    padding: 4px 6px !important;
    font-size: 7.5px !important;
}

.detail-header {
    font-size: 8px !important;
    padding: 6px 8px !important;
    font-weight: bold !important;
    background: #f3f4f6 !important;
    border: 0.5px solid #000 !important;
    text-align: left !important;
}

.text-xl { font-size: 14px !important; }
.text-lg { font-size: 12px !important; }
.text-sm { font-size: 10px !important; }
.text-xs { font-size: 8px !important; }
.mb-3 { margin-bottom: 0.5rem !important; }
.mb-4 { margin-bottom: 0.75rem !important; }

.border {
    border: 0.5px solid #000 !important;
}

* {
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
}

`
    : "";

  const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentLabel} - ${data.estimateNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', sans-serif;
            font-size: 10px; 
            line-height: 1.3; 
            color: #000; 
            background: white; 
            padding: 15mm;
            width: 210mm; 
            min-height: 297mm;
            margin: 0 auto;
        }
        .container { 
            max-width: 180mm; 
            margin: 0 auto; 
            height: 100%;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: 700; }
        .text-xl { font-size: 16px; }
        .text-lg { font-size: 14px; }
        .text-sm { font-size: 11px; }
        .text-xs { font-size: 9px; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .p-1 { padding: 0.25rem; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .border { border: 0.5px solid #000; }
        .border-b-2 { border-bottom: 2px solid #000; }
        .border-t-0 { border-top: 0; }
        .border-r { border-right: 1px solid #000; }
        .bg-gray-50 { background-color: #f9fafb; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-gray-200 { background-color: #e5e7eb; }
        .bg-yellow-100 { background-color: #fef3c7; }
        .flex { display: flex; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .w-32 { width: 8rem; }
        .justify-between { justify-content: space-between; }
        .items-start { align-items: flex-start; }
        .flex-1 { flex: 1 1 0%; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        
        table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 9px;
        }
        th, td { 
            border: 0.5px solid #000; 
            padding: 4px 8px;
            vertical-align: middle; 
            line-height: 1.4;
            word-wrap: break-word;
            height: auto;
            min-height: 20px;
        }
        th { 
            background: #f0f0f0; 
            font-weight: bold; 
            font-size: 8px;
        }
        .amount { text-align: right; }
        .highlight { background: #f0f0f0; font-weight: bold; }
        .total { background: #fef3c7; font-weight: bold; }
        
        /* 詳細テーブルのスタイル調整 */
        .detail-table {
            font-size: 8px;
        }
        .detail-table th, .detail-table td {
            padding: 3px 7px;
            line-height: 1.4;
            vertical-align: middle;
            word-wrap: break-word;
            height: auto;
            min-height: 16px;
        }
        .detail-header {
            font-size: 8px;
            padding: 4px 8px;
            vertical-align: middle;
            line-height: 1.3;
            min-height: 18px;
        }
        
        @media print {
            body { 
                padding: 8mm; 
                font-size: 9px; 
                width: 210mm;
                margin: 0 auto;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .container {
                max-width: 170mm;
                margin: 0 auto;
            }
            table {
                font-size: 8px;
                border-collapse: collapse;
            }
            th, td {
                padding: 4px 8px !important;
                border: 0.5px solid #000 !important;
                vertical-align: middle !important;
                line-height: 1.5 !important;
                word-wrap: break-word;
                height: auto !important;
                min-height: 22px !important;
            }
            .detail-table {
                font-size: 7px;
            }
            .detail-table th, .detail-table td {
                padding: 3px 6px !important;
                line-height: 1.4 !important;
                min-height: 18px !important;
                border: 0.5px solid #000 !important;
            }
            .detail-header {
                font-size: 8px;
                padding: 4px 8px !important;
                line-height: 1.4 !important;
                min-height: 20px !important;
                border: 0.5px solid #000 !important;
                vertical-align: middle !important;
            }
            .text-xl { font-size: 14px; }
            .text-lg { font-size: 12px; }
            .text-sm { font-size: 10px; }
            .text-xs { font-size: 8px; }
            .mb-3 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 0.75rem; }
            * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        }
        
        ${pdfForceStyles}
    </style>
</head>
<body>
    <div class="container" id="estimate-content">
        <!-- ヘッダー -->
        <div class="text-center mb-4">
            <h1 class="text-xl font-bold mb-3 border-b-2 py-1">${documentLabel}</h1>
            <div class="flex justify-between items-start mb-3">
                <div class="text-left text-xs">
                    <div>書類番号：${data.estimateNumber}</div>
                    <div>日付：${formatDate(data.estimateDate)}</div>
                </div>
                <div class="text-right border p-2 bg-gray-50" style="width: 40%;">
                <!-- 販売店情報 -->
                    <div class="dealer-info">
                    <h3>販売店情報</h3>
                    <table class="info-table">
                        <tr>
                        <td>販売店名</td>
                        <td>${data.dealerInfo.name}</td>
                        </tr>
                        <tr>
                        <td>担当者</td>
                        <td>${data.dealerInfo.representative}</td>
                        </tr>
                        <tr>
                        <td>電話番号</td>
                        <td>${data.dealerInfo.phone}</td>
                        </tr>
                        <tr>
                        <td>住所</td>
                        <td>${data.dealerInfo.address}</td>
                        </tr>
                        <tr>
                        <td>Email</td>
                        <td>${data.dealerInfo.email}</td>
                        </tr>
                    </table>
                    </div>
                
                </div>
            </div>
        </div>

        <!-- 顧客情報 -->
        <div class="mb-3">
            <div class="border-b-2 py-1 mb-2">
                <span class="font-bold text-sm">${data.customerInfo.name} 様</span>
            </div>
            <div class="text-xs">
                <div>ご住所：${data.customerInfo.address}</div>
                <div>ご連絡先：${data.customerInfo.phone}</div>
            </div>
        </div>

        <!-- 見積車両情報 -->
        <div class="mb-3">
            <div class="bg-gray-200 px-2 py-1 font-bold border text-sm">見積車両</div>
            <div class="border border-t-0">
                <div class="flex">
                    <div class="flex-1 border-r p-2">
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div>車名：${data.estimateVehicle.maker} ${data.estimateVehicle.name}</div>
                            <div>グレード：${data.estimateVehicle.grade || "-"}</div>
                            <div>型式：${data.estimateVehicle.model || "-"}</div>
                            <div>初度登録年月：${data.estimateVehicle.year}年</div>
                            <div>走行距離：${formatNumber(data.estimateVehicle.mileage)}km</div>
                            <div>修復歴：${data.estimateVehicle.repairHistory ? "有" : "無"}</div>
                            <div>外装色：${data.estimateVehicle.exteriorColor || "-"}</div>
                            <div>装備：${data.estimateVehicle.equipment || "-"}</div>
                        </div>
                    </div>
                    <div class="w-32 p-2 text-center">
                        <div class="text-lg font-bold">
                            ${formatNumber(data.salesPrices.payment_total)}円
                        </div>
                        <div class="text-xs">
                            (内消費税 ${formatNumber(Math.floor(data.salesPrices.consumption_tax))}円)
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 価格詳細 -->
        <div class="grid grid-cols-2 gap-3 mb-3">
            <!-- 左側：価格内訳 + 下取車両情報 -->
            <div class="space-y-2">
            <!-- 販売価格内訳 -->
            <div>
                <div class="bg-gray-200 px-1 py-1 detail-header font-bold border">販売価格内訳</div>
                <table class="border border-t-0">
                    <tr><td>車両本体価格</td><td class="amount">${formatNumber(data.salesPrices.base_price)}円</td></tr>
                    <tr><td>値引き</td><td class="amount">${formatNumber(data.salesPrices.discount)}円</td></tr>
                    <tr><td>車検整備費用</td><td class="amount">${formatNumber(data.salesPrices.inspection_fee)}円</td></tr>
                    <tr><td>付属品・特別仕様 ・・・(A)</td><td class="amount">${formatNumber(data.salesPrices.accessories_fee)}円</td></tr>
                    <tr class="highlight"><td>車両販売価格①</td><td class="amount">${formatNumber(data.salesPrices.vehicle_price)}円</td></tr>
                    <tr><td>税金・保険料 ・・・(B)</td><td class="amount">${formatNumber(data.salesPrices.tax_insurance)}円</td></tr>
                    <tr><td>預り法定費用 ・・・(C)</td><td class="amount">${formatNumber(data.salesPrices.legal_fee)}円</td></tr>
                    <tr><td>手続代行費用 ・・・(D)</td><td class="amount">${formatNumber(data.salesPrices.processing_fee)}円</td></tr>
                    <tr class="highlight"><td>販売諸費用②</td><td class="amount">${formatNumber(data.salesPrices.misc_fee)}円</td></tr>
                    <tr><td>現金販売価格①＋②</td><td class="amount">${formatNumber(data.salesPrices.total_price)}円</td></tr>
                    <tr><td>内消費税</td><td class="amount">${formatNumber(data.salesPrices.consumption_tax)}円</td></tr>
                    <tr><td>下取車価格</td><td class="amount">${formatNumber(data.salesPrices.trade_in_price)}円</td></tr>
                    <tr><td>下取車残債</td><td class="amount">${formatNumber(data.salesPrices.trade_in_debt)}円</td></tr>
                    <tr class="total"><td>販売価格</td><td class="amount">${formatNumber(data.salesPrices.payment_total)}円</td></tr>
                </table>
            </div>

                <!-- 下取車両情報 -->
                <div>
                    <div class="bg-gray-200 px-1 py-1 detail-header font-bold border">下取車両情報</div>
                    <table class="detail-table border border-t-0">
                        <tr><td>車名</td><td>${data.tradeInVehicle?.vehicle_name || ""}</td></tr>
                        <tr><td>登録番号</td><td>${data.tradeInVehicle?.registration_number || ""}</td></tr>
                        <tr><td>走行距離</td><td>${data.tradeInVehicle?.mileage ? formatNumber(data.tradeInVehicle.mileage) + "km" : ""}</td></tr>
                        <tr><td>初度登録年月</td><td>${
                          data.tradeInVehicle?.first_registration_date ? formatDate(data.tradeInVehicle.first_registration_date) : ""
                        }</td></tr>
                        <tr><td>車検満了日</td><td>${
                          data.tradeInVehicle?.inspection_expiry_date ? formatDate(data.tradeInVehicle.inspection_expiry_date) : ""
                        }</td></tr>
                        <tr><td>車台番号</td><td>${data.tradeInVehicle?.chassis_number || ""}</td></tr>
                        <tr><td>外装色</td><td>${data.tradeInVehicle?.exterior_color || ""}</td></tr>
                    </table>
                </div>
            </div>

            <!-- 右側：詳細内訳 -->
            <div class="space-y-2">
                <!-- (A) 付属品・特別仕様 -->
                <div>
                    <div class="bg-gray-200 px-1 py-1 detail-header font-bold border">(A) 付属品・特別仕様 内訳</div>
                    <table class="detail-table border border-t-0">
                        <tr class="bg-gray-100"><th>品名</th><th>金額</th></tr>
                        ${
                          data.accessories.length > 0
                            ? data.accessories
                                .map((accessory) => `<tr><td>${accessory.name}</td><td class="amount">${formatNumber(accessory.price)}円</td></tr>`)
                                .join("")
                            : '<tr><td colspan="2">-</td></tr>'
                        }
                    </table>
                </div>

                <!-- (B) 税金・保険料 -->
                <div>
                    <div class="bg-gray-200 px-1 py-1 detail-header font-bold border">(B) 税金・保険料 内訳</div>
                    <table class="detail-table border border-t-0">
                        <tr><td>自動車税</td><td class="amount">${formatNumber(data.taxInsuranceFees.automobile_tax)}円</td></tr>
                        <tr><td>環境性能割</td><td class="amount">${formatNumber(data.taxInsuranceFees.environmental_performance_tax)}円</td></tr>
                        <tr><td>重量税</td><td class="amount">${formatNumber(data.taxInsuranceFees.weight_tax)}円</td></tr>
                        <tr><td>自賠責保険料</td><td class="amount">${formatNumber(data.taxInsuranceFees.liability_insurance_fee)}円</td></tr>
                        <tr><td>任意保険料</td><td class="amount">${formatNumber(data.taxInsuranceFees.voluntary_insurance_fee)}円</td></tr>
                    </table>
                </div>

                <!-- (C) 預り法定費用 -->
                <div>
                    <div class="bg-gray-200 px-1 py-1 detail-header font-bold border">(C) 預り法定費用 内訳</div>
                    <table class="detail-table border border-t-0">
                        <tr><td>検査登録 （印紙代）</td><td class="amount">${formatNumber(data.legalFees.inspection_registration_stamp)}円</td></tr>
                        <tr><td>車庫証明 （印紙代）</td><td class="amount">${formatNumber(data.legalFees.parking_certificate_stamp)}円</td></tr>
                        <tr><td>下取車手続・処分 （印紙代）</td><td class="amount">${formatNumber(data.legalFees.trade_in_stamp)}円</td></tr>
                        <tr><td>リサイクル預託金</td><td class="amount">${formatNumber(data.legalFees.recycling_deposit)}円</td></tr>
                        <tr><td>その他非課税費用</td><td class="amount">${formatNumber(data.legalFees.other_nontaxable)}円</td></tr>
                    </table>
                </div>

                <!-- (D) 手続代行費用 -->
                <div>
                    <div class="bg-gray-200 px-1 py-1 detail-header font-bold border">(D) 手続代行費用 内訳</div>
                    <table class="detail-table border border-t-0">
                        <tr><td>検査登録手続代行</td><td class="amount">${formatNumber(data.processingFees.inspection_registration_fee)}円</td></tr>
                        <tr><td>車庫証明手続代行</td><td class="amount">${formatNumber(data.processingFees.parking_certificate_fee)}円</td></tr>
                        <tr><td>下取車手続・処分手続代行</td><td class="amount">${formatNumber(data.processingFees.trade_in_processing_fee)}円</td></tr>
                        <tr><td>下取車査定料</td><td class="amount">${formatNumber(data.processingFees.trade_in_assessment_fee)}円</td></tr>
                        <tr><td>リサイクル管理費用</td><td class="amount">${formatNumber(data.processingFees.recycling_management_fee)}円</td></tr>
                        <tr><td>納車費用</td><td class="amount">${formatNumber(data.processingFees.delivery_fee)}円</td></tr>
                        <tr><td>その他費用</td><td class="amount">${formatNumber(data.processingFees.other_fees)}円</td></tr>
                    </table>
                </div>
            </div>
        </div>

        ${
          data.loanCalculation
            ? `
        <!-- ローン計算 -->
        <div class="mb-3">
            <div class="bg-gray-200 px-2 py-1 font-bold border text-sm">ローン計算</div>
            <table class="border border-t-0">
                <tr>
                    <td style="width: 25%">頭金</td>
                    <td class="amount" style="width: 25%">${formatNumber(data.loanCalculation.down_payment)}円</td>
                    <td style="width: 25%">支払回数</td>
                    <td class="amount" style="width: 25%">${formatNumber(data.loanCalculation.payment_count)}回</td>
                </tr>
                <tr>
                    <td>現金・割賦元金</td>
                    <td class="amount">${formatNumber(data.loanCalculation.principal)}円</td>
                    <td>支払期間</td>
                    <td class="amount">${formatNumber(data.loanCalculation.payment_period)}年</td>
                </tr>
                <tr>
                    <td>分割払手数料</td>
                    <td class="amount">${formatNumber(data.loanCalculation.interest_fee)}円</td>
                    <td>初回支払額</td>
                    <td class="amount">${formatNumber(data.loanCalculation.first_payment)}円</td>
                </tr>
                <tr>
                    <td>分割支払金合計</td>
                    <td class="amount">${formatNumber(data.loanCalculation.total_payment)}円</td>
                    <td>２回目以降支払額</td>
                    <td class="amount">${formatNumber(data.loanCalculation.monthly_payment)}円</td>
                </tr>
                ${
                  data.loanCalculation.bonus_amount > 0
                    ? `
                <tr>
                    <td>ボーナス加算月</td>
                    <td class="amount">${data.loanCalculation.bonus_months.join("・")}月</td>
                    <td>ボーナス加算額</td>
                    <td class="amount">${formatNumber(data.loanCalculation.bonus_amount)}円</td>
                </tr>
                `
                    : ""
                }
            </table>
        </div>
        `
            : ""
        }
    </div>
</body>
</html>
    `;

  return htmlContent;
};
