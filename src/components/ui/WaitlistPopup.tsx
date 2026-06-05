"use client";

import { useState, useEffect } from "react";
import {
  X, Users, Home, Wrench, Phone, MapPin,
  User, ArrowRight, Lock, CheckCircle2, Sparkles, Mail,
} from "lucide-react";
import type { UserRole, WaitlistFormData } from "@/types";
import { WAITLIST_COUNT } from "@/constants";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "homizy_popup_seen";

const INITIAL: WaitlistFormData = { name: "", email: "", phone: "", city: "", role: "customer" };

const inputCls =
  "h-11 px-4 w-full rounded-xl border border-gray-200 bg-white text-[#1C1C1E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-sm";

// ─── Component ────────────────────────────────────────────────────────────────

export function WaitlistPopup() {
  const [show, setShow]           = useState(false);
  const [form, setForm]           = useState<WaitlistFormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const setField = <K extends keyof WaitlistFormData>(k: K, v: WaitlistFormData[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(t);
  }, []);

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success?: boolean; message?: string };

      if (!res.ok || !data.success) {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, "1");
      setTimeout(() => setShow(false), 3200);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background:           "rgba(15,23,42,0.55)",
        backdropFilter:       "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className="relative w-full max-w-md max-h-[calc(100vh-32px)] rounded-3xl overflow-y-auto shadow-2xl"
        style={{ animation: "modalIn 0.38s cubic-bezier(0.34,1.3,0.64,1) forwards" }}
      >
        {/* ── Header ── */}
        <div
          className="relative px-8 pt-8 pb-6 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0D9488 0%, #0b7c70 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/8" />

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={15} className="text-white" />
          </button>

          {/* Icon */}
          <div className="relative z-10 flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30 flex items-center justify-center">
              <Sparkles size={26} className="text-white" />
            </div>
          </div>

          {/* Headline */}
          <h2
            className="relative z-10 text-white text-[22px] font-bold leading-tight mb-1"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Get Early Access to Homizy
          </h2>
          <p className="relative z-10 text-white/75 text-[13px]">
            Join <span className="text-white font-semibold">{WAITLIST_COUNT} early members</span> — be first when we launch in your city.
          </p>

          {/* Waitlist counter strip */}
          <div className="relative z-10 flex justify-center mt-4">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-[11px] font-medium px-3 py-1.5 rounded-full">
              <Users size={11} />
              <span>2,400+ people already waiting</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="bg-white px-7 py-6">
          {submitted ? (
            <SuccessView city={form.city} />
          ) : (
            <FormView form={form} setField={setField} onSubmit={handleSubmit} onSkip={close} loading={loading} error={error} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Success view ─────────────────────────────────────────────────────────────

function SuccessView({ city }: { city: string }) {
  return (
    <div className="flex flex-col items-center text-center py-4 gap-4 animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle2 size={34} className="text-emerald-500" strokeWidth={1.6} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[#1C1C1E] mb-1" style={{ fontFamily: "var(--font-fraunces)" }}>
          You&apos;re on the list! 🎉
        </h3>
        <p className="text-[#6B7280] text-sm leading-relaxed">
          We&apos;ll reach out the moment Homizy goes live in{" "}
          <span className="font-semibold text-primary">{city || "your city"}</span>.
        </p>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-gray-400">
        <Lock size={11} />
        No spam. Just one message when we launch.
      </p>
    </div>
  );
}

// ─── Form view ────────────────────────────────────────────────────────────────

function FormView({
  form,
  setField,
  onSubmit,
  onSkip,
  loading,
  error,
}: {
  form: WaitlistFormData;
  setField: <K extends keyof WaitlistFormData>(k: K, v: WaitlistFormData[K]) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  onSkip: () => void;
  loading: boolean;
  error: string;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">

      {/* Role toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-full">
        {(["customer", "provider"] as UserRole[]).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setField("role", r)}
            className={`flex-1 h-9 rounded-full text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              form.role === r
                ? "bg-gradient-to-r from-primary to-[#0b7c70] text-white shadow-sm"
                : "text-gray-500 hover:text-[#1C1C1E]"
            }`}
          >
            {r === "customer"
              ? <><Home size={13} />Homeowner</>
              : <><Wrench size={13} />Service Pro</>}
          </button>
        ))}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-medium text-[#1C1C1E] flex items-center gap-1.5">
          <User size={12} className="text-gray-400" />
          Full Name
        </label>
        <input
          type="text"
          placeholder="Ravi Sharma"
          required
          value={form.name}
          onChange={e => setField("name", e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-medium text-[#1C1C1E] flex items-center gap-1.5">
          <Mail size={12} className="text-gray-400" />
          Email Address
        </label>
        <input
          type="email"
          placeholder="ravi@example.com"
          required
          value={form.email}
          onChange={e => setField("email", e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-medium text-[#1C1C1E] flex items-center gap-1.5">
          <Phone size={12} className="text-gray-400" />
          Phone Number
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium select-none">
            🇮🇳 +91
          </span>
          <input
            type="tel"
            placeholder="98765 43210"
            required
            value={form.phone}
            onChange={e => setField("phone", e.target.value)}
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit mobile number"
            className={`${inputCls} rounded-l-none`}
          />
        </div>
      </div>

      {/* City */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-medium text-[#1C1C1E] flex items-center gap-1.5">
          <MapPin size={12} className="text-gray-400" />
          Your City
        </label>
        <input
          type="text"
          placeholder="Chandigarh, Delhi, Mumbai…"
          required
          value={form.city}
          onChange={e => setField("city", e.target.value)}
          className={inputCls}
        />
      </div>

      {error && (
        <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary h-12 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Joining..." : "Notify Me When Live"}
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>

      <div className="flex flex-col items-center gap-2">
        <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <Lock size={10} />
          No spam. Just one message when we launch.
        </p>
        <button
          type="button"
          onClick={onSkip}
          className="text-[11px] text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </form>
  );
}

export default WaitlistPopup;
