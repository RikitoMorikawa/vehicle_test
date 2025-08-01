import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "合同会社Y3　企業ページ",
  description: "Y3 LLC provides comprehensive digital marketing solutions, including SNS consulting, influencer marketing, and web advertising services.",
  icons: {
    icon: "/images/logo_02.svg", // publicフォルダ内の既存SVGへのパス
  },  
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
