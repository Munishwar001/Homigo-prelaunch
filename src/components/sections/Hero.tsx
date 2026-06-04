"use client";

import { Mic, ArrowDown, Users, Star } from "lucide-react";
import { HERO_PILLS, WAITLIST_COUNT } from "@/constants";

export function Hero() {
  const handleMicClick = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAF7] px-6 pt-16">

      {/* ── Background decorations ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 20%, rgba(13,148,136,0.07) 0%, transparent 68%)",
        }}
      />
      <div
        className="animate-float absolute top-24 right-10 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(13,148,136,0.10) 0%, transparent 70%)", animationDelay: "0s" }}
      />
      <div
        className="animate-float absolute bottom-24 left-6 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)", animationDelay: "2.5s" }}
      />
      <div className="animate-spin-slow absolute top-32 right-24 w-20 h-20 rounded-full border border-dashed border-[#0D9488]/20 pointer-events-none hidden lg:block" />
      <div
        className="animate-spin-slow absolute bottom-40 left-20 w-14 h-14 rounded-full border border-dashed border-[#F59E0B]/25 pointer-events-none hidden lg:block"
        style={{ animationDirection: "reverse" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Waitlist badge */}
        <div className="animate-fade-in-up opacity-0 delay-100 inline-flex items-center gap-2 bg-white border border-[#0D9488]/20 text-[#0D9488] text-sm font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
          <Users size={14} strokeWidth={2.5} />
          <span>{WAITLIST_COUNT} on waitlist</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
        </div>

        {/* Heading */}
        <h1
          className="animate-fade-in-up opacity-0 delay-200 text-5xl sm:text-6xl lg:text-[72px] font-bold text-[#1C1C1E] leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Book Any Home Service —{" "}
          <span className="text-shimmer">Just By Speaking</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-in-up opacity-0 delay-300 text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed">
          No searching. No calling around. No waiting. Just speak and Homigo
          handles everything — finding, vetting, and booking the right
          professional for your home.
        </p>

        {/* Social proof */}
        <div className="animate-fade-in-up opacity-0 delay-400 flex items-center justify-center gap-1 mb-10">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
          ))}
          <span className="ml-2 text-sm text-[#6B7280]">Trusted by early users across India</span>
        </div>

        {/* Mic CTA */}
        <div className="animate-fade-in-up opacity-0 delay-500 flex flex-col items-center gap-3 mb-12">
          <button
            onClick={handleMicClick}
            aria-label="See how Homigo works"
            className="animate-pulse-ring group w-24 h-24 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0b7c70] text-white flex items-center justify-center shadow-xl hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0D9488]/50 transition-transform duration-200"
          >
            <Mic size={36} strokeWidth={1.8} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
          <p className="text-sm text-[#6B7280] flex items-center gap-1">
            Tap to see how it works
            <ArrowDown size={13} className="animate-bounce" />
          </p>
        </div>

        {/* Pills */}
        <div className="animate-fade-in-up opacity-0 delay-600 flex flex-wrap justify-center gap-2">
          {HERO_PILLS.map((pill) => (
            <span
              key={pill}
              className="px-4 py-1.5 rounded-full bg-white border border-[#0D9488]/15 text-[#1C1C1E] text-sm font-medium shadow-sm hover:border-[#0D9488]/40 hover:bg-[#e6f7f5] transition-all duration-200 cursor-default"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
