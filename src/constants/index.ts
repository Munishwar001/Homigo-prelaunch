import {
  SearchX,
  Clock,
  ShieldAlert,
  PhoneCall,
  BrainCircuit,
  CheckCircle2,
  Droplets,
  Zap,
  Sparkles,
  Shirt,
  Wrench,
  Hammer,
  Mic2,
  ScanSearch,
  ShieldCheck,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Nav ────────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Services",     href: "#services"     },
] as const;

// ─── Hero ────────────────────────────────────────────────────────────────────

export const HERO_PILLS = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Laundry",
  "Appliance Repair",
  "Carpentry",
] as const;

export const WAITLIST_COUNT = "2,400+";

// ─── Problem ─────────────────────────────────────────────────────────────────

export interface ProblemItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const PROBLEMS: ProblemItem[] = [
  {
    icon: SearchX,
    title: "Can't find a trusted plumber?",
    description:
      "You've asked three neighbours and got three different numbers — none of whom pick up.",
  },
  {
    icon: Clock,
    title: "Wasted your whole morning?",
    description:
      "You waited four hours for a technician who never showed. Again.",
  },
  {
    icon: ShieldAlert,
    title: "Never know who's coming home?",
    description:
      "Letting a stranger into your home feels risky with zero background info.",
  },
];

// ─── How It Works ─────────────────────────────────────────────────────────────

export interface Step {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
  showChatBubble?: boolean;
}

export const STEPS: Step[] = [
  {
    icon: PhoneCall,
    number: "01",
    title: "You Call or Tap",
    description:
      "Open Homigo or dial in. Tell us what you need — in Hindi, English, or your local language.",
    showChatBubble: true,
  },
  {
    icon: BrainCircuit,
    number: "02",
    title: "AI Does Everything",
    description:
      "Our AI understands your request, finds vetted professionals nearby, and handles negotiation.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "You Get Confirmed",
    description:
      "Receive a booking confirmation with the pro's name, photo, and ETA. That's it.",
  },
];

// ─── Services ─────────────────────────────────────────────────────────────────

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  bgClass: string;
  textClass: string;
}

export const SERVICES: ServiceItem[] = [
  {
    icon: Droplets,
    title: "Plumbing",
    description: "Leaky pipes, blocked drains, tap fittings and more — fixed fast.",
    bgClass: "bg-blue-50",
    textClass: "text-blue-500",
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Wiring, MCB trips, fan installation, and socket repairs.",
    bgClass: "bg-amber-50",
    textClass: "text-amber-500",
  },
  {
    icon: Sparkles,
    title: "Home Cleaning",
    description: "Deep cleaning, bathroom scrubbing, kitchen degreasing.",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-500",
  },
  {
    icon: Shirt,
    title: "Laundry",
    description: "Wash, dry, iron, and fold — picked up and delivered.",
    bgClass: "bg-violet-50",
    textClass: "text-violet-500",
  },
  {
    icon: Wrench,
    title: "Appliance Repair",
    description: "AC, washing machine, fridge, microwave — all brands covered.",
    bgClass: "bg-[#e6f7f5]",
    textClass: "text-[#0D9488]",
  },
  {
    icon: Hammer,
    title: "Carpentry",
    description: "Furniture assembly, door repairs, custom woodwork.",
    bgClass: "bg-orange-50",
    textClass: "text-orange-500",
  },
];

// ─── Why Homigo ───────────────────────────────────────────────────────────────

export interface ReasonItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const REASONS: ReasonItem[] = [
  {
    icon: Mic2,
    title: "Voice-First Booking",
    description:
      "No app to navigate. Just speak naturally in your language and we handle the rest.",
  },
  {
    icon: ScanSearch,
    title: "AI-Matched Pros",
    description:
      "Our AI finds the best available vetted professional for your exact need and location.",
  },
  {
    icon: ShieldCheck,
    title: "Background Verified",
    description:
      "Every service provider is identity-checked, rated, and reviewed before joining.",
  },
  {
    icon: Timer,
    title: "Same-Day Service",
    description:
      "Most bookings confirmed within minutes. Many available same-day or next morning.",
  },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FOOTER_LINKS = [
  { label: "About",          href: "#" },
  { label: "Contact",        href: "#" },
  { label: "Privacy Policy", href: "#" },
] as const;
