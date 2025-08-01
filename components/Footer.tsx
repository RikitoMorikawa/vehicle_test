"use client";

import React from "react";
import { Instagram, Facebook, X, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Footer = () => {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const companyInfo = {
    name: "合同会社Y3（ワイスリー）",
    address: "東京都世田谷区",
    email: "contact@yyy-3.com",
  };

  // リンク先の設定（コンタクトページからはルートページ+アンカーへ）
  const getHref = (anchor: string) => {
    return isHomePage ? anchor : `/${anchor}`;
  };

  // スムーズスクロール処理（ホームページの場合のみ）
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHomePage) return; // ホームページでなければ通常の遷移

    e.preventDefault();

    // ハッシュを取得
    const targetId = href.replace(/.*\#/, "");
    const element = document.getElementById(targetId);

    if (element) {
      // スクロール位置を調整（ヘッダーの高さ分オフセット）
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 120; // より大きなオフセット

      // スクロール
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About", href: getHref("#about") },
        { label: "Services", href: getHref("#services") },
        { label: "News", href: getHref("#news") },
        { label: "Contact", href: getHref("#contact") },
      ],
    },
  ];

  // フッター画像
  const footerImages = [
    { src: "/images/footer/img_01.png", alt: "Image 1" },
    { src: "/images/footer/img_02.png", alt: "Image 2" },
    { src: "/images/footer/img_03.png", alt: "Image 3" },
  ];

  return (
    <footer className="bg-white relative overflow-hidden">
      {/* 上部の波形装飾 */}
      <div className="absolute top-0 left-0 right-0 transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* 背景の円装飾 */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-50 opacity-40"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 rounded-full bg-indigo-50 opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-purple-50 opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
        {/* メインフッター内容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* 会社情報 */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <span className="text-2xl font-bold text-indigo-700">Y3</span>
              <div className="ml-1 w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <span className="ml-2 text-sm font-medium text-gray-600">ワイスリー</span>
            </Link>

            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <MapPin className="text-indigo-600 mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-600">{companyInfo.address}</span>
              </div>
              <div className="flex items-center">
                <Mail className="text-indigo-600 mr-3 flex-shrink-0" size={18} />
                <a href={`mailto:${companyInfo.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                  {companyInfo.email}
                </a>
              </div>
            </div>

            {/* フッター画像を追加（サイズ固定でstyle適用、優先読み込み） */}
            <div className="flex space-x-4 mt-6">
              {footerImages.map((image, index) => (
                <div key={index} style={{ width: "40px", height: "40px" }} className="rounded-lg overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={80}
                    height={60}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    priority={index === 0} // 最初の画像にのみpriorityを設定
                  />
                </div>
              ))}
            </div>
          </div>

          {/* リンク */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="text-gray-600 hover:text-indigo-600 flex items-center group transition-colors"
                    >
                      <ChevronRight size={16} className="mr-1 text-indigo-500 transform group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ニュースレター */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
            <p className="text-gray-600 mb-4">SNSで最新情報をチェック</p>

            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-500 to-red-600 rounded-full text-white hover:shadow-lg hover:shadow-pink-200 transform hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-full text-white hover:shadow-lg hover:shadow-blue-200 transform hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 rounded-full text-white hover:shadow-lg hover:shadow-gray-200 transform hover:scale-110 transition-all duration-300"
                aria-label="X (formerly Twitter)"
              >
                <X size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {year} {companyInfo.name} All rights reserved.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mt-4 rounded-full opacity-50"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
