"use client";

import { useState, useEffect } from "react";
import {
  MicOff, Volume2, PhoneOff,
  Users, Star, Shield, Zap,
  CheckCircle2, ArrowDown, ChevronRight, Phone,
} from "lucide-react";
import { HERO_PILLS, WAITLIST_COUNT } from "@/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatStep = 0 | 1 | 2 | 3;
const STEP_MS: Record<ChatStep, number> = { 0: 2600, 1: 1800, 2: 2800, 3: 3400 };

// ─── Waveform bars (user speaking) ───────────────────────────────────────────

const BAR_HEIGHTS = [10, 22, 14, 30, 18, 36, 22, 28, 12, 32, 20, 36, 14, 26, 18];

function Waveform() {
  return (
    <div className="flex items-center gap-[3px]" style={{ height: 40 }}>
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-emerald-400"
          style={{
            height: h,
            transformOrigin: "bottom",
            animation: "waveBar 0.65s ease-in-out infinite alternate",
            animationDelay: `${i * 0.055}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Phone mockup — call screen ───────────────────────────────────────────────

function PhoneMockup() {
  const [step, setStep] = useState<ChatStep>(0);
  const [secs, setSecs]  = useState(18);

  // Step cycle
  useEffect(() => {
    const t = setTimeout(
      () => setStep(s => ((s + 1) % 4) as ChatStep),
      STEP_MS[step],
    );
    return () => clearTimeout(t);
  }, [step]);

  // Live call timer
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const timer = `0${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="relative mx-auto lg:mx-0" style={{ width: 268, flexShrink: 0 }}>

      {/* Glow behind phone */}
      <div
        className="absolute inset-0 scale-110 blur-3xl opacity-50 rounded-[3rem]"
        style={{ background: "radial-gradient(ellipse, rgba(13,148,136,0.35) 0%, transparent 70%)" }}
      />

      {/* ── Floating badges (xl only) ── */}
      <div className="animate-float absolute -left-24 top-20 bg-white rounded-xl px-3 py-1.5 shadow-xl border border-gray-100 items-center gap-1.5 hidden xl:flex" style={{ animationDelay: "0s" }}>
        <Shield size={13} className="text-primary" />
        <span className="text-xs font-semibold text-[#1C1C1E]">Verified Pros</span>
      </div>
      <div className="animate-float absolute -right-24 top-[38%] bg-white rounded-xl px-3 py-1.5 shadow-xl border border-gray-100 items-center gap-1.5 hidden xl:flex" style={{ animationDelay: "2s" }}>
        <Zap size={13} className="text-amber-500" />
        <span className="text-xs font-semibold text-[#1C1C1E]">Same-Day</span>
      </div>
      <div className="animate-float absolute -left-20 bottom-36 bg-white rounded-xl px-3 py-1.5 shadow-xl border border-gray-100 items-center gap-1.5 hidden xl:flex" style={{ animationDelay: "3.5s" }}>
        <Star size={13} className="text-amber-400 fill-amber-400" />
        <span className="text-xs font-semibold text-[#1C1C1E]">4.9 Rated</span>
      </div>

      {/* ── Phone frame ── */}
      <div
        className="relative rounded-[2.5rem] overflow-hidden"
        style={{
          width: 268,
          height: 520,
          background: "linear-gradient(180deg, #0d1f2d 0%, #0f2336 40%, #0a1a28 100%)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.45), 0 16px 40px rgba(13,148,136,0.18), inset 0 0 0 1.5px rgba(255,255,255,0.07)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />

        {/* Status bar */}
        <div className="flex justify-between items-center pt-7 pb-1 px-5">
          <span className="text-white/80 text-[10px] font-semibold">9:41</span>
          <div className="flex items-center gap-1 text-white/60 text-[10px]">
            <span>▂▄▆</span>
            <span className="ml-1">🔋</span>
          </div>
        </div>

        {/* Call status label */}
        <div className="flex justify-center mt-1">
          <span className="text-emerald-400 text-[10px] font-semibold tracking-widest uppercase">
            Active Call
          </span>
        </div>

        {/* Homigo avatar + info */}
        <div className="flex flex-col items-center gap-2 mt-4">
          {/* Avatar with pulse rings */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping scale-125" />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse scale-150" />
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center ring-2 ring-primary/40"
              style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
            >
              <Phone size={26} className="text-white" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-white text-base font-bold leading-none">Homigo</p>
            <p className="text-white/50 text-[10px] mt-0.5">AI Home Services</p>
          </div>

          {/* Live call timer */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[11px] font-mono font-semibold">{timer}</span>
          </div>
        </div>

        {/* ── Dynamic call content ── */}
        <div className="mx-4 mt-5 flex flex-col items-center gap-3" style={{ minHeight: 160 }}>

          {/* Step 0 — user is speaking */}
          {step === 0 && (
            <div className="flex flex-col items-center gap-3 w-full chat-msg-in">
              <p className="text-white/40 text-[9px] uppercase tracking-widest">You are speaking…</p>
              <Waveform />
              <div className="bg-white/8 border border-white/10 rounded-2xl px-3.5 py-2.5 w-full text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                <p className="text-white/80 text-[10.5px] leading-relaxed italic">
                  "Mere ghar mein kal subah paani ka pipe leak ho gaya hai, Sector 21 Chandigarh"
                </p>
              </div>
            </div>
          )}

          {/* Step 1 — AI analysing */}
          {step === 1 && (
            <div className="flex flex-col items-center gap-3 w-full chat-msg-in">
              <p className="text-white/40 text-[9px] uppercase tracking-widest">AI is analysing…</p>
              <div className="flex gap-2 items-center">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-primary"
                    style={{
                      height: [8, 16, 24, 16, 8][i],
                      animation: "waveBar 0.6s ease-in-out infinite alternate",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-white/50 text-[10px]">Finding verified plumbers near you…</p>
            </div>
          )}

          {/* Step 2 — AI voice response */}
          {step === 2 && (
            <div className="flex flex-col gap-2.5 w-full chat-msg-in">
              <p className="text-white/40 text-[9px] uppercase tracking-widest text-center">Homigo says…</p>
              <div
                className="rounded-2xl px-3.5 py-3 w-full"
                style={{ background: "rgba(13,148,136,0.2)", border: "1px solid rgba(13,148,136,0.35)" }}
              >
                <p className="text-white text-[11px] leading-relaxed text-center">
                  "Got it! I found{" "}
                  <span className="text-emerald-400 font-semibold">3 verified plumbers</span>{" "}
                  near Sector 21, Chandigarh — all available today."
                </p>
              </div>
              <p className="text-white/40 text-[10px] text-center">Confirming best match…</p>
            </div>
          )}

          {/* Step 3 — Booking confirmed */}
          {step === 3 && (
            <div className="flex flex-col gap-2 w-full chat-msg-in">
              <div
                className="rounded-2xl p-3 w-full"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                    Booking Confirmed
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full shrink-0 text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
                  >
                    RK
                  </div>
                  <div>
                    <p className="text-[11.5px] font-semibold text-white leading-none">Rajesh Kumar</p>
                    <p className="text-[9.5px] text-white/55 mt-0.5">Plumber · ⭐ 4.9 · ETA: 10:30 AM</p>
                  </div>
                </div>
              </div>
              <p className="text-white/35 text-[9.5px] text-center">
                "Your plumber is on the way. Call ending…"
              </p>
            </div>
          )}
        </div>

        {/* ── Call controls ── */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <button className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <MicOff size={18} className="text-white/70" />
            </button>
            <span className="text-white/40 text-[8px]">Mute</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: "#ef4444" }}>
              <PhoneOff size={22} className="text-white" />
            </button>
            <span className="text-white/40 text-[8px]">End</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <Volume2 size={18} className="text-white/70" />
            </button>
            <span className="text-white/40 text-[8px]">Speaker</span>
          </div>
        </div>

        {/* Home bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAF7] px-4 sm:px-6 pt-20 pb-12 md:pb-20">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top radial teal glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 110% 55% at 50% -5%, rgba(13,148,136,0.11) 0%, transparent 62%)" }} />
        {/* Right-side glow (behind phone) */}
        <div style={{ position: "absolute", top: "5%", right: "-10%", width: "60%", height: "90%", background: "radial-gradient(ellipse at 70% 40%, rgba(13,148,136,0.09) 0%, transparent 60%)" }} />
        {/* Bottom-left amber glow */}
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: "45%", height: "65%", background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 65%)" }} />

        {/* Dot grid */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(13,148,136,0.13) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 0%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* Floating blur orbs */}
        <div className="animate-float absolute top-24 right-[8%] w-72 h-72 rounded-full opacity-70 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(13,148,136,0.10) 0%, transparent 65%)", animationDelay: "0s" }} />
        <div className="animate-float absolute bottom-24 left-[4%] w-52 h-52 rounded-full opacity-60 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 65%)", animationDelay: "2.4s" }} />
        <div className="animate-float absolute top-1/2 right-[35%] w-36 h-36 rounded-full opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)", animationDelay: "1.2s" }} />

        {/* Decorative rings */}
        <div className="animate-spin-slow absolute top-24 left-16 w-28 h-28 rounded-full border border-dashed border-primary/15 hidden lg:block" />
        <div className="animate-spin-slow absolute bottom-32 right-[42%] w-18 h-18 rounded-full border border-dashed border-amber-400/20 hidden lg:block" style={{ animationDirection: "reverse" }} />
        <div className="animate-spin-slow absolute top-[45%] left-[7%] w-12 h-12 rounded-full border border-dashed border-primary/10 hidden lg:block" style={{ animationDelay: "3s" }} />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_auto] lg:gap-20 lg:items-center">

          {/* ── Left: text + CTAs ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0">

            {/* Waitlist badge */}
            <div className="animate-fade-in-up opacity-0 delay-100 inline-flex items-center gap-2 bg-white border border-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-7 shadow-sm">
              <Users size={14} strokeWidth={2.5} />
              <span>{WAITLIST_COUNT} on waitlist</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in-up opacity-0 delay-200 font-bold text-[#1C1C1E] leading-[1.07] tracking-tight mb-5 text-[2rem] sm:text-[2.8rem] lg:text-[3.8rem] xl:text-[4.5rem]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Book Any Home Service —{" "}
              <br className="hidden sm:block" />
              <span className="text-shimmer">Just By Speaking</span>
            </h1>

            {/* Sub-headline */}
            <p className="animate-fade-in-up opacity-0 delay-300 text-lg sm:text-xl text-[#6B7280] max-w-xl mb-8 leading-relaxed">
              Speak in Hindi, English, or your local language. Homigo's AI finds
              the right verified professional near you and confirms the booking in
              minutes — no apps, no searching, no waiting.
            </p>

            {/* Trust strip */}
            <div className="animate-fade-in-up opacity-0 delay-400 flex flex-wrap justify-center lg:justify-start items-center gap-x-5 gap-y-2 mb-9 text-sm text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-1 font-medium text-[#1C1C1E]">Trusted across India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-primary" />
                <span>Background-verified pros</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                <span>Same-day service</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="animate-fade-in-up opacity-0 delay-500 flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mb-10">
              <button
                onClick={() => scrollTo("waitlist")}
                className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full text-white font-semibold text-[15px] shadow-xl"
              >
                <Users size={16} />
                Join the Waitlist
                <ChevronRight size={15} />
              </button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full border-2 border-primary/25 text-primary font-semibold text-[15px] bg-white hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              >
                How it works
                <ArrowDown size={15} className="animate-bounce" />
              </button>
            </div>

            {/* Service pills */}
            <div className="animate-fade-in-up opacity-0 delay-600 flex flex-wrap justify-center lg:justify-start gap-2">
              {HERO_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="px-4 py-1.5 rounded-full bg-white border border-primary/15 text-[#1C1C1E] text-sm font-medium shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-default"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: phone mockup ── */}
          <div className="animate-fade-in-up opacity-0 delay-300 mt-16 lg:mt-0">
            <PhoneMockup />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
