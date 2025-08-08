// src/containers/vehicle-register/page.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleRegisterService } from "../../services/vehicle-register/page";
import VehicleRegisterComponent from "../../components/vehicle-register/page";
import type { VehicleFormData, VehicleRegisterError } from "../../types/vehicle-register/page";
import { validateVehicleRegisterForm } from "../../validations/vehicle-register/page";
import { supabase } from "../../lib/supabase";
import { makerService } from "../../services/common/car_makers/page";
import { vehicleIdService } from "../../services/vehicle-register/vehicleIdService";

const VehicleRegisterContainer: React.FC = () => {
  const navigate = useNavigate();
  // 複数画像対応のための変更部分
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [view360ImagePreviews, setView360ImagePreviews] = useState<string[]>([]);
  const [view360Files, setView360Files] = useState<File[]>([]);
  // 車両メーカーの取得
  const { data: carMakers, isLoading: isLoadingMakers } = makerService.useMakers();

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
    accident_history: "false", // 初期値はfalse
    recycling_deposit: "false", // 初期値はfalse
    registration_date: "",
    tax_rate: "",
    images: [], // 複数画像対応のため配列に変更
  });
  const [error, setError] = useState<VehicleRegisterError | null>(null);

  const registerVehicle = vehicleRegisterService.useRegisterVehicle();

  // コンポーネント初期表示時に車両IDを自動生成
  useEffect(() => {
    const generateVehicleId = async () => {
      try {
        const nextVehicleId = await vehicleIdService.generateNextVehicleId();
        setFormData((prev) => ({
          ...prev,
          vehicle_id: nextVehicleId,
        }));
      } catch (error) {
        console.error("車両ID生成エラー:", error);
      }
    };

    generateVehicleId();
  }, []); // 初回のみ実行
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error?.[name as keyof VehicleRegisterError]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  // チェックボックスの状態を処理する関数
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked ? "true" : "false" }));
    if (error?.[name as keyof VehicleRegisterError]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  // 年式の選択肢を生成する関数
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990; // 例として1990年から
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }

    return years;
  };

  const sanitizeFileName = (fileName: string): string => {
    // Remove non-alphanumeric characters (except dots and hyphens)
    const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    // Ensure unique filename with timestamp
    return `${Date.now()}_${sanitized}`;
  };

  // 複数画像対応のためのハンドラー（新規追加）
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 最大5枚まで
    const remainingSlots = 5 - imageFiles.length;
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

  // 画像削除（新規追加）
  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ファイル名でソートするヘルパー関数
  const sortFilesByName = (files: File[]): File[] => {
    return [...files].sort((a, b) => a.name.localeCompare(b.name));
  };

  // 360度ビュー画像を追加する処理（追加）
  const handleView360ImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // FileListをFile[]に変換し、ファイル名でソート
    const newFiles = sortFilesByName(Array.from(files));
    setView360Files((prev) => sortFilesByName([...prev, ...newFiles]));

    // プレビュー用のURLを生成
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setView360ImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 360度ビュー画像を削除する処理（追加）
  const handleRemoveView360Image = (index: number) => {
    setView360ImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setView360Files((prev) => {
      const newFiles = [...prev];
      if (index < newFiles.length) {
        newFiles.splice(index, 1);
      }
      return newFiles;
    });
  };

  // 更新：Zodバリデーションを使用
  const validateForm = (): boolean => {
    const validation = validateVehicleRegisterForm({
      ...formData,
      imageFiles, // 複数ファイル対応
    });

    if (!validation.success) {
      setError(validation.errors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // エラーをリセット
    setError(null);

    // 車両画像の必須チェック（バリデーション前に実行）
    if (imageFiles.length === 0) {
      setError({
        images: "車両画像は最低1枚選択してください",
      });
      return;
    }
    
    if (!validateForm()) return;

    try {
      // 複数画像のアップロード処理（変更部分）
      const images: string[] = [];

      // 複数メイン画像のアップロード
      for (const file of imageFiles) {
        const sanitizedFileName = sanitizeFileName(file.name);
        const { error: uploadError } = await supabase.storage.from("vehicle-images").upload(sanitizedFileName, file);

        if (uploadError) throw uploadError;
        images.push(sanitizedFileName);
      }

      const view360_images: string[] = [];

      // 360度ビュー画像のアップロード（追加）
      if (view360Files.length > 0) {
        // 登録時には vehicle ID がまだないので、一時IDを生成
        // 実際のIDはデータベース登録後に取得し、後でファイル名を更新する必要がある
        const tempId = `temp_${Date.now()}`;

        // 新しい画像をアップロード
        const sortedFiles = sortFilesByName(view360Files);
        const paddedLength = sortedFiles.length.toString().length;

        for (let i = 0; i < sortedFiles.length; i++) {
          const file = sortedFiles[i];
          const fileExt = file.name.split(".").pop();
          const paddedIndex = (i + 1).toString().padStart(paddedLength, "0");
          const fileName = `${tempId}/${paddedIndex}.${fileExt}`;

          const { error: uploadError } = await supabase.storage.from("vehicle-360").upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          });

          if (uploadError) throw uploadError;
          view360_images.push(fileName);
        }
      }

      // 車両データの登録（複数画像対応）
      const result = await registerVehicle.mutateAsync({
        ...formData,
        images,
        view360_images,
      });

      // 登録後に実際のIDを取得し、360度ビュー画像のパスを更新する処理
      if (view360_images.length > 0 && result && result.id) {
        // 一時IDから実際のIDにファイルを移動する処理
        // この部分は vehicleRegisterHandler.registerVehicle の実装によって異なる
        await updateView360ImagePaths(view360_images, result.id);
      }

      navigate("/vehicles");
    } catch (err: unknown) {
      console.error(err);
      setError({
        general: err instanceof Error ? err.message : "車両の登録に失敗しました",
      });
    }
  };

  // 一時IDから実際のIDに360度ビュー画像のパスを更新する関数
  const updateView360ImagePaths = async (oldPaths: string[], newId: string) => {
    try {
      // これはサーバーハンドラーで実装するか、ここで直接実装するかは設計によって異なる
      // ここではサンプルとして直接実装

      const newPaths: string[] = [];

      // 各ファイルを新しいパスにコピー
      for (const oldPath of oldPaths) {
        const fileName = oldPath.split("/").pop() || "";
        const newPath = `${newId}/${fileName}`;

        // ファイルをコピー
        const { data: fileData } = await supabase.storage.from("vehicle-360").download(oldPath);

        if (fileData) {
          // 新しいパスにアップロード
          await supabase.storage.from("vehicle-360").upload(newPath, fileData, { upsert: true });

          newPaths.push(newPath);
        }

        // 古いファイルを削除
        await supabase.storage.from("vehicle-360").remove([oldPath]);
      }

      // データベースの view360_images を更新
      if (newPaths.length > 0) {
        await supabase.from("vehicles").update({ view360_images: newPaths }).eq("id", newId);
      }
    } catch (error) {
      console.error("Failed to update 360 view image paths:", error);
      // エラーは表示するが、メイン処理は完了しているので例外は投げない
    }
  };

  return (
    <VehicleRegisterComponent
      formData={formData}
      isLoading={registerVehicle.isPending || isLoadingMakers}
      error={error}
      // 複数画像対応のprops変更
      imagePreviews={imagePreviews}
      onImagesChange={handleImagesChange}
      onRemoveImage={handleRemoveImage}
      view360ImagePreviews={view360ImagePreviews}
      onInputChange={handleInputChange}
      onCheckboxChange={handleCheckboxChange}
      onView360ImagesChange={handleView360ImagesChange}
      onRemoveView360Image={handleRemoveView360Image}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/vehicles")}
      carMakers={carMakers || []}
      generateYearOptions={generateYearOptions}
    />
  );
};

export default VehicleRegisterContainer;
