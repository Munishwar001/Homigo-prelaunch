"use client";

import { useInView } from "@/hooks/useInView";
import { SectionHeader } from "@/components/ui";
import { SERVICES } from "@/constants";

export function Services() {
  const [ref, isVisible] = useInView();

  return (
    <section
      id="services"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 md:py-28 px-4 sm:px-6 bg-white"
    >
      <div className="max-w-5xl mx-auto">

        <SectionHeader
          eyebrow="Services"
          heading="What can Homizy help with?"
          subheading="From a dripping tap to a full deep clean — we've got it covered."
          className={`mb-14 transition-all duration-700 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`card-lift group relative overflow-hidden bg-[#FAFAF7] rounded-2xl p-5 sm:p-6 border border-transparent hover:border-primary/15 cursor-default transition-all duration-700 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-linear-to-br from-[#FAFAF7] to-primary-light" />

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl ${service.bgClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon size={22} className={service.textClass} strokeWidth={1.8} />
                  </div>
                  <h3
                    className="font-bold text-[#1C1C1E] mb-1.5 text-base"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
