# SaaS Landing Page — Portfolio Showcase

**Date:** 2026-05-09  
**Goal:** Personal brand landing page for Edvinas Giniotis targeting Upwork clients  
**Primary CTA:** "Hire me on Upwork" (direct Upwork profile link)  
**Quality target:** Linear.app visual fidelity  
**Stack:** Next.js 15, TypeScript, Tailwind v4, GSAP + ScrollTrigger, Three.js  

---

## 1. Purpose & Success Criteria

A single-page scroll narrative that establishes Edvinas as a senior full-stack SaaS developer and converts Upwork visitors into hires. Success means:

- Visitor scrolls through the full page in one session
- CTA is visible and reachable from every scroll position (fixed nav)
- Page loads in <3s on a typical Upwork client's connection
- 90+ Lighthouse performance score
- Works on mobile but is optimized for desktop (Upwork clients browse on desktop)

---

## 2. Page Sections

Ten items in scroll order (Nav + 8 content sections + Footer):

| # | Section | Content |
|---|---------|---------|
| 1 | **Nav** | Fixed. Name/logo left. Single "Hire on Upwork" button right. Background blur activates after scrolling past hero. |
| 2 | **Hero** | Full viewport. Three.js animated canvas behind text. Headline: "I build SaaS products that ship." Subline: "Full-stack developer — Next.js, Supabase, Stripe. End-to-end, fast." Primary CTA button. |
| 3 | **Value props** | Three horizontal stats/statements: "3-week MVP delivery", "Full-stack — from DB to deployment", "Clean code, no handoff chaos". |
| 4 | **Services** | Three glass cards: SaaS MVP Build, Product Iteration, Technical Consulting. Each has an icon, 1-line title, 2-line description. |
| 5 | **Tech stack** | Infinite horizontal marquee of technology logos: Next.js, React, TypeScript, Tailwind, Supabase, PostgreSQL, Stripe, Vercel, Expo, Prisma. |
| 6 | **Portfolio** | Three placeholder project cards. Each: mock browser-frame screenshot (dark UI), project name, 1-line description, tech tags. Cards link to `#` until real projects are available. |
| 7 | **Process** | Four numbered steps with icons: 1 Discovery, 2 Design, 3 Build, 4 Launch. Horizontal on desktop, vertical stack on mobile. Steps animate in sequentially on scroll. |
| 8 | **Why me** | Three honest differentiators in a dark card grid: "Solo dev speed — no agency overhead", "Shipped products, not prototypes", "Lithuania timezone — async-friendly for US & EU clients". |
| 9 | **CTA section** | Full-width dark section. Large headline: "Ready to build something?" Subline: "Let's talk about your project." Single large "Hire me on Upwork" button. |
| 10 | **Footer** | Single row: name, Upwork link, GitHub link, email. Minimal. |

---

## 3. Architecture

```
src/
  app/
    page.tsx                  ← composes all sections, 'use client' at top
    layout.tsx                ← font loading, metadata
    globals.css               ← Tailwind v4 theme tokens
  components/
    nav/
      Navbar.tsx
    hero/
      HeroSection.tsx
      ThreeScene.tsx          ← Three.js canvas, no GSAP inside
    sections/
      ValueProps.tsx
      Services.tsx
      ServiceCard.tsx
      TechStack.tsx
      Portfolio.tsx
      ProjectCard.tsx
      Process.tsx
      WhyMe.tsx
      CtaSection.tsx
    footer/
      Footer.tsx
  hooks/
    useScrollAnimation.ts     ← GSAP ScrollTrigger setup per section
  lib/
    gsap.ts                   ← registers ScrollTrigger, exports gsap instance
```

**Rules:**
- Each section component is self-contained, accepts no props
- Max 150 lines per file — sub-elements extracted into their own files
- No animation logic inside section components — use `useScrollAnimation` hook
- `ThreeScene.tsx` is the only file that imports Three.js

---

## 4. Animation System

### Three.js (Hero only)

- Floating particle field or abstract geometric mesh on `<canvas>`
- Subtle mouse-parallax: particles shift slightly on `mousemove`
- Loaded via `dynamic(() => import('./ThreeScene'), { ssr: false })` — never blocks SSR
- On mobile: particles count reduced by 60%, mouse-parallax disabled
- Cleanup: `renderer.dispose()` on unmount

### GSAP (All other sections)

All animations registered in `lib/gsap.ts`:

```ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
```

Animation patterns:

| Trigger | Animation |
|---------|-----------|
| Section enters viewport | `opacity: 0 → 1`, `y: 40 → 0`, ease: `power2.out` |
| Tech stack section | Infinite horizontal marquee — `gsap.to(x: '-50%')`, `repeat: -1`, `ease: none` |
| Process steps | Sequential stagger: `stagger: 0.15` |
| Nav scroll | `backdropFilter` class toggled via ScrollTrigger `toggleClass` |
| Hero text | Entrance animation on mount — letters/lines fade in before scroll |

Cleanup: all `ScrollTrigger` instances stored in refs, killed in `useLayoutEffect` return.

---

## 5. Styling System

**Theme (dark only, no light mode):**

```css
/* globals.css — Tailwind v4 tokens */
@theme {
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-surface-elevated: #1a1a1a;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-accent: #7c3aed;
  --color-accent-hover: #6d28d9;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a3a3a3;
  --radius-card: 12px;
}
```

**Typography:** Geist (Next.js default). Headings: `font-bold tracking-tight`. Body: `text-secondary`.

**Cards:** `backdrop-blur-sm bg-surface border border-border rounded-card` — glass morphism without overdoing it.

**Accent usage:** Purple `#7c3aed` on buttons, active states, and one highlight per section maximum. Never decorative.

---

## 6. Responsive Strategy

- Mobile-first CSS, but the page is optimised to impress on desktop
- Two breakpoints only: `sm` (640px) and `lg` (1024px)
- Grid layouts: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Three.js: `reduced-motion` media query and mobile detection both disable mouse parallax
- Process section: horizontal timeline on `lg`, vertical stack on mobile
- Nav: same on all breakpoints — no hamburger menu needed (single CTA only)

---

## 7. Performance

| Concern | Solution |
|---------|---------|
| Three.js bundle size | Dynamic import with `ssr: false` |
| GSAP bundle size | Import only `gsap/dist/gsap` + `ScrollTrigger` — no other plugins |
| Images | `next/image` with `priority` on hero, `lazy` everywhere else |
| Fonts | `next/font/google` with `display: swap` |
| No backend | Pure static export — `output: 'export'` in `next.config.ts` |
| Target | 90+ Lighthouse performance on desktop |

---

## 8. Content Placeholders

Until real projects are available, Portfolio section uses three placeholder cards:

- **Nexus** — "AI-powered project management SaaS" — tags: Next.js, Supabase, Stripe
- **Flowboard** — "Real-time team collaboration platform" — tags: Next.js, PostgreSQL, WebSockets  
- **Launchpad** — "Startup landing page builder" — tags: React, Tailwind, Vercel

These are clearly labelled as demos and removed once real projects ship.

---

## 9. Out of Scope

- Blog, case study pages, `/work` route
- Light mode
- Contact form (CTA goes directly to Upwork)
- Analytics (can be added post-launch with Vercel Analytics, one line)
- i18n
