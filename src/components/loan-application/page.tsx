import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import type { LoanApplicationComponentProps } from "../../types/loan-application/page";

const LoanApplicationComponent: React.FC<LoanApplicationComponentProps> = ({ formData, error, isLoading, onSubmit, onInputChange, onFileChange }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">ローン審査申込</h1>
              </div>

              {error?.general && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">{error.general}</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="p-6 space-y-8">
                {/* 基本情報 */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-medium mb-4">基本情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="お名前" name="customer_name" value={formData.customer_name} onChange={onInputChange} error={error?.customer_name} required />
                    <Input
                      label="フリガナ"
                      name="customer_name_kana"
                      value={formData.customer_name_kana}
                      onChange={onInputChange}
                      error={error?.customer_name_kana}
                      required
                    />
                    <Input
                      label="生年月日"
                      name="customer_birth_date"
                      type="date"
                      value={formData.customer_birth_date}
                      onChange={onInputChange}
                      error={error?.customer_birth_date}
                      required
                    />
                    <Input
                      label="郵便番号"
                      name="customer_postal_code"
                      value={formData.customer_postal_code}
                      onChange={onInputChange}
                      error={error?.customer_postal_code}
                      required
                      placeholder="123-4567"
                    />
                    <Input
                      label="住所"
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={onInputChange}
                      error={error?.customer_address}
                      required
                      className="col-span-2"
                    />
                    <Input
                      label="固定電話"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={onInputChange}
                      error={error?.customer_phone}
                      placeholder="03-1234-5678"
                    />
                    <Input
                      label="携帯電話"
                      name="customer_mobile_phone"
                      value={formData.customer_mobile_phone}
                      onChange={onInputChange}
                      error={error?.customer_mobile_phone}
                      required
                      placeholder="090-1234-5678"
                    />
                  </div>
                </div>

                {/* 居住情報（新規追加） */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-medium mb-4">居住情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="居住形態"
                      name="residence_type"
                      value={formData.residence_type}
                      onChange={onInputChange}
                      error={error?.residence_type}
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="持ち家">持ち家</option>
                      <option value="賃貸マンション">賃貸マンション</option>
                      <option value="賃貸アパート">賃貸アパート</option>
                      <option value="社宅">社宅</option>
                      <option value="その他">その他</option>
                    </Select>
                    <Input
                      label="居住年数"
                      name="residence_years"
                      type="number"
                      value={formData.residence_years}
                      onChange={onInputChange}
                      error={error?.residence_years}
                      required
                      min="0"
                      max="100"
                      placeholder="5年"
                    />
                    <Select
                      label="配偶者の有無"
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={onInputChange}
                      error={error?.marital_status}
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="未婚">未婚</option>
                      <option value="既婚">既婚</option>
                      <option value="離婚">離婚</option>
                      <option value="その他">その他</option>
                    </Select>
                    <Input
                      label="扶養人数"
                      name="dependents_count"
                      type="number"
                      value={formData.dependents_count}
                      onChange={onInputChange}
                      error={error?.dependents_count}
                      min="0"
                      max="20"
                      placeholder="0人"
                    />
                    <Input
                      label="家族構成"
                      name="family_composition"
                      value={formData.family_composition}
                      onChange={onInputChange}
                      error={error?.family_composition}
                      className="col-span-2"
                      placeholder="例：本人、配偶者、子供2人"
                    />
                  </div>
                </div>

                {/* 勤務先情報 */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-medium mb-4">勤務先情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="勤務先名称"
                      name="employer_name"
                      value={formData.employer_name}
                      onChange={onInputChange}
                      error={error?.employer_name}
                      required
                    />
                    <Input
                      label="勤務先郵便番号"
                      name="employer_postal_code"
                      value={formData.employer_postal_code}
                      onChange={onInputChange}
                      error={error?.employer_postal_code}
                      required
                      placeholder="123-4567"
                    />
                    <Input
                      label="勤務先住所"
                      name="employer_address"
                      value={formData.employer_address}
                      onChange={onInputChange}
                      error={error?.employer_address}
                      required
                      className="col-span-2"
                    />
                    <Input
                      label="勤務先電話番号"
                      name="employer_phone"
                      value={formData.employer_phone}
                      onChange={onInputChange}
                      error={error?.employer_phone}
                      required
                      placeholder="03-1234-5678"
                    />
                    <Select
                      label="雇用形態"
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={onInputChange}
                      error={error?.employment_type}
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="正社員">正社員</option>
                      <option value="契約社員">契約社員</option>
                      <option value="パート・アルバイト">パート・アルバイト</option>
                      <option value="自営業">自営業</option>
                      <option value="公務員">公務員</option>
                    </Select>
                    <Input
                      label="勤続年数"
                      name="years_employed"
                      type="number"
                      value={formData.years_employed}
                      onChange={onInputChange}
                      error={error?.years_employed}
                      required
                      min="0"
                      max="50"
                      placeholder="3"
                    />
                    <Input
                      label="年収（万円）"
                      name="annual_income"
                      type="number"
                      value={formData.annual_income}
                      onChange={onInputChange}
                      error={error?.annual_income}
                      required
                      min="0"
                      placeholder="400"
                    />
                  </div>
                </div>

                {/* 書類情報 */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-medium mb-4">必要書類</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        本人確認書類 <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-500 mb-2">運転免許証、パスポート、マイナンバーカードなど</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files && onFileChange("identification_doc", e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      />
                      {error?.identification_doc && <p className="mt-1 text-sm text-red-600">{error.identification_doc}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        収入証明書類 <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-500 mb-2">源泉徴収票、給与明細書、確定申告書など</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files && onFileChange("income_doc", e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      />
                      {error?.income_doc && <p className="mt-1 text-sm text-red-600">{error.income_doc}</p>}
                    </div>
                  </div>
                </div>

                {/* ローン情報 */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-medium mb-4">ローン情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="車両価格（万円）"
                      name="vehicle_price"
                      type="number"
                      value={formData.vehicle_price}
                      onChange={onInputChange}
                      error={error?.vehicle_price}
                      required
                      min="1"
                      placeholder="300"
                    />
                    <Input
                      label="頭金（万円）"
                      name="down_payment"
                      type="number"
                      value={formData.down_payment}
                      onChange={onInputChange}
                      error={error?.down_payment}
                      required
                      min="0"
                      placeholder="50"
                    />
                    <Select
                      label="支払回数"
                      name="payment_months"
                      value={formData.payment_months}
                      onChange={onInputChange}
                      error={error?.payment_months}
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="12">12回 (1年)</option>
                      <option value="24">24回 (2年)</option>
                      <option value="36">36回 (3年)</option>
                      <option value="48">48回 (4年)</option>
                      <option value="60">60回 (5年)</option>
                      <option value="72">72回 (6年)</option>
                      <option value="84">84回 (7年)</option>
                    </Select>
                    <Input
                      label="ボーナス加算額（万円）"
                      name="bonus_amount"
                      type="number"
                      value={formData.bonus_amount}
                      onChange={onInputChange}
                      error={error?.bonus_amount}
                      min="0"
                      placeholder="10"
                    />
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">ボーナス加算月</label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                          const monthStr = month.toString();
                          const selectedMonths = (formData.bonus_months || "").split(",").filter(Boolean);
                          const isChecked = selectedMonths.includes(monthStr);

                          return (
                            <Checkbox
                              key={month}
                              id={`bonus_month_${month}`}
                              label={`${month}月`}
                              name="bonus_months"
                              value={month}
                              checked={isChecked}
                              onChange={(e) => {
                                const currentMonths = selectedMonths;
                                let newMonths: string[];

                                if (e.target.checked) {
                                  // 追加
                                  newMonths = [...currentMonths, monthStr].sort((a, b) => Number(a) - Number(b));
                                } else {
                                  // 削除
                                  newMonths = currentMonths.filter((m) => m !== monthStr);
                                }

                                const newValue = newMonths.join(",");
                                onInputChange({
                                  target: { name: "bonus_months", value: newValue },
                                } as React.ChangeEvent<HTMLInputElement>);
                              }}
                            />
                          );
                        })}
                      </div>
                      {error?.bonus_months && <p className="mt-1 text-sm text-red-600">{error.bonus_months}</p>}
                    </div>

                  </div>
                </div>

                {/* 連帯保証人情報 */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-medium mb-4">連帯保証人情報（任意）</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="連帯保証人氏名"
                      name="guarantor_name"
                      value={formData.guarantor_name}
                      onChange={onInputChange}
                      error={error?.guarantor_name}
                    />
                    <Input
                      label="連帯保証人フリガナ"
                      name="guarantor_name_kana"
                      value={formData.guarantor_name_kana}
                      onChange={onInputChange}
                      error={error?.guarantor_name_kana}
                    />
                    <Input
                      label="続柄"
                      name="guarantor_relationship"
                      value={formData.guarantor_relationship}
                      onChange={onInputChange}
                      error={error?.guarantor_relationship}
                      placeholder="例：父、母、配偶者など"
                    />
                    <Input
                      label="電話番号"
                      name="guarantor_phone"
                      value={formData.guarantor_phone}
                      onChange={onInputChange}
                      error={error?.guarantor_phone}
                      placeholder="090-1234-5678"
                    />
                    <Input
                      label="郵便番号"
                      name="guarantor_postal_code"
                      value={formData.guarantor_postal_code}
                      onChange={onInputChange}
                      error={error?.guarantor_postal_code}
                      placeholder="123-4567"
                    />
                    <Input
                      label="住所"
                      name="guarantor_address"
                      value={formData.guarantor_address}
                      onChange={onInputChange}
                      error={error?.guarantor_address}
                      className="col-span-2"
                    />
                  </div>
                </div>

                {/* 備考 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                  <textarea
                    name="notes"
                    value={formData.notes || ""}
                    onChange={onInputChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-red-500 focus:ring-red-500 border"
                    placeholder="その他ご質問やご要望がございましたらご記入ください"
                  />
                  {error?.notes && <p className="mt-1 text-sm text-red-600">{error.notes}</p>}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="submit" isLoading={isLoading}>
                    申込む
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LoanApplicationComponent;
