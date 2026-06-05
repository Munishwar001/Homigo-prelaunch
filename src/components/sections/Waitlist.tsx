"use client";

import { useState } from "react";
import {
  Home, Wrench, Users, Lock,
  ArrowRight, CheckCircle2, Phone, MapPin, User, Mail,
} from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { WAITLIST_COUNT } from "@/constants";
import type { UserRole, WaitlistFormData } from "@/types";

const INITIAL_FORM: WaitlistFormData = {
  name: "",
  email: "",
  phone: "",
  city: "",
  role: "customer",
};

export function Waitlist() {
  const [form, setForm]           = useState<WaitlistFormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const setField = <K extends keyof WaitlistFormData>(
    key: K,
    value: WaitlistFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

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
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="waitlist" className="relative py-16 md:py-28 px-4 sm:px-6 bg-[#FAFAF7] overflow-hidden">
      {/* bg blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(13,148,136,0.05) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-lg mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#e6f7f5] text-[#0D9488] text-sm font-semibold px-4 py-2 rounded-full shadow-sm border border-[#0D9488]/15">
            <Users size={14} strokeWidth={2.5} />
            {WAITLIST_COUNT} people already on the waitlist
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
          </span>
        </div>

        <SectionHeader
          eyebrow="Early Access"
          heading="Homigo is launching soon in your city"
          subheading="Be the first to know when we go live near you."
          className="mb-10"
        />

        {submitted ? (
          <SuccessCard city={form.city} />
        ) : (
          <FormCard form={form} setField={setField} onSubmit={handleSubmit} loading={loading} error={error} />
        )}
      </div>
    </section>
  );
}

export default Waitlist;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SuccessCard({ city }: { city: string }) {
  return (
    <div className="glass rounded-2xl p-10 text-center shadow-lg border border-[#0D9488]/15">
      <div className="w-16 h-16 rounded-full bg-[#e6f7f5] flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={34} className="text-[#0D9488]" strokeWidth={1.6} />
      </div>
      <h3
        className="text-2xl font-bold text-[#1C1C1E] mb-3"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        You&apos;re on the list! 🎉
      </h3>
      <p className="text-[#6B7280] leading-relaxed mb-4">
        We&apos;ll reach out when Homigo goes live in{" "}
        <span className="font-semibold text-[#0D9488]">{city || "your city"}</span>.
      </p>
      <p className="inline-flex items-center gap-1.5 text-sm text-[#6B7280]">
        <Lock size={13} />
        No spam. Just one message when we launch.
      </p>
    </div>
  );
}

function FormCard({
  form,
  setField,
  onSubmit,
  loading,
  error,
}: {
  form: WaitlistFormData;
  setField: <K extends keyof WaitlistFormData>(key: K, value: WaitlistFormData[K]) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div className="glass rounded-2xl shadow-lg p-8 sm:p-10">

      {/* Role toggle */}
      <div className="flex gap-2 mb-7 p-1 bg-[#F3F4F6] rounded-full">
        {(["customer", "provider"] as UserRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setField("role", r)}
            className={`flex-1 h-10 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              form.role === r
                ? "bg-gradient-to-r from-[#0D9488] to-[#0b7c70] text-white shadow-sm"
                : "text-[#6B7280] hover:text-[#1C1C1E]"
            }`}
          >
            {r === "customer" ? <Home size={14} strokeWidth={2.5} /> : <Wrench size={14} strokeWidth={2.5} />}
            {r === "customer" ? "Homeowner" : "Service Pro"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">

        {/* Name */}
        <InputField
          id="wl-name"
          label="Full Name"
          icon={<User size={13} className="text-[#6B7280]" />}
        >
          <input
            id="wl-name"
            type="text"
            placeholder="Ravi Sharma"
            required
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={inputCls}
          />
        </InputField>

        {/* Email */}
        <InputField
          id="wl-email"
          label="Email Address"
          icon={<Mail size={13} className="text-[#6B7280]" />}
        >
          <input
            id="wl-email"
            type="email"
            placeholder="ravi@example.com"
            required
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className={inputCls}
          />
        </InputField>

        {/* Phone */}
        <InputField
          id="wl-phone"
          label="Phone Number"
          icon={<Phone size={13} className="text-[#6B7280]" />}
        >
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] text-sm font-medium select-none">
              🇮🇳 +91
            </span>
            <input
              id="wl-phone"
              type="tel"
              placeholder="98765 43210"
              required
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              pattern="[0-9]{10}"
              title="Enter a valid 10-digit mobile number"
              className={`${inputCls} rounded-l-none`}
            />
          </div>
        </InputField>

        {/* City */}
        <InputField
          id="wl-city"
          label="Your City"
          icon={<MapPin size={13} className="text-[#6B7280]" />}
        >
          <input
            id="wl-city"
            type="text"
            placeholder="Chandigarh, Delhi, Mumbai..."
            required
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            className={inputCls}
          />
        </InputField>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 h-12 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Joining..." : "Notify Me When Live"}
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-[#6B7280]">
          <Lock size={11} />
          No spam. Just one message when we launch.
        </p>
      </form>
    </div>
  );
}

const inputCls =
  "h-12 px-4 w-full rounded-xl border border-[#E5E7EB] bg-white text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition-all text-sm";

function InputField({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[#1C1C1E] flex items-center gap-1.5"
      >
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
