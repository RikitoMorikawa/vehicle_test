"use client";

import React from "react";
import { Newspaper, Clock, BellRing, ArrowRight } from "lucide-react";
import { AnimatedSectionComponent } from "@/components/AnimatedSection";

interface NewsSectionProps {
  AnimatedSection: AnimatedSectionComponent;
}

const NewsSection: React.FC<NewsSectionProps> = ({ AnimatedSection }) => {
  return (
    <AnimatedSection id="news" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* 背景装飾 - Purposeセクションと同様の丸いパターン */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-indigo-50 opacity-80"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-blue-50 opacity-80"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-50 opacity-90"></div>
        <div className="absolute top-60 right-1/3 w-20 h-20 rounded-full bg-cyan-50 opacity-80 animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 rounded-full bg-pink-50 opacity-90"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 mb-3">Updates</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">News</span>
          </h2>
          <h3 className="text-xl text-gray-600">ニュース</h3>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-indigo-500 to-blue-500 text-white p-4 rounded-full">
                    <Newspaper size={30} />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">現在、ニュースはありません</h3>
                <div className="flex items-center justify-center text-gray-500 text-sm mb-4">
                  <Clock size={16} className="mr-1" />
                  <span>Coming soon</span>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  最新のニュースやイベント情報はこちらに掲載いたします。 新しい情報が追加されるまでしばらくお待ちください。
                </p>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-dashed border-indigo-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-indigo-100 p-2 rounded-full text-indigo-500">
                      <BellRing size={20} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">ニュースの更新をお知りになりたい方は</h4>
                    <p className="text-gray-600 text-sm mb-3">お問い合わせフォームからメールアドレスをご登録いただけます。 更新情報を随時お届けします。</p>
                    <a href="/contact" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                      お問い合わせフォームへ
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          </div>

          {/* 近日公開 - 空白カード
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-30 hover:opacity-50 transition-opacity">
              <div className="h-6 w-1/3 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
              <div className="h-24 bg-gray-100 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-30 hover:opacity-50 transition-opacity">
              <div className="h-6 w-1/3 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
              <div className="h-24 bg-gray-100 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div> */}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default NewsSection;
