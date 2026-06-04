# Homigo — Codebase Reference

> **Purpose:** Ye file AI agents aur developers ke liye quick reference hai.  
> Koi bhi change karne se pehle is file ka section padho — tokens bachenge, galti nahi hogi.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` — no `tailwind.config.ts`) |
| Icons | `lucide-react` (social icons not available — use inline SVG) |
| Fonts | `next/font/google` — Fraunces (headings), DM Sans (body) |
| Animations | Custom CSS keyframes in `globals.css` |

---

## Folder Structure

```
src/
├── app/
│   ├── globals.css          ← Tailwind @theme tokens + all keyframes + utility classes
│   ├── layout.tsx           ← Font setup (Fraunces + DM Sans), metadata
│   └── page.tsx             ← Root page — imports from barrel files only
│
├── components/
│   ├── layout/              ← Structural chrome (always on screen)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts         ← barrel: export { Navbar, Footer }
│   │
│   ├── sections/            ← Page sections (scroll order = import order in page.tsx)
│   │   ├── Hero.tsx
│   │   ├── Problem.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Services.tsx
│   │   ├── WhyHomigo.tsx
│   │   ├── Waitlist.tsx
│   │   └── index.ts         ← barrel: export all sections
│   │
│   └── ui/                  ← Reusable primitives
│       ├── SectionHeader.tsx
│       └── index.ts         ← barrel: export { SectionHeader }
│
├── constants/
│   └── index.ts             ← ALL hardcoded data lives here (see "Data" section below)
│
├── hooks/
│   └── useInView.ts         ← IntersectionObserver hook → [ref, isVisible]
│
├── lib/
│   └── types.ts             ← WaitlistEntry, WaitlistResponse (legacy, re-exported from types/)
│
└── types/
    └── index.ts             ← UserRole, WaitlistFormData + re-exports from lib/types.ts
```

---

## Design Tokens

Defined in `src/app/globals.css` under `@theme inline {}`.  
**Do NOT create a `tailwind.config.ts`** — this project uses Tailwind v4 CSS-first config.

```css
--color-primary:       #0D9488   /* teal — main brand */
--color-primary-dark:  #0b7c70
--color-primary-light: #e6f7f5

--color-accent:        #F59E0B   /* saffron/amber */
--color-accent-light:  #fef3c7

