"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Instagram, Users, Monitor, BarChart3, Calendar, Megaphone } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function ServicesPage() {
  // サービス情報の配列
  const services = [
    {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-pink-500 to-red-500 text-white p-4 rounded-full transform transition-transform group-hover:scale-110 duration-300">
            <Instagram size={28} />
          </div>
        </div>
      ),
      title: "SNS Consulting",
      japaneseTitle: "SNSコンサルティング",
      description: "戦略的なソーシャルメディア運用と成長戦略のご提案。最適なプラットフォーム選定からコンテンツ作成、分析までサポートします。",
      slug: "sns-consulting",
      className: "bg-white border-gray-100 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100 transition-all duration-300",
    },
    {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-4 rounded-full transform transition-transform group-hover:scale-110 duration-300">
            <Users size={28} />
          </div>
        </div>
      ),
      title: "Influencer Marketing",
      japaneseTitle: "インフルエンサーマーケティング",
      description:
        "業界の影響力のある人物とのコネクションを活用したマーケティング。適切なインフルエンサーの選定からキャンペーン設計まで一貫してサポートします。",
      slug: "influencer-marketing",
      className: "bg-white border-gray-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300",
    },
    {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-green-500 to-teal-500 text-white p-4 rounded-full transform transition-transform group-hover:scale-110 duration-300">
            <Monitor size={28} />
          </div>
        </div>
      ),
      title: "Website Development & Management",
      japaneseTitle: "WEBサイト制作・運用",
      description: "魅力的なWebサイトの制作から継続的な運用・保守まで。ユーザー体験を重視したデザインと、効果的なサイト運営をトータルサポートします。",
      slug: "web-development",
      className: "bg-white border-gray-100 hover:border-green-300 hover:shadow-lg hover:shadow-green-100 transition-all duration-300",
    },
    {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-purple-500 to-violet-500 text-white p-4 rounded-full transform transition-transform group-hover:scale-110 duration-300">
            <BarChart3 size={28} />
          </div>
        </div>
      ),
      title: "Web Advertising",
      japaneseTitle: "WEB広告",
      description:
        "結果を出すターゲットを絞った広告キャンペーンの展開。Google広告、SNS広告、ディスプレイ広告など、目的に合わせた効果的な広告戦略を構築します。",
      slug: "web-advertising",
      className: "bg-white border-gray-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* ヘッダー */}
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
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-indigo-200">Our Services</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-blue-100 mb-8">クリエイターやアーティスト、アスリートなどの熱狂的な個人を応援するサービス</p>
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

      {/* サービス一覧セクション */}
      <AnimatedSection className="py-16 relative">
        {/* 背景装飾 - 丸いパターン */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-50 opacity-80"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-indigo-50 opacity-80"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-purple-50 opacity-70"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-cyan-50 opacity-90 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-pink-50 opacity-90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 mb-3">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                幅広いサービスで個人の価値を最大化
              </span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              個人の可能性を引き出し、新しい経済モデルを構築するための様々なサービスをご用意しています。
              あなたのニーズに合わせたカスタマイズされたソリューションを提供します。
            </p>

            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                japaneseTitle={service.japaneseTitle}
                description={service.description}
                className={service.className}
                slug={service.slug}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* お問い合わせセクション */}
      <AnimatedSection className="py-16 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">サービスについてのご相談</span>
              </h2>
              <p className="text-gray-600 mb-8">
                各サービスの詳細や、あなたのプロジェクトに最適なプランについてご相談ください。
                専門のコンサルタントがお客様のニーズに合わせたご提案をいたします。
              </p>

              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                お問い合わせ
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* フッター */}
      <Footer />
    </div>
  );
}
