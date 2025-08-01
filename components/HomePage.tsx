"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AnimatedSection from "@/components/AnimatedSection";
import ServicesSection from "@/components/ServicesSection";
import CompanyInfoSection from "@/components/CompanyInfoSection";
import ContactSection from "@/components/ContactSection";
import PurposeSection from "@/components/PurposeSection";
import NewsSection from "@/components/NewsSection";
import WhyChooseUsSection from "./WhyChooseUsSection";

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <Header variant="main" />

      {/* Hero Section */}
      <HeroSection />

      {/* Purpose Section */}
      <PurposeSection AnimatedSection={AnimatedSection} />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection AnimatedSection={AnimatedSection} />

      {/* Services Section */}
      <ServicesSection AnimatedSection={AnimatedSection} />

      {/* Company Information Section */}
      <CompanyInfoSection AnimatedSection={AnimatedSection} />

      {/* News Section */}
      <NewsSection AnimatedSection={AnimatedSection} />

      {/* Contact Section */}
      <ContactSection AnimatedSection={AnimatedSection} />

      <Footer />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-[#003693] bg-opacity-70 p-3 text-white rounded-full shadow-lg transition-all duration-300 transform hover:bg-opacity-100 hover:scale-110 hover:rotate-6 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
        }`}
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
}
