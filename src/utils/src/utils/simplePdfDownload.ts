import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

/**
 * React要素をPDFとしてダウンロードする関数
 */
export const downloadElementAsPDF = async (element: HTMLElement, options: PDFOptions = {}): Promise<void> => {
  const { filename = "document.pdf", quality = 0.95, scale = 2 } = options;

  try {
    // 要素をCanvasに変換
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: true,
      removeContainer: true,
      imageTimeout: 10000,
      onclone: (clonedDoc) => {
        // クローンされたドキュメントでスタイルを調整
        const style = clonedDoc.createElement("style");
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table, th, td {
            border-collapse: collapse !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      },
    });

    // PDFを作成
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // A4サイズの設定
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10;

    // 画像のアスペクト比を計算
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 画像がページに収まるかチェック
    let finalHeight = imgHeight;
    let finalWidth = imgWidth;

    if (imgHeight > pdfHeight - margin * 2) {
      finalHeight = pdfHeight - margin * 2;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    // 中央配置のための計算
    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;

    // 画像をPDFに追加
    const imgData = canvas.toDataURL("image/jpeg", quality);
    pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);

    // PDFをダウンロード
    pdf.save(filename);
  } catch (error) {
    console.error("PDF生成エラー:", error);
    throw new Error("PDFの生成に失敗しました");
  }
};

/**
 * React要素のIDを指定してPDFダウンロードする関数
 */
export const downloadElementByIdAsPDF = async (elementId: string, options: PDFOptions = {}): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`要素が見つかりません: ${elementId}`);
  }

  return downloadElementAsPDF(element, options);
};