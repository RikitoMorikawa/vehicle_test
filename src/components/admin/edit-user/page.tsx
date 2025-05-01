import React from "react";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

interface EditUserComponentProps {
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  formData: {
    company_name: string;
    user_name: string;
    phone: string;
    email: string;
    password: string;
    currentPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EditUserComponent: React.FC<EditUserComponentProps> = ({ loading, saving, error, success, formData, onInputChange, onSubmit, onCancel }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
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
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">ユーザー編集</h1>
              </div>

              {error && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <div className="p-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <Input label="会社名" name="company_name" value={formData.company_name} onChange={onInputChange} disabled={saving} />
                  <Input label="担当者名" name="user_name" value={formData.user_name} onChange={onInputChange} disabled={saving} />
                  <Input label="電話番号" name="phone" value={formData.phone} onChange={onInputChange} disabled={saving} />
                  <Input label="メールアドレス" name="email" type="email" value={formData.email} onChange={onInputChange} disabled={saving} />
                  <Input
                    label="現在のパスワード"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={onInputChange}
                    disabled={true}
                  />
                  <Input
                    label="新しいパスワード（変更する場合のみ）"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={onInputChange}
                    disabled={saving}
                  />
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
                      キャンセル
                    </Button>
                    <Button type="submit" isLoading={saving}>
                      保存
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EditUserComponent;
