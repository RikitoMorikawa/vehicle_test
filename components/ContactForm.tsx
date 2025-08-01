"use client";

import React, { useState } from "react";
import { Mail, User, MessageSquare, Send, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { sendContactEmail } from "@/app/contact/actions";

export default function ContactFormWithServerAction() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // サーバーアクションを呼び出し
      const result = await sendContactEmail(formData);

      setSubmitResult(result);

      if (result.success) {
        // 送信成功時にフォームを無効化
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("フォーム送信エラー:", error);
      setSubmitResult({
        success: false,
        message: "送信中にエラーが発生しました。後でもう一度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    // 新しい問い合わせを可能にする
    setFormData({
      name: "",
      email: "",
      message: "",
    });
    setIsSubmitted(false);
    setSubmitResult(null);
  };

  return (
    <div className="rounded-2xl overflow-hidden">
      {/* グラデーションのトップバー */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      {/* フォーム本体 */}
      <div className="bg-white p-6 sm:p-8 rounded-b-2xl shadow-lg border border-gray-100">
        {submitResult && (
          <div
            className={`p-4 mb-6 rounded-xl text-base ${
              submitResult.success ? "bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100" : "bg-red-50 border border-red-100"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {submitResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 text-red-500 flex items-center justify-center">
                    <span className="text-lg">×</span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${submitResult.success ? "text-indigo-800" : "text-red-800"}`}>{submitResult.message}</p>
                {submitResult.success && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-2 inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <RefreshCw className="mr-1.5 h-3 w-3" />
                    新しい問い合わせを作成
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center text-sm">
              <User size={16} className="mr-2 text-indigo-600" />
              <span>Name / お名前</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitted}
                className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-800
                  ${isSubmitted ? "bg-gray-100 cursor-not-allowed opacity-75" : "hover:border-indigo-300"}`}
                required
                maxLength={50}
                placeholder="例: 山田 太郎"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-0">
                <User size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center text-sm">
              <Mail size={16} className="mr-2 text-indigo-600" />
              <span>Email / メールアドレス</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitted}
                className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-800
                  ${isSubmitted ? "bg-gray-100 cursor-not-allowed opacity-75" : "hover:border-indigo-300"}`}
                required
                placeholder="例: yamada@example.com"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-0">
                <Mail size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center text-sm">
              <MessageSquare size={16} className="mr-2 text-indigo-600" />
              <span>Message / メッセージ</span>
            </label>
            <div className="relative">
              <textarea
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitted}
                className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-800
                  ${isSubmitted ? "bg-gray-100 cursor-not-allowed opacity-75" : "hover:border-indigo-300"}`}
                required
                maxLength={3000}
                placeholder="お問い合わせ内容をご記入ください"
              ></textarea>
            </div>
            <div className="flex justify-end mt-1.5">
              <span
                className={`text-xs ${formData.message.length > 2700 ? (formData.message.length > 2900 ? "text-red-500" : "text-amber-500") : "text-gray-500"}`}
              >
                {formData.message.length}/3000文字
              </span>
            </div>
          </div>

          {!isSubmitted ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 text-white py-3.5 px-6 rounded-lg transition-all duration-300 transform hover:shadow-lg flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2">
                    <RefreshCw size={18} />
                  </div>
                  <span>送信中... / Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  <span>Send Message / 送信</span>
                  <div className="absolute right-4 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-3.5 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" />
              <span>新しい問い合わせを作成</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
