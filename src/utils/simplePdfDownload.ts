import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

/**
 * 複数ページ対応のPDFダウンロード関数
 */
export const downloadMultiPageElementAsPDF = async (element: HTMLElement, options: PDFOptions = {}): Promise<void> => {
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
      height: element.scrollHeight, // 全体の高さを取得
      onclone: (clonedDoc) => {
        // クローンされたドキュメントでスタイルを調整
        const style = clonedDoc.createElement("style");
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          table, th, td {
            border-collapse: collapse !important;
          }
          .page-break-before {
            page-break-before: always;
          }
        `;
        clonedDoc.head.appendChild(style);
      },
    });

    // A4サイズの設定（mm）
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = pdfHeight - margin * 2;

    // 画像サイズの計算
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // PDFを作成
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/jpeg", quality);

    // 1ページに収まる場合
    if (imgHeight <= contentHeight) {
      const y = (pdfHeight - imgHeight) / 2;
      pdf.addImage(imgData, "JPEG", margin, y, imgWidth, imgHeight);
    } else {
      // 複数ページに分割
      const pageCount = Math.ceil(imgHeight / contentHeight);

      for (let page = 0; page < pageCount; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        const sourceY = page * contentHeight * (canvas.height / imgHeight);
        const sourceHeight = Math.min(contentHeight * (canvas.height / imgHeight), canvas.height - sourceY);

        // ページごとに画像を切り取って追加
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);

          const pageImgData = pageCanvas.toDataURL("image/jpeg", quality);
          const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;

          pdf.addImage(pageImgData, "JPEG", margin, margin, imgWidth, pageImgHeight);
        }
      }
    }

    // PDFをダウンロード
    pdf.save(filename);
  } catch (error) {
    console.error("PDF生成エラー:", error);
    throw new Error("PDFの生成に失敗しました");
  }
};

/**
 * 元の関数も残しておく（下位互換性のため）
 */
export const downloadElementAsPDF = async (element: HTMLElement, options: PDFOptions = {}): Promise<void> => {
  // 注文書の場合は複数ページ対応版を使用
  const documentTypeElement = element.querySelector("[data-document-type]") as HTMLElement;
  const documentType = documentTypeElement?.getAttribute("data-document-type");

  if (documentType === "order") {
    return downloadMultiPageElementAsPDF(element, options);
  }

  // 既存の1ページ版を使用
  return downloadSinglePageElementAsPDF(element, options);
};

/**
 * 1ページ用の関数（既存のロジック）
 */
const downloadSinglePageElementAsPDF = async (element: HTMLElement, options: PDFOptions = {}): Promise<void> => {
  const { filename = "document.pdf", quality = 0.95, scale = 2 } = options;

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: true,
      removeContainer: true,
      imageTimeout: 10000,
      onclone: (clonedDoc) => {
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
