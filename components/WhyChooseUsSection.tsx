"use client";

import React from "react";
import { CheckCircle, Zap, Users, TrendingUp, BadgeCheck, MessageSquare } from "lucide-react";
import { AnimatedSectionComponent } from "@/components/AnimatedSection";

interface WhyChooseUsSectionProps {
  AnimatedSection: AnimatedSectionComponent;
}

const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ AnimatedSection }) => {
  // 選ばれる理由の項目
  const reasons = [
    {
      icon: <Zap size={24} />,
      title: "迅速なレスポンス",
      description: "お問い合わせから提案まで、スピーディーに対応。急なご依頼にも柔軟に対応します。",
      color: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "実績に基づく提案",
      description: "数々の成功事例を基に、効果的なSNS戦略を提案。データ分析に基づくアプローチで成果を最大化します。",
      color: "from-indigo-600 to-purple-600",
      bgColor: "bg-indigo-100",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "伝わるコンテンツ設計",
      description: "単なる投稿ではなく、ターゲットの心に響くメッセージと視覚的要素を組み合わせたコンテンツを制作します。",
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: <Users size={24} />,
      title: "専門チームの連携",
      description: "SNSマーケティング、デザイン、コピーライティングの専門家が連携し、総合的な視点からサポートします。",
      color: "from-pink-600 to-rose-600",
      bgColor: "bg-pink-100",
    },
    {
      icon: <BadgeCheck size={24} />,
      title: "透明性のある運用",
      description: "数値目標の設定から結果報告まで、すべてのプロセスを明確に共有。進捗状況を常に把握いただけます。",
      color: "from-cyan-600 to-blue-600",
      bgColor: "bg-cyan-100",
    },
    {
      icon: <CheckCircle size={24} />,
      title: "長期的な成長支援",
      description: "一時的な効果だけでなく、ブランド価値を高め、長期的に成長していくためのSNS運用をサポートします。",
      color: "from-teal-600 to-cyan-600",
      bgColor: "bg-teal-100",
    },
  ];

  return (
    <AnimatedSection id="why-choose-us" className="py-20 relative overflow-hidden bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-semibold bg-white/20 text-white mb-3">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">選ばれる理由</h2>
          <h3 className="text-xl text-white/90">私たちが選ばれる6つの理由</h3>
          <div className="w-20 h-1 bg-white/40 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl border border-white/20 transition-all duration-300 p-6 transform hover:-translate-y-1 group"
            >
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="relative p-2">
                    <div className={`absolute inset-0 ${reason.bgColor} rounded-lg rotate-6`}></div>
                    <div
                      className={`relative bg-gradient-to-tr ${reason.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {reason.icon}
                    </div>
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-bold text-gray-900">{reason.title}</h3>
                </div>
              </div>

              <div className="pl-2">
                <p className="text-gray-700">{reason.description}</p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default WhyChooseUsSection;
