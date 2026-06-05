"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, BotMessageSquare } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { SectionHeader } from "@/components/ui";
import { STEPS } from "@/constants";
import type { StepBubble } from "@/constants";

// Bounce sequence: 0 → 1 → 2 → 1 → 0 → 1 → 2 → …
function useBounceStep(count: number, holdMs = 2600) {
  const seq = buildBounce(count); // [0,1,2,1]
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPos((p) => (p + 1) % seq.length), holdMs);
    return () => clearTimeout(t);
  }, [pos, seq.length, holdMs]);

  return seq[pos]; // active step index (0 | 1 | 2)
}

function buildBounce(n: number): number[] {
  // Simple forward loop: 0 → 1 → 2 → 0 → 1 → 2 → …
  return Array.from({ length: n }, (_, i) => i);
}

export function HowItWorks() {
  const [ref, isVisible] = useInView();
  const activeStep = useBounceStep(STEPS.length);

  return (
    <section
      id="how-it-works"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 md:py-28 px-4 sm:px-6 bg-[#FAFAF7]"
    >
      <div className="max-w-5xl mx-auto">

        <SectionHeader
          eyebrow="How it works"
          heading="Here's how Homizy works"
          subheading="Three steps. That's it."
          className={`mb-12 md:mb-20 transition-all duration-700 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        />

        <div className="relative flex flex-col md:flex-row gap-10 md:gap-0 items-start">

          {/* Dashed connector — desktop */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%)] right-[calc(16.67%)] h-px border-t-2 border-dashed border-[#0D9488]/25 z-0" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;

            return (
              <div
                key={step.number}
                className={`relative z-10 flex-1 flex flex-col items-center text-center px-4 transition-all duration-700 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.15 + i * 0.18}s` }}
              >
                {/* Icon circle — scales up when active */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-5 ring-4 transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-br from-[#0D9488] to-[#0b7c70] ring-[#e6f7f5] scale-110 shadow-[0_8px_32px_rgba(13,148,136,0.35)]"
                      : "bg-[#b2d8d4] ring-[#e6f7f5]/60 scale-100"
                  }`}
                >
                  <Icon
                    size={30}
                    className="text-white"
                    strokeWidth={1.6}
                  />
                </div>

                {/* Step label */}
                <span
                  className={`text-xs font-bold uppercase tracking-widest mb-1 transition-colors duration-500 ${
                    isActive ? "text-[#0D9488]" : "text-[#0D9488]/40"
                  }`}
                >
                  Step {step.number}
                </span>

                {/* Title */}
                <h3
                  className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                    isActive ? "text-[#1C1C1E]" : "text-[#1C1C1E]/40"
                  }`}
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm leading-relaxed max-w-[240px] transition-colors duration-500 ${
                    isActive ? "text-[#6B7280]" : "text-[#6B7280]/40"
                  }`}
                >
                  {step.description}
                </p>

                {/* Chat bubble */}
                {step.bubble && (
                  <StepChatBubble
                    bubble={step.bubble}
                    isActive={isActive}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Step chat bubble ─────────────────────────────────────────────────────────

function StepChatBubble({
  bubble,
  isActive,
}: {
  bubble: StepBubble;
  isActive: boolean;
}) {
  const isUser    = bubble.type === "user";
  const isConfirm = bubble.type === "confirm";

  const bubbleBg = isConfirm
    ? "bg-white border border-[#0D9488]/20"
    : isUser
    ? "bg-[#0D9488]"
    : "bg-[#1C1C1E]";

  const textColor = isConfirm ? "text-[#1C1C1E]" : "text-white";
  const tailColor = isConfirm ? "" : isUser ? "bg-[#0D9488]" : "bg-[#1C1C1E]";

  return (
    <div
      className="mt-5 max-w-[260px] text-left transition-all duration-500"
      style={{ opacity: isActive ? 1 : 0.25 }}
    >
      {/* Label */}
      <div className="flex items-center gap-1.5 mb-1.5 ml-1">
        {isUser ? (
          <span className="text-[10px] font-semibold text-[#0D9488] uppercase tracking-wide">You</span>
        ) : isConfirm ? (
          <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wide">Confirmed</span>
        ) : (
          <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide flex items-center gap-1">
            <BotMessageSquare size={10} />
            Homizy AI
          </span>
        )}
      </div>

      {/* Bubble */}
      <div className={`relative ${bubbleBg} ${textColor} text-sm rounded-2xl ${isUser ? "rounded-tl-sm" : "rounded-tr-sm"} px-4 py-3 shadow-md leading-relaxed`}>
        {/* speech tail */}
        {!isConfirm && (
          <div
            className={`absolute w-3 h-3 ${tailColor} rotate-45 rounded-sm ${
              isUser ? "-top-1.5 left-4" : "-top-1.5 right-4"
            }`}
          />
        )}
        {bubble.text}
      </div>

      {/* Time row */}
      <div className="flex items-center gap-1 mt-1 ml-1">
        <span className="text-[10px] text-[#6B7280]">{bubble.time}</span>
        {isConfirm && <CheckCircle2 size={10} className="text-emerald-500" />}
        {isUser && <CheckCircle2 size={10} className="text-[#0D9488]" />}
      </div>
    </div>
  );
}

export default HowItWorks;
