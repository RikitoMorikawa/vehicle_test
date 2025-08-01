"use client";

import React from "react";
import { Lightbulb, Sparkles, Stars, MessageCircle, Heart } from "lucide-react";
import { AnimatedSectionComponent } from "@/components/AnimatedSection";

interface PurposeSectionProps {
  AnimatedSection: AnimatedSectionComponent;
}

const PurposeSection: React.FC<PurposeSectionProps> = ({ AnimatedSection }) => {
  return (
    <AnimatedSection id="purpose" className="py-16 md:py-20 overflow-hidden relative bg-white">
      {/* 背景装飾 - 浮かぶ形 */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-50 opacity-40"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-indigo-50 opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-50 opacity-40"></div>
        <div className="absolute top-60 right-1/3 w-20 h-20 rounded-full bg-cyan-50 opacity-60 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mb-3">Our Mission</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Purpose</span>
          </h2>
          <h3 className="text-lg md:text-xl text-gray-600">私たちの目的</h3>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
          {/* 装飾的な要素 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-100 opacity-50 blur-xl"></div>

          <div className="mb-8 md:mb-12 flex justify-center">
            <div className="relative inline-flex items-center justify-center">
              {/* カスタムアニメーションクラスを使用してアニメーション速度を遅くする */}
              <div
                className="absolute inset-0 rounded-full bg-indigo-300 opacity-40"
                style={{ animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }}
              ></div>
              <div
                className="absolute inset-0 scale-110 rounded-full bg-indigo-200"
                style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
              ></div>

              {/* メインのアイコン */}
              <div className="relative rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white shadow-lg transform hover:scale-110 transition-all duration-300">
                <MessageCircle size={28} className="md:w-8 md:h-8" />
              </div>

              {/* 星のアイコン */}
              <div className="absolute -right-3 -bottom-2">
                <Stars size={18} className="text-purple-500 md:w-5 md:h-5" />
              </div>
            </div>
          </div>

          <h3 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 mb-6 md:mb-8 leading-tight">
            想いを届けるための最強の武器
          </h3>

          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            <p className="text-sm md:text-xl text-gray-800 text-center leading-relaxed tracking-wide">
              <span className="font-bold text-indigo-700">SNSは、ただの情報発信ではない。</span>
              <br className="hidden md:block" />
              <span className="inline md:hidden"> </span>
              誰に、何を、どう伝えるか。そこにこだわることで、共感と反応を生む時代。
            </p>

            <p className="text-sm md:text-xl text-gray-700 text-center leading-relaxed">
              私たちは、発信者の中にある本質的なメッセージを引き出し、言葉とビジュアルに落とし込むことで、 エンドユーザーの心に届く発信を設計します。
            </p>

            <p className="text-sm md:text-xl text-gray-700 text-center leading-relaxed">
              SNSは、気持ちを伝え、世界とつながるためのツール。
              <br className="hidden md:block" />
              だからこそ、ただ投稿するのではなく、
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold">「伝えるべきこと」</span>
              を明確にし、可視化することが何より重要だと考えています。
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PurposeSection;