--color-cream:         #FAFAF7   /* page background */
--color-dark:          #1C1C1E   /* charcoal text */
--color-muted:         #6B7280   /* gray text */
```

Use raw hex in Tailwind classes — e.g. `bg-[#0D9488]`, `text-[#6B7280]`.

---

## Fonts

```tsx
// layout.tsx
style={{ fontFamily: "var(--font-fraunces)" }}   // headings
style={{ fontFamily: "var(--font-dm-sans)" }}    // body (set as default on <body>)
```

CSS variables are injected by `next/font/google` via `fraunces.variable` and `dmSans.variable` on `<html>`.

---

## Animation Classes

All defined in `globals.css` — use directly in JSX className.

| Class | Effect |
|---|---|
| `animate-pulse-ring` | Teal glow pulse (mic button) |
| `animate-fade-in-up` | Entrance from below (sections) |
| `animate-float` | Slow vertical bob (bg orbs) |
| `animate-spin-slow` | 18s rotation (decorative rings) |
| `text-shimmer` | Animated gradient text |
| `glass` | Frosted glass card (backdrop-blur) |
| `btn-primary` | Teal gradient button with hover lift |
| `card-lift` | translateY(-5px) + shadow on hover |
| `delay-100` … `delay-800` | Animation delay helpers (100ms steps) |

Scroll-triggered animation pattern:
```tsx
const [ref, isVisible] = useInView();
<section ref={ref as React.RefObject<HTMLElement>}>
  <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
```

---

## Data — Where to Edit Content

**All user-visible text and data is in `src/constants/index.ts`.**  
Edit there — components read from it, nothing is hardcoded inside components.

| Export | What it controls |
|---|---|
| `NAV_LINKS` | Navbar links (label + href) |
| `HERO_PILLS` | Service pill tags in Hero |
| `WAITLIST_COUNT` | "2,400+" badge count (update manually) |
| `PROBLEMS` | Problem section — icon, title, description |
| `STEPS` | How It Works — icon, number, title, description, `showChatBubble` |
| `SERVICES` | Services grid — icon, title, description, bgClass, textClass |
| `REASONS` | Why Homigo — icon, title, description |
| `FOOTER_LINKS` | Footer navigation links |

### Adding a new service card
1. Open `src/constants/index.ts`
2. Add entry to `SERVICES` array with a Lucide icon, title, description, `bgClass` (Tailwind bg), `textClass` (Tailwind text color)
3. Done — `Services.tsx` renders it automatically

### Changing waitlist count
1. Open `src/constants/index.ts`
2. Edit `WAITLIST_COUNT = "2,400+"`

---

## Components — Quick Guide

### `SectionHeader` (ui)
Reusable heading block. Used in every section.

```tsx
<SectionHeader
  eyebrow="How it works"          // small uppercase label above heading
  heading="Here's how it works"   // h2
  subheading="Three steps."       // optional p below h2
  eyebrowColor="teal"             // "teal" | "amber"
  headingColor="dark"             // "dark" | "white"
  subheadingColor="muted"         // "muted" | "white"
  className="mb-14"               // extra classes for spacing
/>
```

### `useInView` (hook)
```ts
const [ref, isVisible] = useInView();
// ref    → attach to section element
// isVisible → true once section enters viewport (fires once, unobserves)
```

### `Waitlist` (section)
- Pure frontend — no API call on submit
- Form state lives in `WaitlistFormData` type (`src/types/index.ts`)
- On submit: sets `submitted = true`, shows `SuccessCard` with city name
- Role toggle: `"customer"` | `"provider"` (type `UserRole`)

### `Navbar` (layout)
- `scrolled` state: triggers `backdrop-blur + shadow` after `scrollY > 12`
- Nav links come from `NAV_LINKS` constant
- Mobile: `max-h` CSS transition (no JS height calc)

---

## Common Tasks

### Add a new section
1. Create `src/components/sections/NewSection.tsx`
2. Export named: `export function NewSection() { ... }`
3. Add `export { NewSection } from "./NewSection"` to `src/components/sections/index.ts`
4. Import and place in `src/app/page.tsx`
5. Add any data to `src/constants/index.ts`

### Change brand color (teal → something else)
1. `src/app/globals.css` → update `--color-primary`, `--color-primary-dark`, `--color-primary-light`
2. Update all `#0D9488` / `#0b7c70` / `#e6f7f5` hex values in components  
   (search: `0D9488` across `src/`)

### Change heading font
1. `src/app/layout.tsx` → swap `Fraunces` import for new font
2. Update `variable: "--font-fraunces"` name if needed
3. All `style={{ fontFamily: "var(--font-fraunces)" }}` will update automatically

### Add a new animation
1. Add `@keyframes myAnim { ... }` in `globals.css`
2. Add `.animate-my-anim { animation: myAnim ... }` utility class
3. Use `className="animate-my-anim"` in component

### Add nav link
1. `src/constants/index.ts` → add to `NAV_LINKS` array
2. Add corresponding `id` to the target section

---

## Icons

Using `lucide-react`. Import named icons:
```tsx
import { Mic, ShieldCheck, Wrench } from "lucide-react";
<Mic size={24} strokeWidth={1.8} className="text-[#0D9488]" />
```

**Note:** Social icons (Instagram, LinkedIn, Twitter) are NOT in lucide-react.  
They are inline SVG in `src/components/layout/Footer.tsx` → `SocialLink` sub-component.

---

## What NOT to do

| Don't | Because |
|---|---|
| Create `tailwind.config.ts` | Project uses Tailwind v4 CSS-first config |
| Hardcode data inside components | All data lives in `src/constants/index.ts` |
| Import sections/layout directly by file path | Use barrel imports: `@/components/sections` |
| Add API calls to `Waitlist.tsx` | Currently pure frontend — no backend |
| Use `Instagram`, `Linkedin`, `Twitter` from lucide-react | Not available in installed version |
| Add `"use client"` to `layout.tsx` or `page.tsx` | They are server components |

---

## File → Responsibility Map

| File | Change this when you want to… |
|---|---|
| `globals.css` | Change colors, fonts, add animations, tweak glass/card styles |
| `constants/index.ts` | Edit any text, icons, links, or counts |
| `types/index.ts` | Change form shape, add new domain types |
| `app/layout.tsx` | Change fonts, metadata, `<html>` attributes |
| `app/page.tsx` | Change section order, add/remove sections |
| `components/layout/Navbar.tsx` | Change nav behavior, logo, scroll threshold |
| `components/layout/Footer.tsx` | Change footer layout, social links |
| `components/sections/Hero.tsx` | Change hero layout, mic button behavior |
| `components/sections/Waitlist.tsx` | Change form fields, success message, role toggle |
| `components/ui/SectionHeader.tsx` | Change heading structure for all sections at once |
| `hooks/useInView.ts` | Change scroll trigger threshold or behavior |
