// ─── Waitlist ─────────────────────────────────────────────────────────────────

export type UserRole = "customer" | "provider";

export interface WaitlistFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
}

// ─── Re-exports from lib (backward-compat) ───────────────────────────────────

export type { WaitlistEntry, WaitlistResponse } from "@/lib/types";
