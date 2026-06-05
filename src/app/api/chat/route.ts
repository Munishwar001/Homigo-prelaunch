import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Intent {
  keywords:    string[];
  response:    string;
  suggestions: string[];
  cta:         { label: string; section: string } | null;
}

// ─── Intents ─────────────────────────────────────────────────────────────────

const INTENTS: Intent[] = [
  {
    keywords:    ["hello", "hi", "hey", "namaste", "helo", "hii", "sup", "good morning", "good evening", "start"],
    response:    "Namaste! 👋 I'm Homizy's virtual assistant.\n\nI can tell you all about our AI-powered home services platform — how it works, what we offer, and how you can get early access. What would you like to know?",
    suggestions: ["How does it work? 🔄", "What services? 🔧", "Join waitlist 🚀"],
    cta:         null,
  },
  {
    keywords:    ["what is homizy", "about homizy", "tell me about", "what does homizy", "who is homizy", "what homizy", "explain homizy", "homizy kya hai", "what are you", "what is this"],
    response:    "**Homizy** is an AI-powered, voice-first home services marketplace built for Indian households.\n\nInstead of hunting for a plumber or electrician, you simply **speak** — in Hindi, English, or your local language — and our AI:\n\n• Understands exactly what you need\n• Finds a vetted professional near you\n• Confirms your booking in minutes\n\nNo app to navigate. No calls to make. Just speak.",
    suggestions: ["How does it work? 🔄", "What services? 🔧", "Is it safe? 🛡️"],
    cta:         null,
  },
  {
    keywords:    ["service", "services", "offer", "available", "what can", "plumb", "electric", "clean", "laundry", "wash", "repair", "carpent", "appliance", "ac", "fridge", "washing machine", "microwave", "furniture", "wood"],
    response:    "Homizy covers all major home services:\n\n🔧 **Plumbing** — Leaks, blockages, tap fittings\n⚡ **Electrical** — Wiring, MCB trips, fan installation\n✨ **Home Cleaning** — Deep cleaning, bathrooms, kitchen\n👕 **Laundry** — Wash, dry, iron, fold & deliver\n🛠️ **Appliance Repair** — AC, fridge, washing machine, microwave\n🪵 **Carpentry** — Furniture assembly, door repairs, custom woodwork\n\nMore categories are coming after launch!",
    suggestions: ["How does it work? 🔄", "Is my city covered? 📍", "Join waitlist 🚀"],
    cta:         null,
  },
  {
    keywords:    ["how does", "how it work", "how do i", "process", "steps", "book", "booking", "kaise", "use kare", "order", "request", "get a", "hire"],
    response:    "Booking with Homizy takes just **3 simple steps**:\n\n1️⃣ **Call or Tap** — Open Homizy or dial in. Tell us what you need in Hindi, English, or your local language.\n\n2️⃣ **AI Does Everything** — Our AI understands your request, finds verified pros nearby, and handles negotiation.\n\n3️⃣ **Get Confirmed** — Receive a booking with the pro's name, photo, and ETA.\n\nThat's it — no calls, no searching, no waiting.",
    suggestions: ["What services? 🔧", "Is it safe? 🛡️", "Join waitlist 🚀"],
    cta:         null,
  },
  {
    keywords:    ["why homizy", "why should", "benefit", "advantage", "feature", "better", "different", "unique", "special", "why use", "best"],
    response:    "Here's what makes Homizy stand out:\n\n🎙️ **Voice-First** — No app to navigate. Just speak naturally in your language.\n\n🤖 **AI-Matched Pros** — Our AI picks the best professional for your exact need and location.\n\n🛡️ **Background Verified** — Every provider is identity-checked, rated, and reviewed.\n\n⏱️ **Same-Day Service** — Bookings confirmed in minutes, many available same-day.",
    suggestions: ["How it works? 🔄", "What services? 🔧", "Join waitlist 🚀"],
    cta:         null,
  },
  {
    keywords:    ["price", "pricing", "cost", "charge", "fee", "rate", "how much", "kitna", "paisa", "money", "payment", "paid", "free", "affordable"],
    response:    "Homizy is built to be **affordable and transparent** — no hidden charges, ever.\n\nYou'll see the full price before confirming any booking. Our goal is to give every Indian household access to quality home services at fair, market-linked rates.\n\nExact pricing details will be announced at launch. Join the waitlist to be the first to know!",
    suggestions: ["What services? 🔧", "How it works? 🔄", "Join waitlist 🚀"],
    cta:         { label: "Join Waitlist — It's Free 🚀", section: "waitlist" },
  },
  {
    keywords:    ["city", "area", "location", "where", "available in", "kahan", "delhi", "mumbai", "bangalore", "chennai", "pune", "chandigarh", "hyderabad", "india", "launch", "launch when"],
    response:    "Homizy is launching for **Indian households** 🇮🇳\n\nWe're starting in select cities and expanding rapidly after launch. Join our early-access waitlist to be among the first when we go live in your area — waitlist members get priority access!",
    suggestions: ["What services? 🔧", "Is it safe? 🛡️", "How it works? 🔄"],
    cta:         { label: "Get Early Access 🚀", section: "waitlist" },
  },
  {
    keywords:    ["language", "hindi", "english", "regional", "local", "speak", "voice", "marathi", "tamil", "telugu", "punjabi", "gujarati"],
    response:    "Homizy is designed to be **truly multilingual** 🗣️\n\nYou can speak in **Hindi**, **English**, or your local language — our AI understands you naturally.\n\nNo typing, no menus, no forms. Just say what you need and we handle the rest.",
    suggestions: ["How it works? 🔄", "What services? 🔧", "Join waitlist 🚀"],
    cta:         null,
  },
  {
    keywords:    ["safe", "safety", "trust", "trusted", "verified", "background", "check", "secure", "reliable", "legit", "genuine", "identity", "worry", "stranger"],
    response:    "Safety is at the **core of Homizy** 🛡️\n\nEvery professional goes through:\n\n✅ **Identity verification**\n✅ **Background check**\n✅ **Rating & review** system\n\nYou'll always know exactly who's coming to your home — their name, photo, rating, and ETA. No surprises.",
    suggestions: ["How it works? 🔄", "What services? 🔧", "Join waitlist 🚀"],
    cta:         null,
  },
  {
    keywords:    ["waitlist", "early access", "sign up", "signup", "register", "join", "when launch", "when available", "how many", "people", "notification", "notify"],
    response:    "We already have **2,400+ people** on our early-access waitlist! 🎉\n\nJoin them by filling the form on this page. Early members get:\n\n• **Priority access** when we launch\n• **Exclusive early-bird offers**\n• **Updates** directly from the team",
    suggestions: ["How it works? 🔄", "What services? 🔧", "Is it safe? 🛡️"],
    cta:         { label: "Join 2,400+ on the Waitlist 🚀", section: "waitlist" },
  },
  {
    keywords:    ["fast", "quick", "speed", "same day", "how long", "wait", "time", "minutes", "hours", "instant", "urgent", "emergency"],
    response:    "Speed is a priority at Homizy ⚡\n\nMost bookings are confirmed within **minutes**, and many professionals are available **same-day or next morning**.\n\nFor urgent needs, our AI prioritises finding someone available immediately in your area.",
    suggestions: ["What services? 🔧", "Is it safe? 🛡️", "Join waitlist 🚀"],
    cta:         null,
  },
  {
    keywords:    ["professional", "pro", "provider", "worker", "technician", "plumber", "electrician", "cleaner", "how good", "quality", "experience", "expert"],
    response:    "All Homizy professionals are **screened, verified, and rated** by real customers 👷\n\nOur AI also matches you with the best-fit pro based on:\n\n• Your **exact location**\n• The **type of job**\n• Their **past ratings and reviews**\n\nSo you always get the right person for the job.",
    suggestions: ["Is it safe? 🛡️", "How it works? 🔄", "Join waitlist 🚀"],
    cta:         null,
  },
  {
    keywords:    ["contact", "support", "help", "team", "reach", "call us", "email", "feedback"],
    response:    "For any queries, you can reach us via the contact details in the **footer** below.\n\nWe'd love to hear from you — whether you're a homeowner, a service professional wanting to join, or a potential partner.",
    suggestions: ["How it works? 🔄", "What services? 🔧", "Join waitlist 🚀"],
    cta:         null,
  },
];

const FALLBACK: { reply: string; suggestions: string[]; cta: null } = {
  reply:
    "I'm Homizy's assistant and I can only answer questions about our platform 😊\n\nFeel free to ask me about our services, how booking works, safety, pricing, or how to join our waitlist!",
  suggestions: ["How it works? 🔄", "What services? 🔧", "Join waitlist 🚀"],
  cta: null,
};

// ─── Scoring engine ───────────────────────────────────────────────────────────

function scoreIntent(message: string, keywords: string[]): number {
  const lower = message.toLowerCase();
  return keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
}

function getBestIntent(message: string): Intent | null {
  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    const s = scoreIntent(message, intent.keywords);
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }

  return best;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body as { message?: string };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const intent = getBestIntent(message.trim());

    if (!intent) {
      return NextResponse.json(FALLBACK);
    }

    return NextResponse.json({
      reply:       intent.response,
      suggestions: intent.suggestions,
      cta:         intent.cta,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
