import React, { useState, useEffect } from 'react';
import { AuthFormData, FormError, Company } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Input from './ui/Input';
import Button from './ui/Button';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { signUp } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    company_name: '',
    user_name: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setCompanies(data || []);
      } catch (err) {
        console.error('会社データの取得に失敗しました:', err);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormError]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormError = {};
    
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }

    if (!formData.company_name) {
      newErrors.company_name = '会社名を選択してください';
    }

    if (!formData.user_name) {
      newErrors.user_name = '担当者名を入力してください';
    }

    if (!formData.phone) {
      newErrors.phone = '電話番号を入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        {
          email: formData.email,
          company_name: formData.company_name!,
          user_name: formData.user_name!,
          phone: formData.phone!
        }
      );
      
      if (error) {
        setErrors({ general: error.message });
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setErrors({ general: '予期せぬエラーが発生しました' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {errors.general}
        </div>
      )}
      
      <Input
        label="メールアドレス"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="例: example@example.com"
        error={errors.email}
        autoComplete="email"
        disabled={isLoading}
      />
      
      <Input
        label="パスワード"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={errors.password}
        autoComplete="new-password"
        disabled={isLoading}
      />

      <div className="space-y-1">
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
          会社名
        </label>
        <select
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md ${
            errors.company_name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {companies.map((company) => (
            <option key={company.id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.company_name && (
          <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
        )}
      </div>

      <Input
        label="担当者名"
        type="text"
        name="user_name"
        value={formData.user_name}
        onChange={handleChange}
        placeholder="山田太郎"
        error={errors.user_name}
        disabled={isLoading}
      />

      <Input
        label="電話番号"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="03-1234-5678"
        error={errors.phone}
        disabled={isLoading}
      />
      
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        className="bg-red-600 hover:bg-red-700"
      >
        アカウント作成
      </Button>
    </form>
  );
};

export default RegisterForm;