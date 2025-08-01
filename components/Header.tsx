"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface HeaderProps {
  variant?: "main" | "secondary";
}

const Header: React.FC<HeaderProps> = ({ variant = "main" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // スクロール監視用のイベントリスナー
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // リンク先の設定（コンタクトページからはルートページ+アンカーへ）
  const getHref = (anchor: string) => {
    return isHomePage ? anchor : `/${anchor}`;
  };

  // ナビゲーションリンク
  const navLinks = [
    { name: "Purpose", nameJa: "目的", href: getHref("#purpose") },
    { name: "Services", nameJa: "サービス", href: getHref("#services") },
    { name: "Company", nameJa: "会社情報", href: getHref("#about") },
    { name: "News", nameJa: "ニュース", href: getHref("#news") },
  ];

  // スムーズスクロール処理（ホームページの場合のみ）
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHomePage) return; // ホームページでなければ通常の遷移

    e.preventDefault();

    // ハッシュを取得
    const targetId = href.replace(/.*\#/, "");
    const element = document.getElementById(targetId);

    if (element) {
      // メニューを閉じる
      setIsMenuOpen(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || variant === "secondary" ? "bg-white/95 backdrop-blur-sm shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div
                className={`transition-all duration-300 ${isScrolled || variant === "secondary" ? "brightness-0 saturate-100" : "brightness-0 invert"}`}
                style={{
                  filter:
                    isScrolled || variant === "secondary"
                      ? "brightness(0) saturate(100%) invert(11%) sepia(100%) saturate(4831%) hue-rotate(214deg) brightness(96%) contrast(127%)"
                      : undefined,
                }}
              >
                <Image src="/images/logo.svg" alt="Y3 合同会社ワイスリー" width={60} height={20} priority />
              </div>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex flex-col items-center ${
                  isScrolled || variant === "secondary"
                    ? "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{link.name}</span>
                <span className="text-xs mt-0.5 opacity-70">{link.nameJa}</span>
              </a>
            ))}
            <Link
              href="/contact"
              className={`ml-3 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isScrolled || variant === "secondary"
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-md hover:shadow-indigo-200"
                  : "bg-white text-indigo-700 hover:shadow-md hover:shadow-indigo-900/20"
              }`}
            >
              お問い合わせ
            </Link>
          </nav>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button
              type="button"
              className={`p-2 rounded-full ${isScrolled || variant === "secondary" ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルドロップダウンメニュー */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pt-2 pb-4 bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span>{link.name}</span>
                  <span className="text-sm text-gray-500">{link.nameJa}</span>
                </div>
              </a>
            ))}
            <div className="pt-2">
              <Link
                href="/contact"
                className="block w-full py-3 px-4 text-center font-medium rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-indigo-600 hover:to-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ヘッダー下のグラデーションライン（スクロール時のみ表示） */}
      <div
        className={`h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform origin-left transition-transform duration-500 ${
          isScrolled || variant === "secondary" ? "scale-x-100" : "scale-x-0"
        }`}
      ></div>
    </header>
  );
};

export default Header;
