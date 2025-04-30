import React, { useState } from 'react';
import { AuthFormData, FormError } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import Input from './ui/Input';
import Button from './ui/Button';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { error, needsApproval } = await signIn(formData.email, formData.password);
      
      if (error) {
        setErrors({ general: error.message });
      } else if (needsApproval) {
        setErrors({ general: 'アカウントは現在承認待ちです。管理者による承認をお待ちください。' });
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
        autoComplete="current-password"
        disabled={isLoading}
      />
      
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        className="bg-red-600 hover:bg-red-700"
      >
        ログイン
      </Button>
    </form>
  );
};

export default LoginForm;