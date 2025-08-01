import React, { useRef } from "react";
import { X, Download } from "lucide-react";
import EstimatePDFTemplate from "./EstimatePDFTemplate";
import type { EstimatePDFData } from "../../types/common/pdf/page";
import { downloadElementAsPDF } from "../../utils/simplePdfDownload";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EstimatePDFData;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ isOpen, onClose, data }) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!isOpen) return null;

  const getDocumentTypeLabel = (documentType?: string) => {
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

  const handleDownload = async () => {
    if (!pdfRef.current) return;

    try {
      setIsDownloading(true);
      const documentLabel = getDocumentTypeLabel(data.document_type);
      const filename = `${documentLabel}_${data.estimateNumber}.pdf`;

      await downloadElementAsPDF(pdfRef.current, {
        filename,
        quality: 0.95,
        scale: 3,
      });
    } catch (error) {
      console.error("PDF download error:", error);
      alert("PDFのダウンロードに失敗しました");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />

        <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{getDocumentTypeLabel(data.document_type)}プレビュー</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    PDFダウンロード
                  </>
                )}
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* プレビューコンテンツ */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div ref={pdfRef} id="pdf-content">
                <EstimatePDFTemplate data={data} />
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">プレビューを確認してからダウンロードしてください</p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
