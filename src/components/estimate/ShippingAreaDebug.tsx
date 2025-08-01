// src/components/estimate/ShippingAreaDebug.tsx
import React from "react";
import { shippingService } from "../../services/shipping/shipping";

const ShippingAreaDebug: React.FC = () => {
  // データ取得用のフック
  const { data: prefectures = [], isLoading: prefecturesLoading, error: prefecturesError } = shippingService.usePrefectures();
  const { data: allShippingCosts = [], isLoading: allLoading, error: allError } = shippingService.useAllShippingCosts();

  return (
    <div className="border border-red-300 bg-red-50 p-4 rounded-md">
      <h3 className="text-lg font-bold text-red-800 mb-4">配送エリアデータ デバッグ情報</h3>

      {/* 都道府県データの確認 */}
      <div className="mb-6">
        <h4 className="font-semibold text-red-700 mb-2">都道府県データ取得状況</h4>
        <p className="text-sm mb-2">
          <strong>ローディング状態:</strong> {prefecturesLoading ? "読み込み中..." : "完了"}
        </p>

        {prefecturesError && (
          <div className="bg-red-100 p-2 rounded mb-2">
            <strong>エラー:</strong> {prefecturesError.message}
          </div>
        )}

        <p className="text-sm mb-2">
          <strong>取得件数:</strong> {prefectures.length}件
        </p>

        {prefectures.length > 0 && (
          <div className="bg-white p-2 rounded text-xs">
            <strong>都道府県一覧:</strong>
            <ul className="list-disc list-inside">
              {prefectures.slice(0, 5).map((prefecture, index) => (
                <li key={index}>{prefecture}</li>
              ))}
              {prefectures.length > 5 && <li>...他{prefectures.length - 5}件</li>}
            </ul>
          </div>
        )}
      </div>

      {/* 全配送料データの確認 */}
      <div className="mb-6">
        <h4 className="font-semibold text-red-700 mb-2">全配送料データ取得状況</h4>
        <p className="text-sm mb-2">
          <strong>ローディング状態:</strong> {allLoading ? "読み込み中..." : "完了"}
        </p>

        {allError && (
          <div className="bg-red-100 p-2 rounded mb-2">
            <strong>エラー:</strong> {allError.message}
          </div>
        )}

        <p className="text-sm mb-2">
          <strong>取得件数:</strong> {allShippingCosts.length}件
        </p>

        {allShippingCosts.length > 0 && (
          <div className="bg-white p-2 rounded text-xs">
            <strong>最初の3件:</strong>
            <pre className="mt-1 text-xs">{JSON.stringify(allShippingCosts.slice(0, 3), null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Supabase接続確認 */}
      <div className="mb-4">
        <h4 className="font-semibold text-red-700 mb-2">Supabase接続確認</h4>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          onClick={async () => {
            try {
              const { supabase } = await import("../../lib/supabase");
              console.log("Supabase client:", supabase);

              // 直接SQLでテーブル確認
              const { data, error } = await supabase.from("shipping_costs").select("*").limit(1);

              console.log("Direct query result:", { data, error });
              alert(`直接クエリ結果: データ件数=${data?.length || 0}, エラー=${error?.message || "なし"}`);
            } catch (err) {
              console.error("Supabase connection error:", err);
              if (err instanceof Error) {
                alert(`接続エラー: ${err.message}`);
              } else {
                alert("接続エラー: 不明なエラーが発生しました");
              }
            }
          }}
        >
          直接テーブル確認
        </button>
      </div>
    </div>
  );
};

export default ShippingAreaDebug;
