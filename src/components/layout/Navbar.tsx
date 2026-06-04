"use client";

import { useEffect, useState } from "react";
import { Home, Menu, X, Zap } from "lucide-react";
import { NAV_LINKS } from "@/constants";

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAFAF7]/90 backdrop-blur-xl shadow-sm border-b border-[#0D9488]/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 select-none group">
          <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Home size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-xl font-bold text-[#1C1C1E]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Homi<span className="text-[#0D9488]">go</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#6B7280] hover:text-[#0D9488] transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#waitlist"
            className="btn-primary inline-flex items-center gap-2 h-9 px-5 rounded-full text-white text-sm font-semibold shadow-sm"
          >
            <Zap size={14} strokeWidth={2.5} />
            Join Waitlist
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#0D9488]/10 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen
            ? <X size={20} className="text-[#1C1C1E]" />
            : <Menu size={20} className="text-[#1C1C1E]" />
          }
        </button>
      </div>

      {/* Mobile menu slide-down */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#FAFAF7]/95 backdrop-blur-xl border-t border-[#0D9488]/10 px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-[#6B7280] hover:text-[#0D9488] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#waitlist"
            onClick={() => setMenuOpen(false)}
            className="btn-primary flex items-center justify-center gap-2 h-11 rounded-full text-white text-sm font-semibold"
          >
            <Zap size={14} strokeWidth={2.5} />
            Join Waitlist
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
