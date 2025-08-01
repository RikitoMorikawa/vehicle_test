// src/containers/vehicle-edit/page.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VehicleEditComponent from "../../components/vehicle-edit/page";
import { vehicleEditService } from "../../services/vehicle-edit/page";
import { validateVehicleEditForm } from "../../validations/vehicle-edit/page";
import type { VehicleFormData, VehicleRegisterError } from "../../types/vehicle-register/page";
import { supabase } from "../../lib/supabase";
import { makerService } from "../../services/common/car_makers/page";

const VehicleEditContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<VehicleRegisterError | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { data: vehicle, isLoading } = vehicleEditService.useVehicle(id!);
  const updateVehicle = vehicleEditService.useUpdateVehicle();
  const [view360ImagePreviews, setView360ImagePreviews] = useState<string[]>([]);
  const [view360Files, setView360Files] = useState<File[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]); // 元々存在していた画像パス
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // 削除対象の既存画像パス
  // 削除用のミューテーションを追加
  const deleteVehicle = vehicleEditService.useDeleteVehicle();
  // 車両メーカーの取得
  const { data: carMakers, isLoading: isLoadingMakers } = makerService.useMakers();
  // 既存のファイルパスを保存するステートを追加
  const [originalView360Paths, setOriginalView360Paths] = useState<string[]>([]);
  // 並べ替え後のファイルと元のパスの対応関係
  const [view360FileMap, setView360FileMap] = useState<{ [key: string]: File }>({});

  const [formData, setFormData] = useState<VehicleFormData>({
    name: "",
    maker: "",
    year: new Date().getFullYear().toString(),
    mileage: "",
    price: "",
    model_code: "",
    color: "",
    engine_size: "",
    transmission: "",
    drive_system: "",
    inspection_date: "",
    vehicle_id: "",
    // 新しいフィールドの初期値
    vehicle_status: "",
    full_model_code: "",
    grade: "",
    registration_number: "",
    first_registration_date: "",
    chassis_number: "",
    body_type: "",
    door_count: "",
    desired_number: "",
    sales_format: "",
    accident_history: "",
    recycling_deposit: "",
    registration_date: "",
    tax_rate: "",
    images: [],
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name,
        maker: vehicle.maker,
        year: vehicle.year.toString(),
        mileage: vehicle.mileage.toString(),
        price: vehicle.price.toString(),
        model_code: vehicle.model_code || "",
        color: vehicle.color || "",
        engine_size: vehicle.engine_size?.toString() || "",
        transmission: vehicle.transmission || "",
        drive_system: vehicle.drive_system || "",
        inspection_date: vehicle.inspection_date || "",
        vehicle_id: vehicle.vehicle_id || "",
        images: Array.isArray(vehicle.images) ? vehicle.images : [],
        vehicle_status: vehicle.vehicle_status || "",
        full_model_code: vehicle.full_model_code || "",
        grade: vehicle.grade || "",
        registration_number: vehicle.registration_number || "",
        first_registration_date: vehicle.first_registration_date || "",
        chassis_number: vehicle.chassis_number || "",
        body_type: vehicle.body_type || "",
        door_count: vehicle.door_count?.toString() || "",
        desired_number: vehicle.desired_number || "",
        sales_format: vehicle.sales_format || "",
        accident_history: vehicle.accident_history ? "true" : "false",
        recycling_deposit: vehicle.recycling_deposit ? "true" : "false",
        registration_date: vehicle.registration_date || "",
        tax_rate: vehicle.tax_rate?.toString() || "",
      });

      // 複数画像プレビューの設定
      if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        const previews = vehicle.images.map((path: string) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${path}`);
        setImagePreviews(previews);
        setOriginalImages(vehicle.images); // 元の画像パスを保存
        setDeletedImages([]); // 削除リストをリセット
      }

      // 360度ビュー画像のプレビューを設定
      if (vehicle.view360_images && vehicle.view360_images.length > 0) {
        const previews = vehicle.view360_images.map((path) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-360/${path}`);
        setView360ImagePreviews(previews);
        // 元のパス情報を保存
        setOriginalView360Paths(vehicle.view360_images);
      }
    }
  }, [vehicle]);

  // 年式の選択肢を生成する関数を追加
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990; // 例として1990年から
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }

    return years;
  };

  // ファイル名でソートするヘルパー関数
  const sortFilesByName = (files: File[]): File[] => {
    return [...files].sort((a, b) => a.name.localeCompare(b.name));
  };

  // チェックボックスの状態を処理する関数を追加
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked ? "true" : "false" }));
    if (error?.[name as keyof VehicleRegisterError]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  // 360度ビュー画像を追加する処理
  const handleView360ImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // FileListをFile[]に変換し、ファイル名でソート
    const newFiles = sortFilesByName(Array.from(files));

    // 新しいファイルをセット
    setView360Files((prev) => {
      const updatedFiles = [...prev, ...newFiles];
      return sortFilesByName(updatedFiles);
    });

    // プレビュー用のURLを生成
    const newFileMaps: { [key: string]: File } = {};
    const newPreviews = newFiles.map((file) => {
      const url = URL.createObjectURL(file);
      newFileMaps[url] = file;
      return url;
    });

    // ファイルマップを更新
    setView360FileMap((prev) => ({
      ...prev,
      ...newFileMaps,
    }));

    // プレビューを更新
    setView360ImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 360度ビュー画像を削除する処理
  const handleRemoveView360Image = (index: number) => {
    // プレビューから削除
    const removedPreviewUrl = view360ImagePreviews[index];
    setView360ImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    // ファイルマップから削除
    if (view360FileMap[removedPreviewUrl]) {
      const newFileMap = { ...view360FileMap };
      delete newFileMap[removedPreviewUrl];
      setView360FileMap(newFileMap);
    }

    // 元のパスも削除（元のパスと対応している場合）
    if (index < originalView360Paths.length) {
      setOriginalView360Paths((prev) => {
        const newPaths = [...prev];
        newPaths.splice(index, 1);
        return newPaths;
      });
    }
  };

  // 360度ビュー画像の並べ替え処理
  const handleReorderView360Images = (newOrder: string[]) => {
    console.log("Container received new order:", newOrder);

    // プレビューの順序を更新
    setView360ImagePreviews([...newOrder]);

    // originalView360Pathsも並び替える
    if (originalView360Paths.length > 0) {
      // プレビューURLから元のパスへのマッピングを作成
      const pathMapping: { [key: string]: string } = {};

      vehicle?.view360_images?.forEach((path) => {
        const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-360/${path}`;
        pathMapping[previewUrl] = path;
      });

      // 新しい順序でoriginalView360Pathsを更新
      const reorderedPaths = newOrder.map((previewUrl) => pathMapping[previewUrl]).filter((path) => path !== undefined);

      // 元のパスも含めて全て保存
      if (reorderedPaths.length > 0) {
        setOriginalView360Paths(reorderedPaths);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error?.[name as keyof VehicleRegisterError]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  const sanitizeFileName = (fileName: string): string => {
    // Remove non-alphanumeric characters (except dots and hyphens)
    const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    // Ensure unique filename with timestamp
    return `${Date.now()}_${sanitized}`;
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 現在の画像数（既存 - 削除予定 + 新規追加予定）
    const currentImageCount = originalImages.length - deletedImages.length + imageFiles.length;
    const remainingSlots = 5 - currentImageCount;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setError((prev) => ({
        ...prev,
        images: `最大5枚まで選択できます。${files.length - remainingSlots}枚超過しています。`,
      }));
    }

    // プレビュー作成
    const newPreviews: string[] = [];
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          if (newPreviews.length === filesToAdd.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...filesToAdd]);

    // エラークリア
    if (error?.images) {
      setError((prev) => (prev ? { ...prev, images: undefined } : null));
    }
  };

  // 画像を削除する処理
  const handleRemoveImage = (index: number) => {
    const removedPreviewUrl = imagePreviews[index];

    // プレビューから削除
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    // 既存画像かどうか判定
    const originalImageIndex = originalImages.findIndex((imagePath) => {
      const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${imagePath}`;
      return imageUrl === removedPreviewUrl;
    });

    let newDeletedImages = [...deletedImages];
    let newImageFiles = [...imageFiles];

    if (originalImageIndex !== -1) {
      // 既存画像の場合は削除リストに追加
      const deletedImagePath = originalImages[originalImageIndex];
      newDeletedImages = [...deletedImages, deletedImagePath];
      setDeletedImages(newDeletedImages);
    } else {
      // 新規追加画像の場合はファイルリストから削除
      const newImageIndex = index - (originalImages.length - deletedImages.length);
      if (newImageIndex >= 0) {
        newImageFiles = imageFiles.filter((_, i) => i !== newImageIndex);
        setImageFiles(newImageFiles);
      }
    }

    // 削除後の最終画像数をチェック
    const remainingOriginalImages = originalImages.filter((imagePath) => !newDeletedImages.includes(imagePath));
    const finalImageCount = remainingOriginalImages.length + newImageFiles.length;

    // 最後の1枚を削除しようとした場合の警告
    if (finalImageCount === 0) {
      setError((prev) => ({
        ...prev,
        images: "車両画像は最低1枚必要です",
      }));
    } else {
      // エラーをクリア
      if (error?.images) {
        setError((prev) => (prev ? { ...prev, images: undefined } : null));
      }
    }
  };

  // 送信処理の修正部分
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // エラーをリセット
    setError(null);

    // 最終的な画像数をチェック（既存画像 - 削除予定 + 新規追加）
    const remainingOriginalImages = originalImages.filter((imagePath) => !deletedImages.includes(imagePath));
    const finalImageCount = remainingOriginalImages.length + imageFiles.length;

    // 車両には最低1枚の画像が必要
    if (finalImageCount === 0) {
      setError({
        images: "車両画像は最低1枚必要です",
      });
      return;
    }

    // バリデーション時にimageFilesも含める
    const validation = validateVehicleEditForm({
      ...formData,
      imageFiles: imageFiles || [],
      images: formData.images || [],
    });

    if (!validation.success) {
      setError(validation.errors);
      return;
    }

    try {
      let view360_images: string[] = [];

      // メイン画像の処理
      // 1. 既存画像から削除対象を除外
      const remainingOriginalImages = originalImages.filter((imagePath) => !deletedImages.includes(imagePath));

      // 2. 新規画像をアップロード
      const newUploadedImages: string[] = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const sanitizedFileName = sanitizeFileName(file.name);
          const { error: uploadError } = await supabase.storage.from("vehicle-images").upload(sanitizedFileName, file);

          if (uploadError) throw uploadError;
          newUploadedImages.push(sanitizedFileName);
        }
      }

      // 3. 既存画像 + 新規画像を結合
      const finalImages = [...remainingOriginalImages, ...newUploadedImages];

      // 4. 削除対象の既存画像をStorageから削除
      if (deletedImages.length > 0) {
        const { error: deleteError } = await supabase.storage.from("vehicle-images").remove(deletedImages);

        if (deleteError) {
          console.warn("一部の画像削除に失敗しました:", deleteError);
        }
      }

      // 360度画像の処理（既存のロジックのまま）
      const hasNewImages = view360Files.length > 0;

      if (originalView360Paths.length > 0) {
        view360_images = [...originalView360Paths];
      }

      if (hasNewImages) {
        const baseIndex = view360_images.length;
        const paddedLength = Math.max((baseIndex + view360Files.length).toString().length, 2);

        for (let i = 0; i < view360Files.length; i++) {
          const file = view360Files[i];
          const fileExt = file.name.split(".").pop() || "jpg";
          const paddedIndex = (baseIndex + i + 1).toString().padStart(paddedLength, "0");
          const filePath = `${id}/${paddedIndex}.${fileExt}`;

          try {
            const { error: uploadError } = await supabase.storage.from("vehicle-360").upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            });

            if (uploadError) {
              console.error(`Error uploading 360 image ${filePath}:`, uploadError);
              throw uploadError;
            }

            view360_images.push(filePath);
          } catch (err) {
            console.error(`Failed to upload file ${filePath}:`, err);
          }
        }
      }

      // 車両データの更新
      await updateVehicle.mutateAsync({
        id,
        formData: {
          ...formData,
          images: finalImages,
          view360_images,
          accident_history: formData.accident_history,
          recycling_deposit: formData.recycling_deposit,
        },
      });

      navigate("/vehicles");
    } catch (err: unknown) {
      console.error(err);
      setError({
        general: err instanceof Error ? err.message : "車両の更新に失敗しました",
      });
    }
  };

  // 削除処理を追加
  const handleDelete = async () => {
    if (!id) return;

    // 確認ダイアログ
    if (!window.confirm("この車両を削除してもよろしいですか？この操作は取り消せません。")) {
      return;
    }

    try {
      await deleteVehicle.mutateAsync(id);
      navigate("/vehicles");
    } catch (err: unknown) {
      console.error(err);
      setError({
        general: err instanceof Error ? err.message : "車両の削除に失敗しました",
      });
    }
  };

  return (
    <VehicleEditComponent
      formData={formData}
      isLoading={isLoading || isLoadingMakers}
      isSaving={updateVehicle.isPending}
      error={error}
      imagePreviews={imagePreviews} // 配列型に修正
      onImagesChange={handleImagesChange} // 関数名も変更
      onRemoveImage={handleRemoveImage} // 新規追加
      onInputChange={handleInputChange}
      onCheckboxChange={handleCheckboxChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/vehicles")}
      isDeleting={deleteVehicle.isPending}
      onDelete={handleDelete}
      view360ImagePreviews={view360ImagePreviews}
      onView360ImagesChange={handleView360ImagesChange}
      onRemoveView360Image={handleRemoveView360Image}
      onReorderView360Images={handleReorderView360Images}
      carMakers={carMakers || []}
      generateYearOptions={generateYearOptions}
    />
  );
};

export default VehicleEditContainer;
