"use client";

import { useState, FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type FormState = "idle" | "loading" | "success" | "error";

export default function WaitlistSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setState("success");
        setMessage(data.message);
      } else {
        setState("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <section id="waitlist" className="py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 mb-6">
          Limited Early Access
        </span>

        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Be the First to Know
        </h2>
        <p className="text-lg text-slate-500 mb-10">
          Join the waitlist for early access, exclusive launch offers, and
          updates from the Homigo team.
        </p>

        {state === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">You&apos;re on the list!</h3>
            <p className="text-slate-500">{message}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 rounded-2xl p-8 sm:p-10 text-left border border-slate-100"
          >
            <div className="flex flex-col gap-4">
              <Input
                id="name"
                label="Full Name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={state === "loading"}
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={state === "loading"}
              />

              {state === "error" && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={state === "loading"}
                className="w-full mt-2"
              >
                {state === "loading" ? "Joining..." : "Join the Waitlist"}
              </Button>

              <p className="text-xs text-slate-400 text-center">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
