// src/components/common/PDFPreviewModal.tsx
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { X, Download, Eye, Printer } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { EstimatePDFData } from "../../types/common/pdf/page";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  estimateId: string | null;
  loading?: boolean;
  onDownload?: (estimateId: string) => void;
  estimateData?: EstimatePDFData | null;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ isOpen, onClose, pdfUrl, estimateId, loading = false, onDownload, estimateData }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [generatedHtmlUrl, setGeneratedHtmlUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIframeLoaded(false);
  }, [pdfUrl]);

  // 見積書データが更新されたらHTMLを生成
  useEffect(() => {
    if (estimateData && isOpen) {
      const htmlUrl = generateEstimateHTML(estimateData);
      setGeneratedHtmlUrl(htmlUrl);

      return () => {
        if (htmlUrl) {
          URL.revokeObjectURL(htmlUrl);
        }
      };
    }
  }, [estimateData, isOpen]);

  // モーダルが閉じられたときのクリーンアップ
  useEffect(() => {
    if (!isOpen && generatedHtmlUrl) {
      URL.revokeObjectURL(generatedHtmlUrl);
      setGeneratedHtmlUrl(null);
    }
  }, [isOpen, generatedHtmlUrl]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // HTML生成関数（1箇所にまとめ）
  const generateEstimateHTML = (data: EstimatePDFData): string => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
    };

    const formatNumber = (num: number) => num.toLocaleString();

    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>見積書 - ${data.estimateNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', sans-serif;
            font-size: 12px; line-height: 1.4; color: #000; background: white; padding: 20px;
            width: 210mm; /* A4幅 */
        }
        .container { max-width: 100%; margin: 0 auto; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: 700; }
        .text-xl { font-size: 1.25rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .border { border: 1px solid #000; }
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
        .gap-4 { gap: 1rem; }
        .w-40 { width: 10rem; }
        .justify-between { justify-content: space-between; }
        .items-start { align-items: flex-start; }
        .flex-1 { flex: 1 1 0%; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 4px 8px; }
        th { background: #f0f0f0; font-weight: bold; }
        .amount { text-align: right; }
        .highlight { background: #f0f0f0; font-weight: bold; }
        .total { background: #fef3c7; font-weight: bold; }
        
        @media print {
            body { padding: 0; font-size: 11px; }
            @page { margin: 15mm; size: A4; }
        }
    </style>
</head>
<body>
    <div class="container" id="estimate-content">
        <!-- ヘッダー -->
        <div class="text-center mb-6">
            <h1 class="text-xl font-bold mb-4 border-b-2 py-1">見積書</h1>
            <div class="flex justify-between items-start mb-4">
                <div class="text-left text-xs">
                    <div>見積書番号：${data.estimateNumber}</div>
                    <div>見積日：${formatDate(data.estimateDate)}</div>
                </div>
                <div class="text-right border p-3 bg-gray-50">
                    <div class="font-bold text-sm">【販売店】</div>
                    <div class="text-xs">
                        <div>${data.dealerInfo.name}</div>
                        <div>${data.dealerInfo.address}</div>
                        <div>電話番号：${data.dealerInfo.phone}</div>
                        <div>担当者：${data.dealerInfo.representative}</div>
                        <div>登録番号：${data.dealerInfo.taxNumber}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 顧客情報 -->
        <div class="mb-4">
            <div class="border-b-2 py-1 mb-2">
                <span class="font-bold text-sm">${data.customerInfo.name} 様</span>
            </div>
            <div class="text-xs">
                <div>ご住所：${data.customerInfo.address}</div>
                <div>ご連絡先：${data.customerInfo.phone}</div>
            </div>
        </div>

        <!-- 見積車両情報 -->
        <div class="mb-4">
            <div class="bg-gray-200 px-2 py-1 font-bold border text-sm">見積車両</div>
            <div class="border border-t-0">
                <div class="flex">
                    <div class="flex-1 border-r p-2">
                        <div class="grid grid-cols-2 gap-4 text-xs">
                            <div>車名：${data.estimateVehicle.maker} ${data.estimateVehicle.name}</div>
                            <div>グレード：${data.estimateVehicle.grade || "-"}</div>
                            <div>型式：${data.estimateVehicle.model || "-"}</div>
                            <div>初度登録年月：${data.estimateVehicle.year}年</div>
                            <div>走行距離：${formatNumber(data.estimateVehicle.mileage)}km</div>
                            <div>修復歴：${data.estimateVehicle.repairHistory ? "有" : "無"}</div>
                            <div>外装色：${data.estimateVehicle.exteriorColor}</div>
                            <div>装備：${data.estimateVehicle.equipment || "-"}</div>
                        </div>
                    </div>
                    <div class="w-40 p-2 text-center">
                        <div class="text-xl font-bold">
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
        <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- 左側：価格内訳 -->
            <div>
                <table class="text-xs">
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
                    <tr><td>下取車価格</td><td class="amount">${formatNumber(data.salesPrices.trade_in_price)}円</td></tr>
                    <tr class="total"><td>販売価格</td><td class="amount">${formatNumber(data.salesPrices.payment_total)}円</td></tr>
                </table>
            </div>

            <!-- 右側：詳細内訳 -->
            <div class="space-y-3">
                <!-- (A) 付属品・特別仕様 -->
                <div>
                    <div class="bg-gray-200 px-2 py-1 text-xs font-bold border">(A) 付属品・特別仕様 内訳</div>
                    <table class="text-xs border border-t-0">
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
                    <div class="bg-gray-200 px-2 py-1 text-xs font-bold border">(B) 税金・保険料 内訳</div>
                    <table class="text-xs border border-t-0">
                        <tr><td>自動車税</td><td class="amount">${formatNumber(data.taxInsuranceFees.automobile_tax)}円</td></tr>
                        <tr><td>環境性能割</td><td class="amount">${formatNumber(data.taxInsuranceFees.environmental_performance_tax)}円</td></tr>
                        <tr><td>重量税</td><td class="amount">${formatNumber(data.taxInsuranceFees.weight_tax)}円</td></tr>
                        <tr><td>自賠責保険料</td><td class="amount">${formatNumber(data.taxInsuranceFees.liability_insurance_fee)}円</td></tr>
                        <tr><td>任意保険料</td><td class="amount">${formatNumber(data.taxInsuranceFees.voluntary_insurance_fee)}円</td></tr>
                    </table>
                </div>

                <!-- (C) 預り法定費用 -->
                <div>
                    <div class="bg-gray-200 px-2 py-1 text-xs font-bold border">(C) 預り法定費用 内訳</div>
                    <table class="text-xs border border-t-0">
                        <tr><td>検査登録 （印紙代）</td><td class="amount">${formatNumber(data.legalFees.inspection_registration_stamp)}円</td></tr>
                        <tr><td>車庫証明 （印紙代）</td><td class="amount">${formatNumber(data.legalFees.parking_certificate_stamp)}円</td></tr>
                        <tr><td>下取車手続・処分 （印紙代）</td><td class="amount">${formatNumber(data.legalFees.trade_in_stamp)}円</td></tr>
                        <tr><td>リサイクル預託金</td><td class="amount">${formatNumber(data.legalFees.recycling_deposit)}円</td></tr>
                        <tr><td>その他非課税費用</td><td class="amount">${formatNumber(data.legalFees.other_nontaxable)}円</td></tr>
                    </table>
                </div>

                <!-- (D) 手続代行費用 -->
                <div>
                    <div class="bg-gray-200 px-2 py-1 text-xs font-bold border">(D) 手続代行費用 内訳</div>
                    <table class="text-xs border border-t-0">
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
        <div class="mb-4">
            <div class="bg-gray-200 px-2 py-1 font-bold border text-sm">ローン計算</div>
            <table class="text-xs border border-t-0">
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

    const htmlBlob = new Blob([htmlContent], { type: "text/html" });
    return URL.createObjectURL(htmlBlob);
  };

  // PDF生成とダウンロード関数
  const generateAndDownloadPDF = async (data: EstimatePDFData) => {
    try {
      setIsDownloading(true);

      // 非表示のiframeを作成してHTMLを読み込み
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.style.width = "210mm";
      iframe.style.height = "297mm";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      // HTMLコンテンツを生成
      const htmlUrl = generateEstimateHTML(data);
      iframe.src = htmlUrl;

      // iframeが読み込まれるまで待機
      await new Promise<void>((resolve) => {
        iframe.onload = () => {
          setTimeout(resolve, 1000); // スタイルが適用されるまで少し待機
        };
      });

      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDocument) {
        throw new Error("iframeのドキュメントにアクセスできません");
      }

      const content = iframeDocument.getElementById("estimate-content");
      if (!content) {
        throw new Error("見積書コンテンツが見つかりません");
      }

      // html2canvasでキャンバスに変換
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794, // A4幅 (210mm * 96dpi / 25.4)
        height: 1123, // A4高さ (297mm * 96dpi / 25.4)
      });

      // PDFを作成
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4幅(mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 複数ページに分割する場合
      const pageHeight = 297; // A4高さ(mm)
      let heightLeft = imgHeight;
      let position = 0;

      // 最初のページ
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 追加ページが必要な場合
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDFをダウンロード
      pdf.save(`見積書_${data.estimateNumber}.pdf`);

      // クリーンアップ
      document.body.removeChild(iframe);
      URL.revokeObjectURL(htmlUrl);
    } catch (error) {
      console.error("PDF生成エラー:", error);
      alert("PDFの生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsDownloading(false);
    }
  };

  // ダウンロードハンドラー（PDFダウンロード）
  const handleDownload = () => {
    if (estimateData) {
      generateAndDownloadPDF(estimateData);
    } else if (onDownload && estimateId) {
      onDownload(estimateId);
    }
  };

  // 印刷ハンドラー（修正版）
  const handlePrint = async () => {
    if (!estimateData) return;

    try {
      // 印刷用の非表示iframeを作成
      const printFrame = document.createElement("iframe");
      printFrame.style.position = "absolute";
      printFrame.style.left = "-9999px";
      printFrame.style.width = "210mm";
      printFrame.style.height = "297mm";
      printFrame.style.border = "none";
      document.body.appendChild(printFrame);

      // HTMLコンテンツを生成（既存の関数を使用）
      const htmlUrl = generateEstimateHTML(estimateData);
      printFrame.src = htmlUrl;

      // iframeが読み込まれるまで待機
      await new Promise<void>((resolve) => {
        printFrame.onload = () => {
          setTimeout(resolve, 500); // スタイルが適用されるまで少し待機
        };
      });

      // 印刷実行
      const printWindow = printFrame.contentWindow;
      if (printWindow) {
        printWindow.focus();
        printWindow.print();

        // 印刷ダイアログが閉じられた後にクリーンアップ
        setTimeout(() => {
          document.body.removeChild(printFrame);
          URL.revokeObjectURL(htmlUrl);
        }, 1000);
      }
    } catch (error) {
      console.error("印刷エラー:", error);
      alert("印刷に失敗しました。もう一度お試しください。");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // 表示するURL（見積書データがある場合は生成されたHTML、ない場合は元のpdfUrl）
  const displayUrl = generatedHtmlUrl || pdfUrl;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">見積書プレビュー</h3>
          </div>
          <div className="flex items-center space-x-2">
            {/* 印刷ボタン */}
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={!displayUrl || loading || isDownloading} className="flex items-center">
              <Printer className="w-4 h-4 mr-1" />
              印刷
            </Button>

            {/* ダウンロードボタン */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={loading || (!displayUrl && !estimateData) || isDownloading}
              className="flex items-center"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                  PDF生成中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-1" />
                  PDFダウンロード
                </>
              )}
            </Button>

            {/* 閉じるボタン */}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">見積書を生成中...</p>
              </div>
            </div>
          )}

          {displayUrl && !loading && (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">見積書を読み込み中...</p>
                  </div>
                </div>
              )}
              <iframe src={displayUrl} className="w-full h-full border-0" title="PDF Preview" onLoad={() => setIframeLoaded(true)} />
            </>
          )}

          {!displayUrl && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">見積書プレビューを生成してください</p>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>プレビューは実際のPDFと若干異なる場合があります</span>
            <div className="flex items-center space-x-4">
              <span>ESCキーでモーダルを閉じることができます</span>
              <span>Ctrl+P で印刷できます</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
