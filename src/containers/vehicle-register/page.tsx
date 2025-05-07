// src/containers/vehicle-register/page.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleRegisterService } from "../../services/vehicle-register/page";
import VehicleRegisterComponent from "../../components/vehicle-register/page";
import type { VehicleFormData, VehicleRegisterError } from "../../types/vehicle-register/page";
import { supabase } from "../../lib/supabase";

const VehicleRegisterContainer: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [view360ImagePreviews, setView360ImagePreviews] = useState<string[]>([]); // 追加
  const [view360Files, setView360Files] = useState<File[]>([]); // 追加
  
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
  const [error, setError] = useState<VehicleRegisterError | null>(null);

  const registerVehicle = vehicleRegisterService.useRegisterVehicle();

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
    setView360Files(prev => sortFilesByName([...prev, ...newFiles]));
    
    // プレビュー用のURLを生成
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setView360ImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // 360度ビュー画像を削除する処理（追加）
  const handleRemoveView360Image = (index: number) => {
    setView360ImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    
    setView360Files(prev => {
      const newFiles = [...prev];
      if (index < newFiles.length) {
        newFiles.splice(index, 1);
      }
      return newFiles;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: VehicleRegisterError = {};
    let isValid = true;

    // 既存のバリデーション...

    if (!formData.image) {
      newErrors.image = "画像を選択してください";
      isValid = false;
    }

    setError(isValid ? null : newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let image_path = "";
      const view360_images: string[] = [];

      // メイン画像のアップロード
      if (formData.image) {
        const sanitizedFileName = sanitizeFileName(formData.image.name);
        const { error: uploadError } = await supabase.storage
          .from("vehicle-images")
          .upload(sanitizedFileName, formData.image);

        if (uploadError) throw uploadError;
        image_path = sanitizedFileName;
      }

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
          const fileExt = file.name.split('.').pop();
          const paddedIndex = (i + 1).toString().padStart(paddedLength, '0');
          const fileName = `${tempId}/${paddedIndex}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from("vehicle-360")
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) throw uploadError;
          view360_images.push(fileName);
        }
      }

      // 車両データの登録
      const result = await registerVehicle.mutateAsync({
        ...formData,
        image_path,
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
        const fileName = oldPath.split('/').pop() || '';
        const newPath = `${newId}/${fileName}`;
        
        // ファイルをコピー
        const { data: fileData } = await supabase.storage
          .from("vehicle-360")
          .download(oldPath);
          
        if (fileData) {
          // 新しいパスにアップロード
          await supabase.storage
            .from("vehicle-360")
            .upload(newPath, fileData, { upsert: true });
            
          newPaths.push(newPath);
        }
        
        // 古いファイルを削除
        await supabase.storage
          .from("vehicle-360")
          .remove([oldPath]);
      }
      
      // データベースの view360_images を更新
      if (newPaths.length > 0) {
        await supabase
          .from('vehicles')
          .update({ view360_images: newPaths })
          .eq('id', newId);
      }
    } catch (error) {
      console.error("Failed to update 360 view image paths:", error);
      // エラーは表示するが、メイン処理は完了しているので例外は投げない
    }
  };

  return (
    <VehicleRegisterComponent
      formData={formData}
      isLoading={registerVehicle.isPending}
      error={error}
      imagePreview={imagePreview}
      view360ImagePreviews={view360ImagePreviews} // 追加
      onInputChange={handleInputChange}
      onImageChange={handleImageChange}
      onView360ImagesChange={handleView360ImagesChange} // 追加
      onRemoveView360Image={handleRemoveView360Image} // 追加
      onSubmit={handleSubmit}
      onCancel={() => navigate("/vehicles")}
    />
  );
};

export default VehicleRegisterContainer;