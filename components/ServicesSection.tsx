"use client";

import React from "react";
import { Instagram, Users, Monitor, BarChart3, Calendar, Megaphone, ArrowRight } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { AnimatedSectionComponent } from "@/components/AnimatedSection";
import Link from "next/link";

interface ServicesSectionProps {
  AnimatedSection: AnimatedSectionComponent;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ AnimatedSection }) => {
  // サービス情報の配列（slugを追加）
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
      description: "戦略的なソーシャルメディア運用と成長戦略のご提案",
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
      description: "業界の影響力のある人物とのコネクションを活用したマーケティング",
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
      description: "魅力的なWebサイトの制作から継続的な運用・保守まで",
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
      description: "結果を出すターゲットを絞った広告キャンペーンの展開",
      slug: "web-advertising",
      className: "bg-white border-gray-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300",
    },
  ];

  return (
    <AnimatedSection id="services" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* 背景の装飾 - Purposeセクションと同様の丸いパターン */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-50 opacity-80"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-purple-50 opacity-90"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-indigo-50 opacity90"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-cyan-50 opacity-80 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-pink-50 opacity-80"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 mb-3">What We Do</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Services</span>
          </h2>
          <h3 className="text-xl text-gray-600">サービス</h3>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

        {/* View more link */}
        <div className="text-center mt-12">
          <Link href="/services" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            View more services
            <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ServicesSection;
