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
  const generateAndDownloadPDF = async (data: EstimatePDFData) => {
    try {
      setIsDownloading(true);

      // PDF用のHTMLを生成（isPDF: trueで印刷スタイル強制適用）
      const htmlContent = generateEstimateHTML(data, true);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      
      // PDF生成用の隠し要素としてbodyに追加
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "-9999px";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "210mm";
      tempDiv.style.height = "297mm";
      tempDiv.style.overflow = "hidden";
      document.body.appendChild(tempDiv);

      // 少し待ってからcanvas生成
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const content = tempDiv.querySelector("#estimate-content") as HTMLElement;
      if (!content) {
        throw new Error("見積書コンテンツが見つかりません");
      }

      // コンテンツの実際のサイズを取得
      const contentRect = content.getBoundingClientRect();
      console.log("Content size:", contentRect.width, contentRect.height);

      // Canvas生成の設定を調整（固定幅でキャプチャ）
      const canvas = await html2canvas(content, {
        scale: 2, // 高解像度
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        windowWidth: 794, // A4幅に固定
        windowHeight: Math.max(1123, contentRect.height), // 必要な高さを確保
      });

      // PDF設定
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png", 1.0);
      
      // A4サイズの寸法（mm）
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // キャンバスの縦横比を維持しながら、A4ページに収める
      const canvasAspectRatio = canvas.width / canvas.height;
      const pageAspectRatio = pdfWidth / pdfHeight;
      
      let finalWidth, finalHeight, offsetX, offsetY;
      
      if (canvasAspectRatio > pageAspectRatio) {
        // 横長：幅をページ幅に合わせて、高さを調整
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / canvasAspectRatio;
        offsetX = 0;
        offsetY = (pdfHeight - finalHeight) / 2;
      } else {
        // 縦長：高さをページ高さに合わせて、幅を調整
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * canvasAspectRatio;
        offsetX = (pdfWidth - finalWidth) / 2;
        offsetY = 0;
      }
      
      // 画像を中央配置で追加
      pdf.addImage(imgData, "PNG", offsetX, offsetY, finalWidth, finalHeight);

      // PDFをダウンロード
      pdf.save(`見積書_${data.estimateNumber}.pdf`);
      
      // 一時要素を削除
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
        <div className="flex-1 relative overflow-hidden">
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
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;