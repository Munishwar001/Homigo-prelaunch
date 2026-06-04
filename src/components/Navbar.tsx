export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">Homigo</span>
        </a>
        <a
          href="#waitlist"
          className="h-9 px-5 inline-flex items-center rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          Join Waitlist
        </a>
      </div>
    </nav>
  );
}
