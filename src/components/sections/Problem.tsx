"use client";

import { useInView } from "@/hooks/useInView";
import { SectionHeader } from "@/components/ui";
import { PROBLEMS } from "@/constants";

export function Problem() {
  const [ref, isVisible] = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        <SectionHeader
          eyebrow="The problem"
          heading="Sound familiar?"
          eyebrowColor="amber"
          className={`mb-16 transition-all duration-700 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMS.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className={`card-lift glass rounded-2xl border-l-4 border-[#F59E0B] p-7 transition-all duration-700 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-[#fef3c7] flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[#F59E0B]" strokeWidth={1.8} />
                </div>
                <h3
                  className="text-lg font-bold text-[#1C1C1E] mb-2"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {problem.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{problem.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Problem;
