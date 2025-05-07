// src/components/ui-parts/View360Viewer.tsx
import React, { useEffect, useRef, useState } from "react";

interface View360ViewerProps {
  vehicleId: string;
  images: string[];
  className?: string;
  isActive: boolean; // タブがアクティブかどうかを示すプロパティを追加
}

// 画像キャッシュ用のグローバルオブジェクト
const imageCache: Record<string, HTMLImageElement[]> = {};

/**
 * 360度ビュー画像を表示するコンポーネント
 * @param vehicleId 車両ID
 * @param images 画像URLの配列
 * @param className カスタムクラス名
 * @param isActive タブがアクティブかどうか
 */
const View360Viewer: React.FC<View360ViewerProps> = ({ vehicleId, images, className = "", isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // 回転の感度調整 - 大きい値ほど鈍感になる
  const rotationSensitivity = 20; // 調整可能な値

  // キャッシュキー（車両ID）
  const cacheKey = vehicleId;

  // isActiveが変更されたときに画像URLを再生成
  useEffect(() => {
    if (isActive) {
      // 画像のURLを再生成
      const urls = images.map((path) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-360/${path}?t=${Date.now()}`);
      setImageUrls(urls);

      // キャッシュをクリア
      delete imageCache[cacheKey];
    }
  }, [isActive, images, cacheKey]);

  // 画像のロード
  useEffect(() => {
    // 画像がない場合やURLが設定されていない場合は早期リターン
    if (images.length === 0 || imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    // キャッシュから読み込むか、画像をロードする
    const loadImages = async () => {
      // すでにキャッシュがある場合はそれを使用
      if (imageCache[cacheKey] && imageCache[cacheKey].length === images.length) {
        setIsLoading(false);
        return;
      }

      // キャッシュがない場合は画像をロード
      setIsLoading(true);
      const imageElements: HTMLImageElement[] = [];

      // ロード処理のプロミスを作成
      const loadPromises = imageUrls.map((url, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;

          img.onload = () => {
            imageElements[index] = img;
            resolve();
          };

          img.onerror = () => {
            console.error(`Failed to load image: ${url}`);
            resolve();
          };
        });
      });

      // すべての画像ロードを待機
      await Promise.all(loadPromises);

      // キャッシュに保存
      imageCache[cacheKey] = [...imageElements];
      setIsLoading(false);
    };

    loadImages();
  }, [cacheKey, images.length, imageUrls]);

  // マウスイベント処理 - ドラッグで回転
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const diffX = e.clientX - startX;
    if (Math.abs(diffX) > rotationSensitivity) {
      // 右にドラッグ = 反時計回り = 前の画像
      // 左にドラッグ = 時計回り = 次の画像
      const newIndex = diffX > 0 ? (currentIndex - 1 + images.length) % images.length : (currentIndex + 1) % images.length;

      setCurrentIndex(newIndex);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // タッチイベント処理 - モバイル対応
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const diffX = e.touches[0].clientX - startX;
    if (Math.abs(diffX) > rotationSensitivity) {
      // 右にドラッグ = 反時計回り = 前の画像
      // 左にドラッグ = 時計回り = 次の画像
      const newIndex = diffX > 0 ? (currentIndex - 1 + images.length) % images.length : (currentIndex + 1) % images.length;

      setCurrentIndex(newIndex);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // ホイールイベント処理 - スクロールでの回転を防止
  const handleWheel = (e: React.WheelEvent) => {
    // スクロールイベントが親要素に伝播しないように防止
    e.stopPropagation();
  };

  // サムネイルをクリックしたときの処理
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // 画像がない場合のフォールバック表示
  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center p-12 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-gray-500">この車両の360度ビュー画像はありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <p className="text-sm text-gray-500">360度ビュー画像 ({images.length}枚)</p>
      </div>

      {isLoading ? (
        <div className="w-full aspect-square border rounded-lg bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full aspect-square border rounded-lg bg-white overflow-hidden flex items-center justify-center cursor-grab select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 現在選択されている画像を表示 */}
          {imageUrls.length > 0 && (
            <img src={imageUrls[currentIndex]} alt={`View ${currentIndex + 1}`} className="w-full h-full object-contain" draggable={false} />
          )}
        </div>
      )}

      {/* サムネイル表示 */}
      {!isLoading && (
        <div className="mt-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className={`relative flex-shrink-0 w-16 h-16 border rounded cursor-pointer overflow-hidden ${
                  index === currentIndex ? "border-red-500 border-2" : "border-gray-200"
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img src={url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 text-sm text-gray-500">
        <p>マウスドラッグで回転、またはサムネイルをクリックで特定の角度を表示</p>
      </div>
    </div>
  );
};

export default View360Viewer;
