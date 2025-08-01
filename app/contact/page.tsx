"use client";

import React from "react";
import ContactFormWithServerAction from "@/components/ContactForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 共通ヘッダー */}
      <Header variant="secondary" />

      {/* ヒーローセクション */}
      <div className="pt-20 relative overflow-hidden bg-gradient-to-b from-indigo-900 to-blue-900 text-white">
        {/* 背景装飾 - 丸い形 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500 opacity-10 animate-pulse" style={{ animationDuration: "8s" }}></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500 opacity-10 animate-pulse" style={{ animationDuration: "12s" }}></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-purple-500 opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-indigo-200">Contact Us</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-blue-100 mb-8">お問い合わせ・ご相談はこちらからお気軽にどうぞ</p>
          </div>
        </div>

        {/* 波形装飾（下部） */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* お問い合わせフォームセクション */}
      <main className="py-16 relative">
        {/* 背景装飾 - 丸いパターン */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-50 opacity-40"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-indigo-50 opacity-30"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-50 opacity-40"></div>
          <div className="absolute top-60 right-1/3 w-20 h-20 rounded-full bg-cyan-50 opacity-40 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 mb-3">Get in Touch</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">お問い合わせフォーム</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                下記のフォームに必要事項をご記入の上、送信してください。
                <br />
                担当者が確認次第、ご連絡いたします。
              </p>

              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="w-full mx-auto">
              <ContactFormWithServerAction />
            </div>

            <div className="mt-16">
              <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">その他のお問い合わせ方法</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 transform hover:-translate-y-1 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white mb-4">
                    <Mail size={20} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Email</h4>
                  <a href="mailto:nomuray3@outlook.jp" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    contact@yyy-3.com
                  </a>
                </div>

                <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 transform hover:-translate-y-1 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white mb-4">
                    <MapPin size={20} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">所在地</h4>
                  <p className="text-gray-600">東京都世田谷区</p>
                </div>

                <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 transform hover:-translate-y-1 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full text-white mb-4">
                    <Phone size={20} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">営業時間</h4>
                  <p className="text-gray-600">平日 10:00〜18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
