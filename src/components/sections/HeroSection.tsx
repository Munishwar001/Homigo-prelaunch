export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-b from-orange-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/60 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Coming Soon — Join the Waitlist
        </span>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          Trusted Home Services,{" "}
          <span className="text-orange-500">At Your Fingertips</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Homigo connects homeowners with vetted local professionals for any home
          service — from plumbing to painting. Book instantly, pay securely, and
          get the job done right.
        </p>

        <a
          href="#waitlist"
          className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-orange-500 text-white text-lg font-semibold hover:bg-orange-600 active:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
        >
          Get Early Access
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>

        <p className="mt-4 text-sm text-slate-400">
          No credit card required &middot; Free during beta
        </p>
      </div>
    </section>
  );
}
