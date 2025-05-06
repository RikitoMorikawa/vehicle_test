// src/components/vehicle-edit/page.tsx
import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Input from "../ui/Input";
import Button from "../ui/Button";
import type { VehicleFormData, VehicleRegisterError } from "../../types/vehicle-register/page";
import { Upload, RotateCw, Info, Image } from "lucide-react";
import SortableView360Images from "../ui-parts/SortableView360Images";

interface VehicleEditComponentProps {
  formData: VehicleFormData;
  isLoading: boolean;
  isSaving: boolean;
  error: VehicleRegisterError | null;
  imagePreview: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isDeleting: boolean;
  onDelete: () => void;
  view360ImagePreviews: string[];
  onView360ImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveView360Image: (index: number) => void;
  onReorderView360Images: (newOrder: string[]) => void;
}

const VehicleEditComponent: React.FC<VehicleEditComponentProps> = ({
  formData,
  isLoading,
  isSaving,
  error,
  imagePreview,
  onInputChange,
  onImageChange,
  onSubmit,
  onCancel,
  isDeleting,
  onDelete,
  view360ImagePreviews,
  onView360ImagesChange,
  onRemoveView360Image,
  onReorderView360Images,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">車両編集</h1>
              </div>

              {error?.general && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">{error.general}</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="p-6 space-y-6">
                {/* 画像アップロード部分 */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">車両画像</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="mx-auto h-64 w-auto rounded-lg" />
                          <label
                            htmlFor="image-upload"
                            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100"
                          >
                            <Upload className="h-5 w-5 text-gray-600" />
                            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                          </label>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Image className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500">
                              <span>画像をアップロード</span>
                              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 360度ビュー用の画像アップロードセクション */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700">360度ビュー画像</label>
                    <div className="ml-2 cursor-pointer group relative">
                      <Info className="h-4 w-4 text-gray-400" />
                      <div className="hidden group-hover:block absolute z-10 w-72 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                        複数の角度から撮影した画像をアップロードしてください。これらの画像は360度ビューアーで表示されます。
                        画像はドラッグして表示順序を変更できます。
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 border-2 border-gray-300 border-dashed rounded-md p-4">
                    <div className="space-y-4">
                      {/* プレビュー画像の表示 - ドラッグ&ドロップで並び替え可能 */}
                      {view360ImagePreviews.length > 0 && (
                        <SortableView360Images
                          key={view360ImagePreviews.join(",")} // 画像URLの配列が変わるたびに再レンダリング
                          images={view360ImagePreviews}
                          onImagesReorder={onReorderView360Images}
                          onRemoveImage={onRemoveView360Image}
                        />
                      )}
                      {/* アップロードボタン */}
                      <div className="flex justify-center">
                        <label
                          htmlFor="view360-upload"
                          className="cursor-pointer flex items-center gap-2 bg-white rounded-md font-medium text-red-600 hover:text-red-500 px-4 py-2 border border-gray-300"
                        >
                          <RotateCw className="h-4 w-4" />
                          360度ビュー用画像を追加
                          <input id="view360-upload" type="file" accept="image/*" multiple className="hidden" onChange={onView360ImagesChange} />
                        </label>
                      </div>
                      <div className="text-xs text-gray-500 text-center space-y-1">
                        <p>PNG, JPG, GIF 最大10MB、複数選択可能</p>
                        <p>ドラッグ＆ドロップで順序を変更できます</p>
                        <p>推奨: 36〜72枚の等間隔で撮影された画像</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="車両ID" name="vehicle_id" value={formData.vehicle_id} onChange={onInputChange} error={error?.vehicle_id} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">メーカー</label>
                    <select
                      name="maker"
                      value={formData.maker}
                      onChange={onInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="トヨタ">トヨタ</option>
                      <option value="日産">日産</option>
                      <option value="ホンダ">ホンダ</option>
                      <option value="マツダ">マツダ</option>
                      <option value="スバル">スバル</option>
                    </select>
                    {error?.maker && <p className="mt-1 text-sm text-red-600">{error.maker}</p>}
                  </div>
                  <Input label="車名" name="name" value={formData.name} onChange={onInputChange} error={error?.name} required />
                  <Input label="型式" name="model_code" value={formData.model_code} onChange={onInputChange} error={error?.model_code} required />
                  <Input label="年式" name="year" type="number" value={formData.year} onChange={onInputChange} error={error?.year} required />
                  <Input label="走行距離 (km)" name="mileage" type="number" value={formData.mileage} onChange={onInputChange} error={error?.mileage} required />
                  <Input label="価格 (円)" name="price" type="number" value={formData.price} onChange={onInputChange} error={error?.price} required />
                  <Input label="ボディカラー" name="color" value={formData.color} onChange={onInputChange} error={error?.color} required />
                  <Input
                    label="排気量 (cc)"
                    name="engine_size"
                    type="number"
                    value={formData.engine_size}
                    onChange={onInputChange}
                    error={error?.engine_size}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">シフト</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={onInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="AT">AT</option>
                      <option value="CVT">CVT</option>
                      <option value="MT">MT</option>
                    </select>
                    {error?.transmission && <p className="mt-1 text-sm text-red-600">{error.transmission}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">駆動方式</label>
                    <select
                      name="drive_system"
                      value={formData.drive_system}
                      onChange={onInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="FF">FF</option>
                      <option value="FR">FR</option>
                      <option value="4WD">4WD</option>
                    </select>
                    {error?.drive_system && <p className="mt-1 text-sm text-red-600">{error.drive_system}</p>}
                  </div>
                  <Input
                    label="車検満了日"
                    name="inspection_date"
                    type="date"
                    value={formData.inspection_date}
                    onChange={onInputChange}
                    error={error?.inspection_date}
                    required
                  />
                </div>
                <div className="flex justify-between space-x-3">
                  {/* 左側に削除ボタンを配置 */}
                  <Button type="button" variant="primary" onClick={onDelete} disabled={isSaving || isDeleting} isLoading={isDeleting}>
                    削除
                  </Button>

                  {/* 右側にキャンセルと更新ボタンを配置 */}
                  <div className="flex space-x-3">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || isDeleting}>
                      キャンセル
                    </Button>
                    <Button type="submit" isLoading={isSaving} disabled={isDeleting}>
                      更新
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleEditComponent;
