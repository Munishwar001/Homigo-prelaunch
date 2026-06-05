"use client";

import { useInView } from "@/hooks/useInView";
import { SectionHeader } from "@/components/ui";
import { REASONS } from "@/constants";

export function WhyHomizy() {
  const [ref, isVisible] = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-16 md:py-28 px-4 sm:px-6 bg-primary overflow-hidden"
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }}
      />
      <div className="animate-spin-slow absolute top-12 left-12 w-16 h-16 rounded-full border border-dashed border-white/15 pointer-events-none hidden lg:block" />

      <div className="relative z-10 max-w-5xl mx-auto">

        <SectionHeader
          eyebrow="Why Homizy"
          heading="Why thousands will choose Homizy"
          subheading="Built ground-up for Indian households, by people who understand them."
          headingColor="white"
          subheadingColor="white"
          className={`mb-14 transition-all duration-700 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className={`group relative overflow-hidden bg-white/10 border border-white/20 rounded-2xl p-7 hover:bg-white/15 transition-all duration-300 cursor-default ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.1 + i * 0.12}s` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />

                <div className="relative z-10 flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 group-hover:scale-105 transition-all duration-200">
                    <Icon size={22} className="text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-white mb-1.5"
                      style={{ fontFamily: "var(--font-fraunces)" }}
                    >
                      {reason.title}
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyHomizy;
