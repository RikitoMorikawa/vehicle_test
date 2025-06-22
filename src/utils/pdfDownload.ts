// src/utils/pdfDownload.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateEstimateHTML } from "../components/common/PDFHtmlContent";
import type { EstimatePDFData } from "../types/common/pdf/page";

// ドキュメントタイプのラベル取得
const getDocumentTypeLabel = (estimateData: EstimatePDFData): string => {
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

// PDF生成とダウンロード関数
export const generateAndDownloadPDF = async (data: EstimatePDFData): Promise<void> => {
  let tempDiv: HTMLElement | null = null;
  const contractPage: HTMLElement | null = null;
  let originalBodyOverflow: string | null = null;

  try {
    // 高解像度PDF用のHTMLを生成
    const htmlContent = generateEstimateHTML(data, true);
    tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // PDF生成用の隠し要素設定（レイアウトに影響しないように改善）
    tempDiv.style.position = "absolute";
    tempDiv.style.top = "-999999px";
    tempDiv.style.left = "-999999px";
    tempDiv.style.width = "210mm";
    tempDiv.style.height = "297mm";
    tempDiv.style.overflow = "hidden";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.pointerEvents = "none";
    tempDiv.style.zIndex = "-9999";
    tempDiv.style.opacity = "0";
    tempDiv.style.transform = "scale(1)";

    // 一時的にbodyのoverflowを保存して制御
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.body.appendChild(tempDiv);

    // レンダリング待機時間を延長
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const content = tempDiv.querySelector("#estimate-content") as HTMLElement;
    if (!content) {
      throw new Error("見積書コンテンツが見つかりません");
    }

    // 高解像度Canvas生成
    const canvas = await html2canvas(content, {
      scale: 4, // 高解像度
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: true,
      windowWidth: 794,
      windowHeight: Math.max(1123, content.scrollHeight),
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

    // 複数ページ対応
    const documentType = data.document_type || "estimate";

    if (documentType === "order") {
      // 注文書の場合：2ページに分割

      // 1ページ目（estimate-content部分）
      const firstPageContent = tempDiv.querySelector("#estimate-content") as HTMLElement;
      // 2ページ目（contract-terms部分）
      const contractTerms = tempDiv.querySelector(".contract-terms") as HTMLElement;

      if (firstPageContent && contractTerms) {
        // A4サイズ設定（共通）
        const pdfWidth = 210;
        const pdfHeight = 297;

        // 1ページ目をキャプチャ
        const firstPageCanvas = await html2canvas(firstPageContent, {
          scale: 4,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          allowTaint: true,
          windowWidth: 794,
          windowHeight: 1123,
          imageTimeout: 15000,
        });

        // 座標検証とデフォルト値設定（1ページ目）
        if (firstPageCanvas.width > 0 && firstPageCanvas.height > 0) {
          const firstPageImg = firstPageCanvas.toDataURL("image/jpeg", 0.95);

          let firstWidth = pdfWidth - 10;
          let firstHeight = (pdfWidth - 10) / (firstPageCanvas.width / firstPageCanvas.height);
          let firstOffsetX = 5;
          let firstOffsetY = Math.max(5, (pdfHeight - firstHeight) / 2);

          // 座標値の検証
          if (isNaN(firstWidth) || isNaN(firstHeight) || isNaN(firstOffsetX) || isNaN(firstOffsetY)) {
            firstWidth = pdfWidth - 10;
            firstHeight = pdfHeight - 10;
            firstOffsetX = 5;
            firstOffsetY = 5;
          }

          // 範囲チェック
          firstWidth = Math.max(10, Math.min(firstWidth, pdfWidth - 10));
          firstHeight = Math.max(10, Math.min(firstHeight, pdfHeight - 10));
          firstOffsetX = Math.max(0, Math.min(firstOffsetX, pdfWidth - firstWidth));
          firstOffsetY = Math.max(0, Math.min(firstOffsetY, pdfHeight - firstHeight));

          pdf.addImage(firstPageImg, "JPEG", firstOffsetX, firstOffsetY, firstWidth, firstHeight, undefined, "FAST");
        }

        // 2ページ目を追加
        pdf.addPage();

        // 特約条項の親要素を作成してスタイル適用
        const contractPage = document.createElement("div");
        contractPage.style.width = "210mm";
        contractPage.style.minHeight = "297mm";
        contractPage.style.padding = "15mm";
        contractPage.style.backgroundColor = "#ffffff";
        contractPage.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", sans-serif';
        contractPage.style.fontSize = "8px";
        contractPage.style.lineHeight = "1.4";
        contractPage.style.color = "#000";

        // 特約条項のHTMLをコピー
        contractPage.innerHTML = contractTerms.outerHTML;

        // 一時的にbodyに追加（レイアウトに影響しないように）
        contractPage.style.position = "absolute";
        contractPage.style.top = "-999999px";
        contractPage.style.left = "-999999px";
        contractPage.style.visibility = "hidden";
        contractPage.style.pointerEvents = "none";
        contractPage.style.zIndex = "-9999";
        contractPage.style.opacity = "0";
        document.body.appendChild(contractPage);

        // レンダリング待機
        await new Promise((resolve) => setTimeout(resolve, 500));

        const secondPageCanvas = await html2canvas(contractPage, {
          scale: 4,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          allowTaint: true,
          windowWidth: 794,
          windowHeight: 1123,
          imageTimeout: 15000,
        });

        // 座標検証とデフォルト値設定（2ページ目）
        if (secondPageCanvas.width > 0 && secondPageCanvas.height > 0) {
          const secondPageImg = secondPageCanvas.toDataURL("image/jpeg", 0.95);

          let secondWidth = pdfWidth - 10;
          let secondHeight = (pdfWidth - 10) / (secondPageCanvas.width / secondPageCanvas.height);
          let secondOffsetX = 5;
          let secondOffsetY = Math.max(5, (pdfHeight - secondHeight) / 2);

          // 座標値の検証
          if (isNaN(secondWidth) || isNaN(secondHeight) || isNaN(secondOffsetX) || isNaN(secondOffsetY)) {
            secondWidth = pdfWidth - 10;
            secondHeight = pdfHeight - 10;
            secondOffsetX = 5;
            secondOffsetY = 5;
          }

          // 範囲チェック
          secondWidth = Math.max(10, Math.min(secondWidth, pdfWidth - 10));
          secondHeight = Math.max(10, Math.min(secondHeight, pdfHeight - 10));
          secondOffsetX = Math.max(0, Math.min(secondOffsetX, pdfWidth - secondWidth));
          secondOffsetY = Math.max(0, Math.min(secondOffsetY, pdfHeight - secondHeight));

          pdf.addImage(secondPageImg, "JPEG", secondOffsetX, secondOffsetY, secondWidth, secondHeight, undefined, "FAST");
        }

        // クリーンアップ：一時的に追加した要素を削除
        document.body.removeChild(contractPage);
      } else {
        // 要素が見つからない場合のフォールバック
        console.warn("必要な要素が見つかりません。1ページ版で生成します。");
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(imgData, "JPEG", 5, 5, 200, 287, undefined, "FAST");
      }
    } else {
      // 見積書・請求書の場合：1ページのみ
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      // A4サイズ設定
      const pdfWidth = 210;
      const pdfHeight = 297;

      let finalWidth = pdfWidth - 10;
      let finalHeight = (pdfWidth - 10) / (canvas.width / canvas.height);
      let offsetX = 5;
      let offsetY = Math.max(5, (pdfHeight - finalHeight) / 2);

      // 座標値の検証
      if (isNaN(finalWidth) || isNaN(finalHeight) || isNaN(offsetX) || isNaN(offsetY)) {
        finalWidth = pdfWidth - 10;
        finalHeight = pdfHeight - 10;
        offsetX = 5;
        offsetY = 5;
      }

      // 範囲チェック
      finalWidth = Math.max(10, Math.min(finalWidth, pdfWidth - 10));
      finalHeight = Math.max(10, Math.min(finalHeight, pdfHeight - 10));
      offsetX = Math.max(0, Math.min(offsetX, pdfWidth - finalWidth));
      offsetY = Math.max(0, Math.min(offsetY, pdfHeight - finalHeight));

      pdf.addImage(imgData, "JPEG", offsetX, offsetY, finalWidth, finalHeight, undefined, "FAST");
    }

    // PDFダウンロード
    const documentLabel = getDocumentTypeLabel(data);
    pdf.save(`${documentLabel}_${data.estimateNumber}.pdf`);
  } catch (error) {
    console.error("PDF生成エラー:", error);
    throw new Error("PDFの生成に失敗しました。もう一度お試しください。");
  } finally {
    // クリーンアップ処理を確実に実行
    try {
      if (contractPage && document.body.contains(contractPage)) {
        document.body.removeChild(contractPage);
      }
      if (tempDiv && document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
      if (originalBodyOverflow !== null) {
        document.body.style.overflow = originalBodyOverflow;
      }
    } catch (cleanupError) {
      console.error("クリーンアップエラー:", cleanupError);
    }
  }
};
