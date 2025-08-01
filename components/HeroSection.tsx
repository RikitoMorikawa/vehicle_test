"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile on initial load and window resize
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Run once on component mount and add event listener
    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {isMobile ? (
          <Image src="/images/sp_kv.png" alt="背景" fill sizes="100vw" priority style={{ objectFit: "cover" }} />
        ) : (
          <Image src="/images/pc_kv.png" alt="背景" fill sizes="100vw" priority style={{ objectFit: "cover" }} />
        )}
      </div>

      {/* Content */}
      {isMobile ? (
        <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
          {/* Logo */}
          <div className="mb-8">
            <Image src="/images/logo.svg" alt="Y3 合同会社ワイスリー" width={90} height={30} priority />
          </div>
          {/* Heading */}
          <h1 className="text-xl text-white text-left mb-8 mx-10 leading-snug">
            成果にこだわり、<br className="mt-4"></br>信頼でつながる
          </h1>
          {/* CTA Button */}
          <div className="flex justify-center">
            <a
              href="#services"
              className="bg-white text-indigo-800 px-16 py-3 rounded-full inline-block font-medium shadow-lg hover:shadow-xl transition duration-300"
            >
              サービスを見る →
            </a>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center h-screen">
          <div className="flex items-center mb-24">
            {/* Logo */}
            <div className="mr-24">
              <Image src="/images/logo.svg" alt="Y3 合同会社ワイスリー" width={170} height={75} priority />
            </div>
            {/* Heading */}
            <h1 className="text-4xl text-white text-left font-bold leading-snug">
              成果にこだわり、<br className="mt-4"></br>信頼でつながる
            </h1>
          </div>
          {/* CTA Button */}
          <div className="flex justify-center">
            <a
              href="#services"
              className="bg-white text-indigo-800 px-20 py-4 rounded-full inline-block font-medium shadow-lg hover:shadow-xl transition duration-300"
            >
              サービスを見る →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
