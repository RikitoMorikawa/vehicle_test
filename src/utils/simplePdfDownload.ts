import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

/**
 * 注文書専用：ページを分離して生成
 */
export const downloadOrderElementAsPDF = async (element: HTMLElement, options: PDFOptions = {}): Promise<void> => {
  const { filename = "document.pdf", quality = 0.95, scale = 2 } = options;

  try {
    // PDF作成
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // A4サイズの設定
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 3;

    // 1. メインページを取得（特約条項を除外）
    const mainPageElement = element.cloneNode(true) as HTMLElement;

    // 特約条項部分を削除
    const specialTermsElements = mainPageElement.querySelectorAll('.order-terms-page, [class*="special-terms"]');
    specialTermsElements.forEach((el) => el.remove());

    // メインページをhidden divに追加
    const tempMainDiv = document.createElement("div");
    tempMainDiv.style.position = "absolute";
    tempMainDiv.style.left = "-9999px";
    tempMainDiv.style.top = "0";
    tempMainDiv.style.width = "390mm"; // 横幅最大化
    tempMainDiv.appendChild(mainPageElement);
    document.body.appendChild(tempMainDiv);

    try {
      // メインページをCanvas化
      const mainCanvas = await html2canvas(mainPageElement, {
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

      // メインページをPDFに追加
      const mainImgWidth = pdfWidth - margin * 2;
      const mainImgHeight = (mainCanvas.height * mainImgWidth) / mainCanvas.width;

      let finalMainHeight = mainImgHeight;
      let finalMainWidth = mainImgWidth;

      if (mainImgHeight > pdfHeight - margin * 2) {
        finalMainHeight = pdfHeight - margin * 2;
        finalMainWidth = (mainCanvas.width * finalMainHeight) / mainCanvas.height;
      }

      const mainX = (pdfWidth - finalMainWidth) / 2;
      const mainY = (pdfHeight - finalMainHeight) / 2;

      const mainImgData = mainCanvas.toDataURL("image/jpeg", quality);
      pdf.addImage(mainImgData, "JPEG", mainX, mainY, finalMainWidth, finalMainHeight);

      // 2. 特約条項ページを取得
      const originalSpecialTerms = element.querySelector(".order-terms-page");

      if (originalSpecialTerms) {
        // 新しいページを追加
        pdf.addPage();

        // 特約条項要素をクローン
        const specialTermsElement = originalSpecialTerms.cloneNode(true) as HTMLElement;

        // 特約条項をhidden divに追加
        const tempSpecialDiv = document.createElement("div");
        tempSpecialDiv.style.position = "absolute";
        tempSpecialDiv.style.left = "-9999px";
        tempSpecialDiv.style.top = "0";
        tempSpecialDiv.style.width = "250mm";
        tempSpecialDiv.appendChild(specialTermsElement);
        document.body.appendChild(tempSpecialDiv);

        try {
          // 特約条項をCanvas化
          const specialCanvas = await html2canvas(specialTermsElement, {
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

          // 特約条項をPDFに追加
          const specialImgWidth = pdfWidth - margin * 2;
          const specialImgHeight = (specialCanvas.height * specialImgWidth) / specialCanvas.width;

          let finalSpecialHeight = specialImgHeight;
          let finalSpecialWidth = specialImgWidth;

          if (specialImgHeight > pdfHeight - margin * 2) {
            finalSpecialHeight = pdfHeight - margin * 2;
            finalSpecialWidth = (specialCanvas.width * finalSpecialHeight) / specialCanvas.height;
          }

          const specialX = (pdfWidth - finalSpecialWidth) / 2;
          const specialY = (pdfHeight - finalSpecialHeight) / 2;

          const specialImgData = specialCanvas.toDataURL("image/jpeg", quality);
          pdf.addImage(specialImgData, "JPEG", specialX, specialY, finalSpecialWidth, finalSpecialHeight);
        } finally {
          // 特約条項の一時要素を削除
          document.body.removeChild(tempSpecialDiv);
        }
      }
    } finally {
      // メインページの一時要素を削除
      document.body.removeChild(tempMainDiv);
    }

    // PDFをダウンロード
    pdf.save(filename);
  } catch (error) {
    console.error("注文書PDF生成エラー:", error);
    throw new Error("注文書PDFの生成に失敗しました");
  }
};

/**
 * 既存の単一ページPDF生成（見積書・請求書用）
 */
/**
 * 既存の単一ページPDF生成（見積書・請求書用）- 横幅390mmに統一
 */
export const downloadSinglePageElementAsPDF = async (element: HTMLElement, options: PDFOptions = {}): Promise<void> => {
  const { filename = "document.pdf", quality = 0.95, scale = 2 } = options;

  try {
    // 要素をクローンして一時divに追加（注文書と同様の処理）
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // 一時divを作成して横幅を390mmに設定
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.style.width = "390mm"; // 注文書のメインページと同じ横幅
    tempDiv.appendChild(clonedElement);
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(clonedElement, {
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
      const margin = 3;

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
    } finally {
      // 一時要素を削除
      document.body.removeChild(tempDiv);
    }
  } catch (error) {
    console.error("PDF生成エラー:", error);
    throw new Error("PDFの生成に失敗しました");
  }
};

/**
 * メイン関数：ドキュメントタイプに応じて適切な生成方法を選択
 */
export const downloadElementAsPDF = async (element: HTMLElement, options: PDFOptions = {}): Promise<void> => {
  // ドキュメントタイプを確認
  const documentTypeElement = element.querySelector("[data-document-type]") as HTMLElement;
  const documentType = documentTypeElement?.getAttribute("data-document-type");

  if (documentType === "order") {
    // 注文書：ページ分離処理
    return downloadOrderElementAsPDF(element, options);
  } else {
    // 見積書・請求書：単一ページ処理
    return downloadSinglePageElementAsPDF(element, options);
  }
};

/**
 * 下位互換性のため既存関数名もエクスポート
 */
export const downloadMultiPageElementAsPDF = downloadOrderElementAsPDF;
