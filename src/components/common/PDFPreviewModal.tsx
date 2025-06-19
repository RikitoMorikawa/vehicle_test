// src/components/common/PDFPreviewModal.tsx
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { X, Download, Eye, Printer } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateEstimateHTML } from "./PDFHtmlContent";
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

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  pdfUrl, 
  estimateId, 
  loading = false, 
  onDownload, 
  estimateData 
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [generatedHtmlUrl, setGeneratedHtmlUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIframeLoaded(false);
  }, [pdfUrl]);

  // ヘルパー関数を修正
  const getDocumentTypeLabel = (estimateData: EstimatePDFData | null | undefined): string => {
    if (!estimateData) return "書類";

    const documentType = estimateData.document_type || "estimate";
    switch (documentType) {
      case "estimate":
        return "見積書";
      case "invoice":
        return "請求書";
      case "order":
        return "注文書";
      default:
        return "見積書";
    }
  };

  // 見積書データが更新されたらHTMLを生成
  useEffect(() => {
    if (estimateData && isOpen) {
      const htmlContent = generateEstimateHTML(estimateData);
      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const htmlUrl = URL.createObjectURL(htmlBlob);
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

  // BlobURL作成のヘルパー関数
  const createHTMLBlobUrl = (data: EstimatePDFData): string => {
    const htmlContent = generateEstimateHTML(data);
    const htmlBlob = new Blob([htmlContent], { type: "text/html" });
    return URL.createObjectURL(htmlBlob);
  };

  // PDF生成とダウンロード関数（1ページに強制収める）
  // 改善されたPDF生成関数
  const generateAndDownloadPDF = async (data: EstimatePDFData) => {
    try {
      setIsDownloading(true);

      // 高解像度PDF用のHTMLを生成
      const htmlContent = generateEstimateHTML(data, true);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      // PDF生成用の隠し要素設定（より高解像度対応）
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "-9999px";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "210mm";
      tempDiv.style.height = "297mm";
      tempDiv.style.overflow = "hidden";
      tempDiv.style.transform = "scale(1)"; // スケール固定
      document.body.appendChild(tempDiv);

      // レンダリング待機時間を延長
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const content = tempDiv.querySelector("#estimate-content") as HTMLElement;
      if (!content) {
        throw new Error("見積書コンテンツが見つかりません");
      }

      // 高解像度Canvas生成（TypeScriptエラー修正版）
      const canvas = await html2canvas(content, {
        scale: 4, // 高解像度（2→4）
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        windowWidth: 794,
        windowHeight: Math.max(1123, content.scrollHeight),
        // 追加オプション
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // クローンドキュメントで追加のスタイル調整
          const style = clonedDoc.createElement("style");
          style.textContent = `
          * {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeLegibility !important;
          }
          table, th, td {
            border-width: 1px !important;
            border-color: #000 !important;
          }
        `;
          clonedDoc.head.appendChild(style);
        },
      });

      // 高品質PDF生成
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: false, // 圧縮無効化で画質保持
      });

      // 高品質画像データ（JPEG 95%品質）
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      // A4サイズ設定
      const pdfWidth = 210;
      const pdfHeight = 297;

      // 縦横比計算（改善版）
      const canvasAspectRatio = canvas.width / canvas.height;
      const pageAspectRatio = pdfWidth / pdfHeight;

      let finalWidth, finalHeight, offsetX, offsetY;

      // より精密な配置計算
      if (canvasAspectRatio > pageAspectRatio) {
        finalWidth = pdfWidth - 10; // マージン考慮
        finalHeight = (pdfWidth - 10) / canvasAspectRatio;
        offsetX = 5;
        offsetY = (pdfHeight - finalHeight) / 2;
      } else {
        finalHeight = pdfHeight - 10; // マージン考慮
        finalWidth = (pdfHeight - 10) * canvasAspectRatio;
        offsetX = (pdfWidth - finalWidth) / 2;
        offsetY = 5;
      }

      // 高品質画像追加
      pdf.addImage(
        imgData,
        "JPEG",
        offsetX,
        offsetY,
        finalWidth,
        finalHeight,
        undefined,
        "FAST" // 高速圧縮アルゴリズム
      );

      // PDFダウンロード
      const documentLabel = getDocumentTypeLabel(data);
      pdf.save(`${documentLabel}_${data.estimateNumber}.pdf`);

      // クリーンアップ
      document.body.removeChild(tempDiv);
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

  // 印刷ハンドラー
  const handlePrint = async () => {
    if (!estimateData) return;

    try {
      const printFrame = document.createElement("iframe");
      document.body.appendChild(printFrame);

      const htmlUrl = createHTMLBlobUrl(estimateData);
      printFrame.src = htmlUrl;

      await new Promise<void>((resolve) => {
        printFrame.onload = () => {
          setTimeout(resolve, 500);
        };
      });

      const printWindow = printFrame.contentWindow;
      if (printWindow) {
        printWindow.focus();
        printWindow.print();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-8" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[85vh] max-h-[calc(100vh-4rem)] flex flex-col mb-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{getDocumentTypeLabel(estimateData)}プレビュー</h3>
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
        <div className="flex-1 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{getDocumentTypeLabel(estimateData)}を生成中...</p>
              </div>
            </div>
          )}

          {displayUrl && !loading && (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{getDocumentTypeLabel(estimateData)}を読み込み中...</p>
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
                <p className="text-gray-600">{getDocumentTypeLabel(estimateData)}プレビューを生成してください</p>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;