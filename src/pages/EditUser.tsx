import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface UserFormData {
  company_name: string;
  user_name: string;
  phone: string;
  email: string;
  password: string;
  currentPassword: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    company_name: '',
    user_name: '',
    phone: '',
    email: '',
    password: '',
    currentPassword: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            company_name: data.company_name || '',
            user_name: data.user_name || '',
            phone: data.phone || '',
            email: data.email || '',
            password: '',
            currentPassword: data.password || ''
          });
        }
      } catch (err) {
        setError('ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: Partial<UserFormData> = {
        company_name: formData.company_name,
        user_name: formData.user_name,
        phone: formData.phone,
        email: formData.email
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setSuccess('ユーザー情報を更新しました');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError('ユーザー情報の更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="会社名"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                  <Input
                    label="担当者名"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                  <Input
                    label="電話番号"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                  <Input
                    label="メールアドレス"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                  <Input
                    label="現在のパスワード"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                  <Input
                    label="新しいパスワード（変更する場合のみ）"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/admin')}
                      disabled={saving}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      isLoading={saving}
                    >
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

export default EditUser;