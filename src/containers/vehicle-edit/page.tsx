// src/containers/vehicle-edit/page.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VehicleEditComponent from "../../components/vehicle-edit/page";
import { vehicleEditService } from "../../services/vehicle-edit/page";
import { validateVehicleEditForm } from "../../validations/vehicle-edit/page";
import type { VehicleFormData, VehicleRegisterError } from "../../types/vehicle-register/page";
import { supabase } from "../../lib/supabase";

const VehicleEditContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<VehicleRegisterError | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: vehicle, isLoading } = vehicleEditService.useVehicle(id!);
  const updateVehicle = vehicleEditService.useUpdateVehicle();
  const [view360ImagePreviews, setView360ImagePreviews] = useState<string[]>([]);
  const [view360Files, setView360Files] = useState<File[]>([]);
  // 削除用のミューテーションを追加
  const deleteVehicle = vehicleEditService.useDeleteVehicle();

  // 既存のファイルパスを保存するステートを追加
  const [originalView360Paths, setOriginalView360Paths] = useState<string[]>([]);
  // 並べ替え後のファイルと元のパスの対応関係
  const [view360FileMap, setView360FileMap] = useState<{ [key: string]: File }>({});

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
        image_path: vehicle.image_path,
      });

      if (vehicle.image_path) {
        setImagePreview(`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${vehicle.image_path}`);
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
  });

  // ファイル名でソートするヘルパー関数
  const sortFilesByName = (files: File[]): File[] => {
    return [...files].sort((a, b) => a.name.localeCompare(b.name));
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

      vehicle?.view360_images?.forEach((path, index) => {
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

  // 送信処理の修正部分
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const validation = validateVehicleEditForm(formData);
    if (!validation.success) {
      setError(validation.errors);
      return;
    }

    try {
      let image_path = formData.image_path;
      let view360_images: string[] = [];

      // メイン画像のアップロード処理
      if (formData.image) {
        const sanitizedFileName = sanitizeFileName(formData.image.name);
        const { error: uploadError } = await supabase.storage.from("vehicle-images").upload(sanitizedFileName, formData.image);

        if (uploadError) throw uploadError;
        image_path = sanitizedFileName;
      }

      // 360度画像の処理
      const hasNewImages = view360Files.length > 0;

      if (hasNewImages) {
        // 新しい画像がある場合は既存の画像を削除
        if (originalView360Paths.length > 0) {
          try {
            await supabase.storage.from("vehicle-360").remove(originalView360Paths);
          } catch (err) {
            console.error("Error removing existing 360 images:", err);
          }
        }

        // 新しい画像をアップロード - 現在の表示順序でアップロード
        if (view360Files.length > 0) {
          const paddedLength = view360Files.length.toString().length;

          // 新しいファイルを順番に処理
          for (let i = 0; i < view360Files.length; i++) {
            const file = view360Files[i];
            const fileExt = file.name.split(".").pop() || "jpg";
            const paddedIndex = (i + 1).toString().padStart(paddedLength, "0");
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
      } else if (originalView360Paths.length > 0) {
        // 新しい画像がない場合は、並べ替えられたoriginalView360Pathsを使用
        view360_images = originalView360Paths;
      }

      // 車両データの更新
      await updateVehicle.mutateAsync({
        id,
        formData: {
          ...formData,
          image_path,
          view360_images,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({ ...prev, image: file }));
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
      isLoading={isLoading}
      isSaving={updateVehicle.isPending}
      error={error}
      imagePreview={imagePreview}
      onInputChange={handleInputChange}
      onImageChange={handleImageChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/vehicles")}
      isDeleting={deleteVehicle.isPending}
      onDelete={handleDelete}
      view360ImagePreviews={view360ImagePreviews}
      onView360ImagesChange={handleView360ImagesChange}
      onRemoveView360Image={handleRemoveView360Image}
      onReorderView360Images={handleReorderView360Images}
    />
  );
};

export default VehicleEditContainer;
