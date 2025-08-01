"use client";

import React from "react";
import { Mail, Instagram, Facebook, Twitter, X } from "lucide-react";
import { AnimatedSectionComponent } from "@/components/AnimatedSection";

interface ContactSectionProps {
  AnimatedSection: AnimatedSectionComponent;
}

const ContactSection: React.FC<ContactSectionProps> = ({ AnimatedSection }) => {
  return (
    <AnimatedSection id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* 背景装飾 - Purposeセクションと同様の丸いパターン */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-indigo-50 opacity-80"></div>
        <div className="absolute top-60 -left-32 w-96 h-96 rounded-full bg-blue-50 opacity-80"></div>
        <div className="absolute -bottom-20 right-32 w-64 h-64 rounded-full bg-purple-50 opacity-90"></div>
        <div className="absolute top-40 right-1/4 w-20 h-20 rounded-full bg-pink-50 opacity-80 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/5 w-32 h-32 rounded-full bg-cyan-50 opacity-90"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 mb-3">Get in Touch</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Contact</span>
          </h2>
          <h3 className="text-xl text-gray-600">お問い合わせ</h3>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 mb-8">
              お問い合わせは下記のボタンから専用フォームへお進みください。
              <br />
              担当者が確認次第、ご連絡いたします。
            </p>

            {/* お問い合わせボタン */}
            <div className="flex justify-center mb-12">
              <a
                href="/contact"
                className="relative inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full group hover:shadow-lg hover:shadow-indigo-200 transform transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-blue-600 transition-all duration-1000"></div>
                <span className="relative flex items-center">
                  <Mail className="mr-3" size={20} />
                  お問い合わせフォームへ
                </span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* SNSアイコン */}
          <div className="mb-8">
            <h4 className="text-center text-lg font-medium text-gray-700 mb-6">フォローをお願いします</h4>
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-full text-white shadow-lg hover:shadow-pink-200 transform hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>

              <a
                href="#"
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full text-white shadow-lg hover:shadow-blue-200 transform hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>

              <a
                href="#"
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full text-white shadow-lg hover:shadow-gray-200 transform hover:scale-110 transition-all duration-300"
                aria-label="X (formerly X)"
              >
                <X size={22} />
              </a>
            </div>
            <p className="text-center text-gray-500 mt-6 text-sm">SNSでも最新情報を発信しています</p>
          </div>

          {/* デコレーション要素 */}
          <div className="flex justify-center mt-12">
            <div className="inline-flex space-x-2">
              <div className="w-8 h-1 rounded-full bg-blue-400"></div>
              <div className="w-4 h-1 rounded-full bg-indigo-400"></div>
              <div className="w-2 h-1 rounded-full bg-purple-400"></div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ContactSection;
