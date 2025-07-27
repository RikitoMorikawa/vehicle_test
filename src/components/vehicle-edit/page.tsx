// src/components/vehicle-edit/page.tsx
import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import type { VehicleFormData, VehicleRegisterError } from "../../types/vehicle-register/page";
import { RotateCw, Info, Image } from "lucide-react";
import SortableView360Images from "../ui-parts/vehicle-detail/SortableView360Images";
import { CarMaker } from "../../types/db/car_makers";
import Select from "../ui/Select";

interface VehicleEditComponentProps {
  formData: VehicleFormData;
  isLoading: boolean;
  isSaving: boolean;
  error: VehicleRegisterError | null;
  imagePreviews: string[]; // imagePreview → imagePreviews に変更
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // onImageChange → onImagesChange に変更
  onRemoveImage: (index: number) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isDeleting: boolean;
  onDelete: () => void;
  view360ImagePreviews: string[];
  onView360ImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveView360Image: (index: number) => void;
  onReorderView360Images: (newOrder: string[]) => void;
  carMakers: CarMaker[];
  generateYearOptions: () => number[];
}

const VehicleEditComponent: React.FC<VehicleEditComponentProps> = ({
  formData,
  isLoading,
  isSaving,
  error,
  imagePreviews, // imagePreview → imagePreviews に変更
  onImagesChange, // onImageChange → onImagesChange に変更
  onRemoveImage,
  onInputChange,
  onCheckboxChange,
  onSubmit,
  onCancel,
  isDeleting,
  onDelete,
  view360ImagePreviews,
  onView360ImagesChange,
  onRemoveView360Image,
  onReorderView360Images,
  carMakers,
  generateYearOptions,
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
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">車両画像（最大5枚）</label>
                    {error?.images && <p className="text-sm text-red-600">{error.images}</p>}
                  </div>

                  {/* 既存画像の表示 */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`車両画像 ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                          <button
                            type="button"
                            onClick={() => onRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 統一された画像アップロードエリア */}
                  {imagePreviews.length < 5 && (
                    <div
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                        error?.images ? "border-red-300" : "border-slate-300"
                      } border-dashed rounded-md`}
                    >
                      <div className="space-y-1 text-center">
                        <div className="flex flex-col items-center">
                          <Image className={`mx-auto h-12 w-12 ${error?.images ? "text-red-400" : "text-gray-400"}`} />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-500 hover:text-teal-600">
                              <span>{imagePreviews.length > 0 ? `画像を追加（あと${5 - imagePreviews.length}枚）` : "画像をアップロード（最大5枚）"}</span>
                              <input id="image-upload" type="file" accept="image/*" multiple className="hidden" onChange={onImagesChange} />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          {error?.images && <p className="text-xs text-red-500 mt-1">{error.images}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* 360度ビュー用の画像アップロードセクション */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-slate-700">360度ビュー画像</label>
                    <div className="ml-2 cursor-pointer group relative">
                      <Info className="h-4 w-4 text-gray-400" />
                      <div className="hidden group-hover:block absolute z-10 w-72 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                        複数の角度から撮影した画像をアップロードしてください。これらの画像は360度ビューアーで表示されます。
                        画像はドラッグして表示順序を変更できます。
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 border-2 border-slate-300 border-dashed rounded-md p-4">
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
                {/* 基本情報 */}
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-lg font-medium text-slate-700 mb-4">基本情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="車両ID" name="vehicle_id" value={formData.vehicle_id} onChange={onInputChange} error={error?.vehicle_id} required />
                    <Select label="メーカー" name="maker" value={formData.maker} onChange={onInputChange} error={error?.maker} required>
                      <option value="">選択してください</option>
                      {carMakers.map((maker) => (
                        <option key={maker.id} value={maker.name}>
                          {maker.name}
                        </option>
                      ))}
                    </Select>
                    <Input label="車名" name="name" value={formData.name} onChange={onInputChange} error={error?.name} required />
                    <Input label="型式" name="model_code" value={formData.model_code} onChange={onInputChange} error={error?.model_code} required />
                    <Select label="年式" name="year" value={formData.year} onChange={onInputChange} error={error?.year} required>
                      <option value="">選択してください</option>
                      {generateYearOptions().map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}年
                        </option>
                      ))}
                    </Select>
                    <Input
                      label="走行距離 (km)"
                      name="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={onInputChange}
                      error={error?.mileage}
                      required
                    />

                    {/* 新規フィールド: 車両ステータス */}
                    <Select label="車両状態" name="vehicle_status" value={formData.vehicle_status || ""} onChange={onInputChange} error={error?.vehicle_status}>
                      <option value="">選択してください</option>
                      <option value="新車">新車</option>
                      <option value="中古車">中古車</option>
                      <option value="未使用車">未使用車</option>
                    </Select>

                    {/* 新規フィールド: フル型式 */}
                    <Input
                      label="フル型式"
                      name="full_model_code"
                      value={formData.full_model_code || ""}
                      onChange={onInputChange}
                      error={error?.full_model_code}
                    />

                    {/* 新規フィールド: グレード */}
                    <Input label="グレード" name="grade" value={formData.grade || ""} onChange={onInputChange} error={error?.grade} />

                    {/* 新規フィールド: 車両タイプ */}
                    <Select label="車両タイプ" name="body_type" value={formData.body_type || ""} onChange={onInputChange} error={error?.body_type}>
                      <option value="">選択してください</option>
                      <option value="セダン">セダン</option>
                      <option value="SUV">SUV</option>
                      <option value="ハッチバック">ハッチバック</option>
                      <option value="ミニバン">ミニバン</option>
                      <option value="クーペ">クーペ</option>
                      <option value="コンバーチブル">コンバーチブル</option>
                      <option value="ワゴン">ワゴン</option>
                      <option value="トラック">トラック</option>
                      <option value="バン">バン</option>
                      <option value="その他">その他</option>
                    </Select>

                    {/* 新規フィールド: ドア枚数 */}
                    <Select label="ドア枚数" name="door_count" value={formData.door_count || ""} onChange={onInputChange} error={error?.door_count}>
                      <option value="">選択してください</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                {/* 登録・車検情報 */}
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-lg font-medium text-slate-700 mb-4">登録・車検情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 新規フィールド: 登録番号 */}
                    <Input
                      label="登録番号"
                      name="registration_number"
                      value={formData.registration_number || ""}
                      onChange={onInputChange}
                      error={error?.registration_number}
                    />

                    {/* 新規フィールド: 車台番号 */}
                    <Input
                      label="車台番号"
                      name="chassis_number"
                      value={formData.chassis_number || ""}
                      onChange={onInputChange}
                      error={error?.chassis_number}
                    />

                    {/* 新規フィールド: 初度登録年月 */}
                    <Input
                      label="初度登録年月"
                      name="first_registration_date"
                      type="date"
                      value={formData.first_registration_date || ""}
                      onChange={onInputChange}
                      error={error?.first_registration_date}
                    />

                    <Input
                      label="車検満了日"
                      name="inspection_date"
                      type="date"
                      value={formData.inspection_date || ""}
                      onChange={onInputChange}
                      error={error?.inspection_date}
                    />

                    {/* 新規フィールド: 登録年月日 */}
                    <Input
                      label="登録年月日"
                      name="registration_date"
                      type="date"
                      value={formData.registration_date || ""}
                      onChange={onInputChange}
                      error={error?.registration_date}
                    />
                  </div>
                </div>
                {/* 仕様・コンディション */}
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-lg font-medium text-slate-700 mb-4">仕様・コンディション</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Select label="シフト" name="transmission" value={formData.transmission} onChange={onInputChange} error={error?.transmission} required>
                      <option value="">選択してください</option>
                      <option value="AT">AT</option>
                      <option value="MT">MT</option>
                      <option value="CVT">CVT</option>
                    </Select>
                    <Select label="駆動方式" name="drive_system" value={formData.drive_system} onChange={onInputChange} error={error?.drive_system} required>
                      <option value="">選択してください</option>
                      <option value="2WD">2WD</option>
                      <option value="4WD">4WD</option>
                    </Select>

                    {/* 修復歴のチェックボックス - 高さを合わせるためにdivで囲む */}
                    <div className="pt-6 pl-4 flex items-center h-full">
                      <Checkbox
                        label="修復歴あり"
                        name="accident_history"
                        checked={formData.accident_history === "true"}
                        onChange={(e) => onCheckboxChange("accident_history", e.target.checked)}
                        error={error?.accident_history}
                      />
                    </div>
                  </div>
                </div>
                {/* 販売情報 */}
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-lg font-medium text-slate-700 mb-4">販売情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 販売形態 */}
                    <Select label="販売形態" name="sales_format" value={formData.sales_format || ""} onChange={onInputChange} error={error?.sales_format}>
                      <option value="">選択してください</option>
                      <option value="新車販売">新車販売</option>
                      <option value="中古車販売">中古車販売</option>
                      <option value="リース">リース</option>
                      <option value="その他">その他</option>
                    </Select>

                    {/* リサイクル預託金のチェックボックス - 高さを合わせるためにdivで囲む */}
                    <div className="pt-6 pl-4 flex items-center h-full">
                      <Checkbox
                        label="リサイクル預託金あり"
                        name="recycling_deposit"
                        checked={formData.recycling_deposit === "true"}
                        onChange={(e) => onCheckboxChange("recycling_deposit", e.target.checked)}
                        error={error?.recycling_deposit}
                      />
                    </div>

                    {/* 税率 */}
                    <Select label="税率" name="tax_rate" value={formData.tax_rate || ""} onChange={onInputChange} error={error?.tax_rate}>
                      <option value="">選択してください</option>
                      <option value="8">8%</option>
                      <option value="10">10%</option>
                    </Select>
                  </div>
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
