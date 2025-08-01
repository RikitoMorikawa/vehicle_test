"use client";

import React from "react";
import { Users2, MapPin, Globe2, Calendar } from "lucide-react";
import { AnimatedSectionComponent } from "@/components/AnimatedSection";

interface CompanyInfoSectionProps {
  AnimatedSection: AnimatedSectionComponent;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ AnimatedSection }) => {
  return (
    <AnimatedSection id="about" className="py-20 bg-white relative overflow-hidden">
      {/* 背景装飾 - Purposeセクションと同様の丸いパターン */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-50 opacity-50"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-50 opacity-50"></div>
        <div className="absolute bottom-40 left-20 w-48 h-48 rounded-full bg-purple-50 opacity-50"></div>
        <div className="absolute top-60 right-1/4 w-24 h-24 rounded-full bg-cyan-50 opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-36 h-36 rounded-full bg-pink-50 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mb-3">About Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Company Information</span>
          </h2>
          <h3 className="text-xl text-gray-600">企業情報</h3>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 p-6 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="relative p-2">
                    <div className="absolute inset-0 bg-blue-100 rounded-lg rotate-6"></div>
                    <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-3 rounded-lg">
                      <Users2 size={24} />
                    </div>
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-bold text-gray-900">Representatives</h3>
                  <p className="text-gray-600">代表者</p>
                </div>
              </div>

              <div className="pl-2">
                <p className="text-gray-700 mb-2">Managing Members:</p>
                <p className="text-lg font-semibold text-indigo-700">野村優太 ・ 趙竜済</p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 p-6 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="relative p-2">
                    <div className="absolute inset-0 bg-indigo-100 rounded-lg rotate-6"></div>
                    <div className="relative bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-3 rounded-lg">
                      <MapPin size={24} />
                    </div>
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-bold text-gray-900">Location</h3>
                  <p className="text-gray-600">所在地</p>
                </div>
              </div>

              <div className="pl-2">
                <p className="text-gray-700 mb-2">Setagaya-ku, Tokyo</p>
                <p className="text-lg font-semibold text-indigo-700">東京都世田谷区</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 p-6 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="relative p-2">
                    <div className="absolute inset-0 bg-purple-100 rounded-lg rotate-6"></div>
                    <div className="relative bg-gradient-to-tr from-purple-600 to-pink-600 text-white p-3 rounded-lg">
                      <Globe2 size={24} />
                    </div>
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-bold text-gray-900">Company Name</h3>
                  <p className="text-gray-600">会社名</p>
                </div>
              </div>

              <div className="pl-2">
                <p className="text-gray-700 mb-2">Y3 LLC</p>
                <p className="text-lg font-semibold text-indigo-700">合同会社Y3（ワイスリー）</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 p-6 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="relative p-2">
                    <div className="absolute inset-0 bg-pink-100 rounded-lg rotate-6"></div>
                    <div className="relative bg-gradient-to-tr from-pink-600 to-rose-600 text-white p-3 rounded-lg">
                      <Calendar size={24} />
                    </div>
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-bold text-gray-900">Established</h3>
                  <p className="text-gray-600">設立</p>
                </div>
              </div>

              <div className="pl-2">
                <p className="text-gray-700 mb-2">April 4, 2025</p>
                <p className="text-lg font-semibold text-indigo-700">2025年4月4日</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CompanyInfoSection;
