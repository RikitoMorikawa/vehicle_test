"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, FileCheck, Award, Users, Target, Zap, ChartBar, ChevronDown } from "lucide-react";
import { Instagram, Globe2 } from "lucide-react";

export default function SNSConsultingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const faqData = [
    {
      question: "どのSNSに対応していますか？",
      answer: "Instagram、X（旧Twitter）、Facebook、TikTok、LINE公式アカウントなど主要なSNSに対応しています。複数媒体の連携も可能です。",
    },
    {
      question: "フォロワー数って増えますか？",
      answer: "増やすことは可能ですが、「質の高いフォロワー＝見込み客」にこだわることが重要です。エンゲージメントと売上につながる運用をご提案します。",
    },
    {
      question: "どれくらいの期間で効果が出ますか？",
      answer: "SNSは中長期的な育成メディアです。目安としては3～6ヶ月でフォロワーの反応や売上への影響が見えてきます。",
    },
    {
      question: "契約期間や料金について教えてください。",
      answer: "最低3ヶ月からのご契約が多いですが、内容によりご相談可能です。料金はご希望のサポート範囲によって異なりますので、まずは無料相談をご利用ください。",
    },
    {
      question: "どのように複数のSNSを使い分けるべきですか？",
      answer:
        "各SNSには独自の特徴があり、例えばTikTokやInstagramリールは認知拡大に最適で、YouTubeはブランドイメージを高めるためのコンテンツ作成にぴったりです。Instagramは、ファンとの関係を深め、コミュニティを育てるのに最適なプラットフォームです。私たちは、これらの特性を最大限に活かしたマーケティング戦略を提供します。",
    },
    {
      question: "SNSマーケティングの運用代行を依頼するメリットは何ですか？",
      answer:
        "SNS運用を私たちにお任せいただければ、専門知識と経験を持つプロフェッショナルがしっかりサポートします。その結果、効果的なコンテンツ制作や戦略を立てることができ、時間と労力を節約しながら、あなたのブランド力を高められます。また、私たちの代表の豊富な実績を活かして、SNSを使った成功を実現します。",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // 実績データ（画像とテキストをセット）
  const achievementSlides = [
    {
      image: {
        src: "/images/services/sns-consulting/ex01.jpg",
        alt: "運用実績事例　スンギの美味スンギ飯",
      },
      title: "運用実績事例",
      subtitle: "スンギの美味スンギ飯",
      description1: "キムチ販売に向けたSNS戦略で、Tiktokは7ヶ月で”+5万人フォロワー”を獲得！。",
      description2: "Instagramは2000人 → 8万人へと急成長。",
    },
    {
      image: {
        src: "/images/services/sns-consulting/ex02.jpg",
        alt: "運用実績事例　カノック⭐︎セイヤ",
      },
      title: "運用実績事例",
      subtitle: "カノック⭐︎セイヤ",
      description1: "「デブ専ホスト」として差別化した戦略が成功。",
      description2: "たった2ヶ月で指名・売上No.1を獲得し、SNSフォロワーは8000人越え。",
    },
    {
      image: {
        src: "/images/services/sns-consulting/ex03.jpg",
        alt: "運用実績事例　咲人",
      },
      title: "運用実績事例",
      subtitle: "咲人",
      description1: "SNSインフルエンサーとして様々なメディア露出に成功",
      description2: "SNSを駆使した自身のホストクラブ、美容サロンの集客・人材確保にも成功",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % achievementSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + achievementSlides.length) % achievementSlides.length);
  };

  const service = {
    title: "SNS Consulting",
    japaneseTitle: "SNSコンサルティング",
    description: "戦略的なソーシャルメディア運用と成長戦略のご提案",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="30%" stopColor="#FB923C" />
            <stop offset="70%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instagramGradient)" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4" stroke="url(#instagramGradient)" strokeWidth="2" fill="none" />
        <circle cx="18" cy="6" r="1.5" fill="url(#instagramGradient)" />
      </svg>
    ),
    iconBg: "bg-white",
    color: "text-pink-600",
    colorLight: "text-pink-500",
    bgGradient: "from-pink-500 to-red-500",
    longDescription:
      "SNSの活用は現代のビジネスにおいて欠かせない要素となっています。当社のSNSコンサルティングでは、各プラットフォームの特性を活かした最適な戦略立案から実行、分析までを一貫してサポートします。フォロワー数の増加だけでなく、エンゲージメント率の向上やコンバージョン率の改善など、ビジネス目標に直結する成果を重視したアプローチを行います。",
    benefits: [
      "各SNSプラットフォームに最適化されたコンテンツ戦略",
      "データ分析に基づいた投稿最適化と改善提案",
      "エンゲージメント向上のためのコミュニティ構築",
      "競合分析とベンチマーキング",
      "広告運用のサポートと効果測定",
    ],
    cases: ["新規ブランド立ち上げ時のSNS戦略構築と実行", "既存アカウントの成長停滞からの脱却と活性化", "複数SNSプラットフォームの統合運用戦略"],
    process: [
      {
        icon: <FileCheck size={24} />,
        title: "お問い合わせ",
        description: "フォームからお問い合わせ下さい。1営業日以内に担当よりご連絡差し上げます。",
      },
      {
        icon: <Target size={24} />,
        title: "お打合せ",
        description: "現状の課題やお困りごとお困りのことなど、お気軽にご相談下さい。",
      },
      {
        icon: <Zap size={24} />,
        title: "ご提案・お見積",
        description: "課題を解決するための最適なサービスをご提案いたします。",
      },
      {
        icon: <ChartBar size={24} />,
        title: "ご契約",
        description: "業務開始にあたり、契約書の取り交わしを行います。",
      },
      {
        icon: <ChartBar size={24} />,
        title: "開始",
        description: "プロジェクトを開始します。運用代行の場合、初回お打合わせから最短１〜2ヶ月ほどで開始できます。",
      },
    ],
    achievements: [
      {
        title: "フォロワー増加率",
        value: "250",
        unit: "%",
        description: "アパレルブランドのInstagramアカウント（6ヶ月間）",
        icon: <Users size={24} />,
      },
      {
        title: "エンゲージメント率",
        value: "5.8",
        unit: "%",
        description: "飲食チェーンのInstagramアカウント（業界平均の3倍）",
        icon: <Award size={24} />,
      },
      {
        title: "投稿リーチ",
        value: "12",
        unit: "倍",
        description: "美容クリニックのTikTokアカウント（3ヶ月間）",
        icon: <Globe2 size={24} />,
      },
      {
        title: "コンバージョン増加",
        value: "180",
        unit: "%",
        description: "ECサイトへの誘導からの購入率（12ヶ月間）",
        icon: <ChartBar size={24} />,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* ヘッダー */}
      <Header variant="secondary" />

      {/* ヒーローセクション - シンプルな背景画像 */}
      <div className="relative text-white mt-20">
        {/* 背景画像 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/services/sns-consulting/sns_consulting_kv.jpg')`,
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="flex flex-col items-center">
            <Link href="/services" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to all services
            </Link>

            <div className={`w-16 h-16 ${service.iconBg} rounded-full flex items-center justify-center mb-6 shadow-lg`}>{service.icon}</div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-center text-white">{service.title}</h1>

            <h2 className="text-2xl text-white/90 mb-6 text-center">{service.japaneseTitle}</h2>

            <p className="max-w-2xl mx-auto text-lg text-white/90 text-center">{service.description}</p>
          </div>
        </div>
      </div>

      {/* サービス詳細セクション */}
      <div className="py-16 relative">
        {/* 背景装飾 - SNS専用デザイン */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-pink-50 opacity-40"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-red-50 opacity-30"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-pink-50 opacity-30"></div>
          <div className="absolute top-60 right-1/3 w-20 h-20 rounded-full bg-red-50 opacity-40 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* サービス概要 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">サービス概要</h2>
              <p className="text-gray-700 text-sm md:text-lg leading-relaxed mb-8">{service.longDescription}</p>
            </div>

            {/* レスポンシブ画像セクション */}
            <div className="mb-12">
              {/* PC用画像 */}
              <div className="hidden md:block">
                <Image
                  src="/images/services/sns-consulting/worry_pc.png"
                  alt="SNSコンサルティングサービス詳細"
                  width={1200}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-lg"
                  priority
                />
              </div>

              {/* スマホ用画像 */}
              <div className="block md:hidden">
                <Image
                  src="/images/services/sns-consulting/worry_sp.png"
                  alt="SNSコンサルティングサービス詳細"
                  width={600}
                  height={800}
                  className="w-full h-auto rounded-lg shadow-lg"
                  priority
                />
              </div>
            </div>

            {/* 私たちの強み */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">私たちの強み</h2>

              <div className="space-y-8">
                {/* 強み1 - 画像の上に追加 */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">・ファン化し、ビジネスを加速させるマーケティング</h3>
                  <p className="text-gray-700 leading-relaxed">
                    私たちは、単なるSNS運用や集客ではなく、
                    <br />
                    「ファン化」→「信頼構築」→「継続的なマネタイズ」までを見据えたマーケティングを提供しています。
                  </p>
                </div>

                {/* Funnel画像 */}
                <div className="text-center">
                  <Image
                    src="/images/services/sns-consulting/funnel.png"
                    alt="SNSマーケティングファネル"
                    width={1000}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-lg mx-auto"
                  />
                </div>
              </div>
            </div>

            {/* 実績 - スライド機能付き（テキストと写真分離） */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">運用実績</h2>

              {/* スライダーコンテナ */}
              <div className="relative">
                {/* メインコンテンツ表示エリア */}
                <div className="overflow-hidden rounded-lg shadow-lg bg-white">
                  <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {achievementSlides.map((slide, index) => (
                      <div key={index} className="w-full flex-shrink-0">
                        {/* コンパクトなテキストセクション */}
                        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-pink-50 to-red-50">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{slide.title}</h3>
                          <h4 className="text-base sm:text-lg font-bold text-pink-600 mb-2">{slide.subtitle}</h4>
                          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-1">
                            <p>{slide.description1}</p>
                            <p>{slide.description2}</p>
                          </div>
                        </div>

                        {/* 大きな写真セクション */}
                        <div className="w-full">
                          <Image
                            src={slide.image.src}
                            alt={slide.image.alt}
                            width={1200}
                            height={900}
                            className="w-full h-auto object-cover"
                            priority={index === 0}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 前後のナビゲーションボタン */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110 z-20"
                  aria-label="前の実績"
                >
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110 z-20"
                  aria-label="次の実績"
                >
                  <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                </button>

                {/* ドットインジケーター */}
                <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
                  {achievementSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide ? "bg-gradient-to-r from-pink-500 to-red-500" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`実績 ${index + 1} を表示`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 契約の流れ */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">契約の流れ</h2>
              <div className="space-y-6">
                {service.process.map((step, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-5 transition-all duration-300">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="relative p-2">
                          <div className="absolute inset-0 bg-pink-100 rounded-lg rotate-6"></div>
                          <div className="relative bg-gradient-to-r from-pink-500 to-red-500 text-white p-3 rounded-lg">{step.icon}</div>
                        </div>
                      </div>
                      <div className="ml-5">
                        <div className="flex items-center">
                          <span className="bg-pink-100 text-pink-800 text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">
                            {index + 1}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                        <p className="mt-2 text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* よくある質問 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">よくある質問</h2>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                    >
                      <span className="font-semibold text-gray-900 pr-4">Q. {faq.question}</span>
                      <div className={`flex-shrink-0 text-pink-500 transition-transform duration-300 ${openFaqIndex === index ? "rotate-180" : "rotate-0"}`}>
                        <ChevronDown size={20} />
                      </div>
                    </button>

                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        openFaqIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 pb-4 pt-0 border-t border-gray-100 bg-gray-50">
                        <div className="pt-4">
                          <span className="font-semibold text-pink-600 mr-2">A.</span>
                          <span className="text-gray-700 leading-relaxed">{faq.answer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* お問い合わせセクション */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className={`h-2 bg-gradient-to-r ${service.bgGradient}`}></div>
              <div className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">サービスについてのご相談</h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-8">
                    本サービスの詳細や、あなたのプロジェクトに最適なプランについてご相談ください。
                    専門のコンサルタントがお客様のニーズに合わせたご提案をいたします。
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                      href="/contact"
                      className={`inline-flex items-center px-8 py-3 bg-gradient-to-r ${service.bgGradient} text-white rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                    >
                      お問い合わせ
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center px-8 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full font-medium transition-all duration-300"
                    >
                      他のサービスを見る
                      <ArrowRight size={18} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
}
