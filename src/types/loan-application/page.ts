// types/loan-application/page.ts

// 車両型定義
export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    // 他の車両関連フィールド
  }
  
  // フォームデータ型定義
  export interface LoanApplicationFormData {
    customer_name: string;
    customer_name_kana: string;
    customer_birth_date: string;
    customer_postal_code: string;
    customer_address: string;
    customer_phone: string;
    customer_mobile_phone: string;
    employer_name: string;
    employer_postal_code: string;
    employer_address: string;
    employer_phone: string;
    employment_type: string;
    years_employed: string;
    annual_income: string;
    identification_doc: File | null;
    income_doc: File | null;
    vehicle_price: string;
    down_payment: string;
    payment_months: string;
    bonus_months: string;
    bonus_amount: string;
    guarantor_name: string;
    guarantor_name_kana: string;
    guarantor_relationship: string;
    guarantor_phone: string;
    guarantor_postal_code: string;
    guarantor_address: string;
    notes: string;
    [key: string]: string | File | null; // インデックスシグネチャ
  }
  
  // エラー型定義
  export interface LoanApplicationError {
    customer_name?: string;
    customer_name_kana?: string;
    customer_birth_date?: string;
    customer_postal_code?: string;
    customer_address?: string;
    customer_phone?: string;
    customer_mobile_phone?: string;
    employer_name?: string;
    employer_postal_code?: string;
    employer_address?: string;
    employer_phone?: string;
    employment_type?: string;
    years_employed?: string;
    annual_income?: string;
    identification_doc?: string;
    income_doc?: string;
    vehicle_price?: string;
    down_payment?: string;
    payment_months?: string;
    bonus_months?: string;
    bonus_amount?: string;
    guarantor_name?: string;
    guarantor_name_kana?: string;
    guarantor_relationship?: string;
    guarantor_phone?: string;
    guarantor_postal_code?: string;
    guarantor_address?: string;
    notes?: string;
    general?: string;
    [key: string]: string | undefined;
  }
  
  // コンポーネントProps型定義
  export interface LoanApplicationComponentProps {
    vehicle: Vehicle | null; // nullを許容するように修正
    formData: LoanApplicationFormData;
    error: LoanApplicationError | null;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onFileChange: (name: string, file: File) => void;
  }
  
  // サービスパラメータ型定義
  export interface SubmitLoanApplicationParams {
    userId: string;
    vehicleId: string;
    formData: LoanApplicationFormData;
  }
  