import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import EditUserComponent from '../../../components/admin/edit-user/page';

interface UserFormData {
  company_name: string;
  user_name: string;
  phone: string;
  email: string;
  password: string;
  currentPassword: string;
}

const EditUserContainer: React.FC = () => {
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

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <EditUserComponent
      loading={loading}
      saving={saving}
      error={error}
      success={success}
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default EditUserContainer;