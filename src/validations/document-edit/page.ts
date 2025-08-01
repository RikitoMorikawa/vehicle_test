import { z } from "zod";

export const documentEditSchema = z.object({
  estimateNumber: z
    .string()
    .min(1, "資料番号は必須です")
    .max(50, "資料番号は50文字以内で入力してください"),
    
  companyName: z
    .string()
    .max(100, "会社名は100文字以内で入力してください")
    .optional(),
    
  customerName: z
    .string()
    .max(100, "顧客名は100文字以内で入力してください")
    .optional(),
    
  customerEmail: z
    .string()
    .email("正しいメールアドレスを入力してください")
    .max(255, "メールアドレスは255文字以内で入力してください")
    .optional()
    .or(z.literal("")),
    
  customerPhone: z
    .string()
    .max(20, "電話番号は20文字以内で入力してください")
    .optional(),
    
  deliveryDate: z
    .string()
    .optional(),
    
  validUntil: z
    .string()
    .optional(),
    
  notes: z
    .string()
    .max(1000, "備考は1000文字以内で入力してください")
    .optional(),
    
  items: z
    .array(z.any())
    .optional(),
    
  taxRate: z
    .number()
    .min(0, "税率は0以上で入力してください")
    .max(100, "税率は100以下で入力してください")
    .default(10),
    
  documentType: z
    .enum(["estimate", "invoice", "order"])
    .default("estimate")
});

export type DocumentEditFormData = z.infer<typeof documentEditSchema>;
export type DocumentType = "estimate" | "invoice" | "order";

// バリデーション関数
export const validateDocumentEdit = (data: DocumentEditFormData) => {
  try {
    documentEditSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "バリデーションエラーが発生しました" } };
  }
};
