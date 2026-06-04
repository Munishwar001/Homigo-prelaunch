interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  subheading?: string;
  eyebrowColor?: "teal" | "amber";
  headingColor?: "dark" | "white";
  subheadingColor?: "muted" | "white";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  subheading,
  eyebrowColor = "teal",
  headingColor = "dark",
  subheadingColor = "muted",
  className = "",
}: SectionHeaderProps) {
  const eyebrowCls =
    eyebrowColor === "teal" ? "text-[#0D9488]" : "text-[#F59E0B]";
  const headingCls =
    headingColor === "dark" ? "text-[#1C1C1E]" : "text-white";
  const subCls =
    subheadingColor === "muted" ? "text-[#6B7280]" : "text-white/65";

  return (
    <div className={`text-center ${className}`}>
      <span
        className={`inline-block text-xs font-bold uppercase tracking-widest ${eyebrowCls} mb-3`}
      >
        {eyebrow}
      </span>
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-bold ${headingCls} mb-3`}
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {heading}
      </h2>
      {subheading && (
        <p className={`${subCls} text-lg max-w-xl mx-auto`}>{subheading}</p>
      )}
    </div>
  );
}
