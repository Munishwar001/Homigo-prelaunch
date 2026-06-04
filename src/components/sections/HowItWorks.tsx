"use client";

import { CheckCircle2 } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { SectionHeader } from "@/components/ui";
import { STEPS } from "@/constants";

export function HowItWorks() {
  const [ref, isVisible] = useInView();

  return (
    <section
      id="how-it-works"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-28 px-6 bg-[#FAFAF7]"
    >
      <div className="max-w-5xl mx-auto">

        <SectionHeader
          eyebrow="How it works"
          heading="Here's how Homigo works"
          subheading="Three steps. That's it."
          className={`mb-20 transition-all duration-700 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        />

        <div className="relative flex flex-col md:flex-row gap-10 md:gap-0 items-start">

          {/* Dashed connector (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%)] right-[calc(16.67%)] h-px border-t-2 border-dashed border-[#0D9488]/25 z-0" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`relative z-10 flex-1 flex flex-col items-center text-center px-4 transition-all duration-700 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.15 + i * 0.18}s` }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0b7c70] flex items-center justify-center shadow-lg mb-5 ring-4 ring-[#e6f7f5]">
                  <Icon size={30} className="text-white" strokeWidth={1.6} />
                </div>

                <span className="text-xs font-bold text-[#0D9488] uppercase tracking-widest mb-1">
                  Step {step.number}
                </span>
                <h3
                  className="text-xl font-bold text-[#1C1C1E] mb-2"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed max-w-[240px]">
                  {step.description}
                </p>

                {/* WhatsApp-style chat bubble — step 1 only */}
                {step.showChatBubble && (
                  <div className="mt-6 max-w-[260px] text-left">
                    <div className="relative bg-[#0D9488] text-white text-sm rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg leading-relaxed">
                      <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#0D9488] rotate-45 rounded-sm" />
                      &ldquo;Mere ghar mein kal subah paani ka pipe leak ho gaya hai, Sector 21 Chandigarh&rdquo;
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 ml-2">
                      <span className="text-[10px] text-[#6B7280]">9:14 AM</span>
                      <CheckCircle2 size={11} className="text-[#0D9488]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
