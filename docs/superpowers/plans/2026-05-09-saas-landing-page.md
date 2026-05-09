# SaaS Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal brand landing page for Edvinas Giniotis — single-page scroll narrative targeting Upwork clients with a Three.js hero, GSAP scroll animations, and Linear.app-quality dark aesthetic.

**Architecture:** Next.js 15 App Router with static export (`output: 'export'`). Each animation-heavy section is a `'use client'` component. Three.js is isolated in `ThreeScene.tsx` and loaded via `dynamic(..., { ssr: false })` to avoid SSR. GSAP manages all non-Three.js animations via ScrollTrigger through a shared `useScrollAnimation` hook.

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4, GSAP + ScrollTrigger, Three.js, Jest + Testing Library

---

## File Map

```
src/
  app/
    page.tsx                              NEW
    layout.tsx                            MODIFY
    globals.css                           MODIFY
  components/
    nav/Navbar.tsx                        NEW
    hero/HeroSection.tsx                  NEW
    hero/ThreeScene.tsx                   NEW
    sections/ValueProps.tsx               NEW
    sections/Services.tsx                 NEW
    sections/ServiceCard.tsx              NEW
    sections/TechStack.tsx                NEW
    sections/Portfolio.tsx                NEW
    sections/ProjectCard.tsx              NEW
    sections/Process.tsx                  NEW
    sections/WhyMe.tsx                    NEW
    sections/CtaSection.tsx               NEW
    footer/Footer.tsx                     NEW
  hooks/
    useScrollAnimation.ts                 NEW
  lib/
    gsap.ts                               NEW
    constants.ts                          NEW
  __tests__/
    hooks/useScrollAnimation.test.ts      NEW
    components/Navbar.test.tsx            NEW
    components/HeroSection.test.tsx       NEW
    components/ValueProps.test.tsx        NEW
    components/Services.test.tsx          NEW
    components/TechStack.test.tsx         NEW
    components/Portfolio.test.tsx         NEW
    components/Process.test.tsx           NEW
    components/WhyMe.test.tsx             NEW
    components/CtaSection.test.tsx        NEW
    components/Footer.test.tsx            NEW

next.config.ts                            MODIFY
jest.config.ts                            NEW
jest.setup.ts                             NEW
```

---

## Task 1: Scaffold project and configure Jest

**Files:**
- Create: project root (via `create-next-app`)
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Scaffold Next.js 15 with Tailwind v4**

Run in `C:\Users\G1N\Projects\showcase`:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

When prompted about extra options, accept defaults. If asked whether to use Turbopack, select **Yes**.

- [ ] **Step 2: Install animation and test dependencies**

```bash
npm install gsap three
npm install --save-dev @types/three @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

- [ ] **Step 3: Create `jest.config.ts`**

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 4: Create `jest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test scripts to `package.json`**

In `package.json`, ensure `scripts` contains:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 6: Smoke-test Jest**

Create `src/__tests__/smoke.test.ts`:

```ts
test('Jest is configured correctly', () => {
  expect(true).toBe(true)
})
```

Run:
```bash
npm test -- --testPathPattern=smoke
```

Expected output: `PASS src/__tests__/smoke.test.ts`

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js 15 project with Tailwind v4 and Jest"
```

---

## Task 2: Global configuration

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `next.config.ts`
- Create: `src/lib/constants.ts`
- Create: `src/lib/gsap.ts`

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-geist-sans);

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

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'Edvinas Giniotis — Full-Stack SaaS Developer',
  description:
    'I build SaaS products that ship. Next.js, Supabase, Stripe. End-to-end, fast.',
  openGraph: {
    title: 'Edvinas Giniotis — Full-Stack SaaS Developer',
    description:
      'I build SaaS products that ship. Next.js, Supabase, Stripe. End-to-end, fast.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Replace `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
}

export default nextConfig
```

- [ ] **Step 4: Create `src/lib/constants.ts`**

```ts
// Update UPWORK_URL with your actual Upwork profile URL before deploying.
export const UPWORK_URL = 'https://www.upwork.com/freelancers/~01placeholder'
export const GITHUB_URL = 'https://github.com/edvinasginiotis'
export const EMAIL = 'edvinas.giniotis@gmail.com'
```

- [ ] **Step 5: Create `src/lib/gsap.ts`**

```ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

- [ ] **Step 6: Verify dev server starts cleanly**

```bash
npm run dev
```

Open `http://localhost:3000`. Default Next.js page loads with no terminal errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx next.config.ts src/lib/constants.ts src/lib/gsap.ts
git commit -m "feat: configure global styles, layout, GSAP, and constants"
```

---

## Task 3: useScrollAnimation hook

**Files:**
- Create: `src/hooks/useScrollAnimation.ts`
- Test: `src/__tests__/hooks/useScrollAnimation.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/hooks/useScrollAnimation.test.ts`:

```ts
import { renderHook } from '@testing-library/react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    from: jest.fn(),
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}))

describe('useScrollAnimation', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useScrollAnimation('[data-test]'))
    expect(result.current).toHaveProperty('current')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=useScrollAnimation
```

Expected: `FAIL` — `Cannot find module '@/hooks/useScrollAnimation'`

- [ ] **Step 3: Create `src/hooks/useScrollAnimation.ts`**

```ts
'use client'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export function useScrollAnimation(selector: string) {
  const containerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [selector])

  return containerRef
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=useScrollAnimation
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useScrollAnimation.ts src/__tests__/hooks/useScrollAnimation.test.ts
git commit -m "feat: add useScrollAnimation hook"
```

---

## Task 4: Navbar

**Files:**
- Create: `src/components/nav/Navbar.tsx`
- Test: `src/__tests__/components/Navbar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/Navbar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Navbar from '@/components/nav/Navbar'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {
    create: jest.fn(),
  },
}))

describe('Navbar', () => {
  it('renders the developer name', () => {
    render(<Navbar />)
    expect(screen.getByText('Edvinas Giniotis')).toBeInTheDocument()
  })

  it('renders the Upwork CTA link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /hire on upwork/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=Navbar
```

Expected: `FAIL` — `Cannot find module '@/components/nav/Navbar'`

- [ ] **Step 3: Create `src/components/nav/Navbar.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { UPWORK_URL } from '@/lib/constants'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'body',
        start: '100px top',
        onEnter: () => navRef.current?.classList.add('nav-scrolled'),
        onLeaveBack: () => navRef.current?.classList.remove('nav-scrolled'),
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 [&.nav-scrolled]:backdrop-blur-md [&.nav-scrolled]:bg-black/30 [&.nav-scrolled]:border-b [&.nav-scrolled]:border-white/5"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary tracking-tight">
          Edvinas Giniotis
        </span>
        <a
          href={UPWORK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors duration-200"
        >
          Hire on Upwork
        </a>
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=Navbar
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/Navbar.tsx src/__tests__/components/Navbar.test.tsx
git commit -m "feat: add Navbar with scroll-activated blur"
```

---

## Task 5: HeroSection (text + GSAP entrance)

**Files:**
- Create: `src/components/hero/HeroSection.tsx`
- Test: `src/__tests__/components/HeroSection.test.tsx`

Note: `ThreeScene` is added in Task 6. The dynamic import in `HeroSection` renders `null` until then.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/HeroSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import HeroSection from '@/components/hero/HeroSection'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    from: jest.fn(),
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}))

jest.mock('next/dynamic', () => () => {
  const Mock = () => null
  Mock.displayName = 'ThreeScene'
  return Mock
})

describe('HeroSection', () => {
  it('renders the headline', () => {
    render(<HeroSection />)
    expect(screen.getByText(/I build SaaS products/i)).toBeInTheDocument()
  })

  it('renders the Upwork CTA link', () => {
    render(<HeroSection />)
    expect(screen.getByRole('link', { name: /hire me on upwork/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=HeroSection
```

Expected: `FAIL` — `Cannot find module '@/components/hero/HeroSection'`

- [ ] **Step 3: Create `src/components/hero/HeroSection.tsx`**

```tsx
'use client'
import { useLayoutEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import { UPWORK_URL } from '@/lib/constants'

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false })

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.15,
        delay: 0.3,
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg">
      <ThreeScene />
      <div ref={heroRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p
          data-hero
          className="text-sm font-medium text-accent tracking-widest uppercase mb-6"
        >
          Full-Stack SaaS Developer
        </p>
        <h1
          data-hero
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight leading-[1.05] mb-6"
        >
          I build SaaS products
          <br />
          that ship.
        </h1>
        <p
          data-hero
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          Next.js · Supabase · Stripe. End-to-end, fast.
        </p>
        <div data-hero>
          <a
            href={UPWORK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl text-base transition-colors duration-200 shadow-lg shadow-accent/20"
          >
            Hire me on Upwork
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=HeroSection
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/HeroSection.tsx src/__tests__/components/HeroSection.test.tsx
git commit -m "feat: add HeroSection with GSAP entrance animation"
```

---

## Task 6: ThreeScene (particle field)

**Files:**
- Create: `src/components/hero/ThreeScene.tsx`

Three.js requires a real WebGL context — jsdom cannot provide one. Visual verification in the dev server is the acceptance test.

- [ ] **Step 1: Create `src/components/hero/ThreeScene.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.innerWidth < 640
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const particleCount = isMobile ? 800 : 2000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: isMobile ? 0.03 : 0.02,
      transparent: true,
      opacity: 0.5,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.5,
        y: (e.clientY / window.innerHeight - 0.5) * 0.5,
      }
    }
    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    const rotationSpeed = prefersReducedMotion ? 0 : 0.0005
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      particles.rotation.y += rotationSpeed
      particles.rotation.x += rotationSpeed * 0.4

      if (!isMobile && !prefersReducedMotion) {
        camera.position.x += (mouseRef.current.x - camera.position.x) * 0.02
        camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.02
        camera.lookAt(scene.position)
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 -z-10" />
}
```

- [ ] **Step 2: Verify in dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm:
- Purple particles visible in hero background
- Particles slowly rotate
- Mouse movement shifts camera perspective subtly
- No console errors

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/ThreeScene.tsx
git commit -m "feat: add Three.js particle scene to hero"
```

---

## Task 7: ValueProps section

**Files:**
- Create: `src/components/sections/ValueProps.tsx`
- Test: `src/__tests__/components/ValueProps.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/ValueProps.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import ValueProps from '@/components/sections/ValueProps'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('ValueProps', () => {
  it('renders all three value propositions', () => {
    render(<ValueProps />)
    expect(screen.getByText('3-week')).toBeInTheDocument()
    expect(screen.getByText('Full-stack')).toBeInTheDocument()
    expect(screen.getByText('Clean code')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=ValueProps
```

Expected: `FAIL` — `Cannot find module '@/components/sections/ValueProps'`

- [ ] **Step 3: Create `src/components/sections/ValueProps.tsx`**

```tsx
'use client'
import type React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const props = [
  { stat: '3-week', label: 'MVP delivery' },
  { stat: 'Full-stack', label: 'DB to deployment' },
  { stat: 'Clean code', label: 'No handoff chaos' },
]

export default function ValueProps() {
  const ref = useScrollAnimation('[data-value-prop]')

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-6 bg-bg border-y border-border"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
        {props.map(({ stat, label }) => (
          <div key={stat} data-value-prop className="flex flex-col gap-2">
            <span className="text-4xl font-bold text-text-primary tracking-tight">
              {stat}
            </span>
            <span className="text-text-secondary text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=ValueProps
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ValueProps.tsx src/__tests__/components/ValueProps.test.tsx
git commit -m "feat: add ValueProps section"
```

---

## Task 8: Services section

**Files:**
- Create: `src/components/sections/ServiceCard.tsx`
- Create: `src/components/sections/Services.tsx`
- Test: `src/__tests__/components/Services.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/Services.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Services from '@/components/sections/Services'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('Services', () => {
  it('renders all three service titles', () => {
    render(<Services />)
    expect(screen.getByText('SaaS MVP Build')).toBeInTheDocument()
    expect(screen.getByText('Product Iteration')).toBeInTheDocument()
    expect(screen.getByText('Technical Consulting')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=Services
```

Expected: `FAIL` — `Cannot find module '@/components/sections/Services'`

- [ ] **Step 3: Create `src/components/sections/ServiceCard.tsx`**

```tsx
interface ServiceCardProps {
  icon: string
  title: string
  description: string
}

export default function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="p-6 rounded-card border border-border bg-surface hover:border-accent/30 transition-colors duration-300">
      <span className="text-3xl mb-4 block" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/sections/Services.tsx`**

```tsx
'use client'
import type React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import ServiceCard from './ServiceCard'

const services = [
  {
    icon: '🚀',
    title: 'SaaS MVP Build',
    description:
      'From idea to deployed product in weeks. Auth, payments, database — all wired up and production-ready.',
  },
  {
    icon: '⚡',
    title: 'Product Iteration',
    description:
      'Existing codebase needs new features or a performance overhaul? I move fast without breaking things.',
  },
  {
    icon: '🎯',
    title: 'Technical Consulting',
    description:
      'Architecture review, tech stack decisions, or just a second opinion. Clear answers, no fluff.',
  },
]

export default function Services() {
  const ref = useScrollAnimation('[data-service-card]')

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          What I build
        </h2>
        <p className="text-text-secondary mb-12 max-w-xl">
          End-to-end SaaS development — from the database schema to the deploy button.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} data-service-card>
              <ServiceCard {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=Services
```

Expected: `PASS`

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ServiceCard.tsx src/components/sections/Services.tsx src/__tests__/components/Services.test.tsx
git commit -m "feat: add Services section with ServiceCard"
```

---

## Task 9: TechStack section (infinite marquee)

**Files:**
- Create: `src/components/sections/TechStack.tsx`
- Test: `src/__tests__/components/TechStack.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/TechStack.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import TechStack from '@/components/sections/TechStack'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    to: jest.fn(),
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}))

describe('TechStack', () => {
  it('renders the section label', () => {
    render(<TechStack />)
    expect(screen.getByText(/tech stack/i)).toBeInTheDocument()
  })

  it('renders Next.js in the marquee', () => {
    render(<TechStack />)
    const items = screen.getAllByText('Next.js')
    expect(items.length).toBeGreaterThanOrEqual(1)
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=TechStack
```

Expected: `FAIL` — `Cannot find module '@/components/sections/TechStack'`

- [ ] **Step 3: Create `src/components/sections/TechStack.tsx`**

```tsx
'use client'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const techs = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'PostgreSQL',
  'Stripe',
  'Vercel',
  'Expo',
  'Prisma',
]

export default function TechStack() {
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: '-50%',
        duration: 25,
        ease: 'none',
        repeat: -1,
      })
    })
    return () => ctx.revert()
  }, [])

  const doubled = [...techs, ...techs]

  return (
    <section className="py-16 bg-surface overflow-hidden border-y border-border">
      <div className="max-w-6xl mx-auto mb-8 px-6">
        <p className="text-text-secondary text-xs uppercase tracking-widest font-medium">
          Tech stack
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div ref={trackRef} className="flex gap-8 whitespace-nowrap w-max">
          {doubled.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="text-text-secondary font-medium text-sm px-4 py-2 border border-border rounded-lg bg-surface-elevated flex-shrink-0"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=TechStack
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/TechStack.tsx src/__tests__/components/TechStack.test.tsx
git commit -m "feat: add TechStack section with GSAP infinite marquee"
```

---

## Task 10: Portfolio section

**Files:**
- Create: `src/components/sections/ProjectCard.tsx`
- Create: `src/components/sections/Portfolio.tsx`
- Test: `src/__tests__/components/Portfolio.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/Portfolio.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Portfolio from '@/components/sections/Portfolio'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('Portfolio', () => {
  it('renders all three project names', () => {
    render(<Portfolio />)
    expect(screen.getByText('Nexus')).toBeInTheDocument()
    expect(screen.getByText('Flowboard')).toBeInTheDocument()
    expect(screen.getByText('Launchpad')).toBeInTheDocument()
  })

  it('labels all three cards as demos', () => {
    render(<Portfolio />)
    expect(screen.getAllByText('Demo')).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=Portfolio
```

Expected: `FAIL` — `Cannot find module '@/components/sections/Portfolio'`

- [ ] **Step 3: Create `src/components/sections/ProjectCard.tsx`**

```tsx
interface ProjectCardProps {
  name: string
  description: string
  tags: string[]
}

export default function ProjectCard({ name, description, tags }: ProjectCardProps) {
  return (
    <div className="rounded-card border border-border bg-surface overflow-hidden hover:border-accent/30 transition-colors duration-300">
      <div className="bg-surface-elevated px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <span className="ml-2 text-xs text-white/20 flex-1 truncate">
          {name.toLowerCase()}.app
        </span>
      </div>
      <div className="h-40 bg-gradient-to-br from-surface-elevated to-surface flex items-center justify-center">
        <span className="text-4xl opacity-20" aria-hidden="true">
          ✦
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-text-primary">{name}</h3>
          <span className="text-xs text-accent border border-accent/30 px-2 py-0.5 rounded-full">
            Demo
          </span>
        </div>
        <p className="text-text-secondary text-sm mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-text-secondary bg-surface-elevated border border-border px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/sections/Portfolio.tsx`**

```tsx
'use client'
import type React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import ProjectCard from './ProjectCard'

const projects = [
  {
    name: 'Nexus',
    description: 'AI-powered project management SaaS',
    tags: ['Next.js', 'Supabase', 'Stripe'],
  },
  {
    name: 'Flowboard',
    description: 'Real-time team collaboration platform',
    tags: ['Next.js', 'PostgreSQL', 'WebSockets'],
  },
  {
    name: 'Launchpad',
    description: 'Startup landing page builder',
    tags: ['React', 'Tailwind', 'Vercel'],
  },
]

export default function Portfolio() {
  const ref = useScrollAnimation('[data-project-card]')

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          Recent work
        </h2>
        <p className="text-text-secondary mb-12 max-w-xl">
          Sample projects demonstrating end-to-end SaaS architecture.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.name} data-project-card>
              <ProjectCard {...p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=Portfolio
```

Expected: `PASS`

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ProjectCard.tsx src/components/sections/Portfolio.tsx src/__tests__/components/Portfolio.test.tsx
git commit -m "feat: add Portfolio section with placeholder project cards"
```

---

## Task 11: Process section

**Files:**
- Create: `src/components/sections/Process.tsx`
- Test: `src/__tests__/components/Process.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/Process.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Process from '@/components/sections/Process'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    from: jest.fn(),
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}))

describe('Process', () => {
  it('renders all four step titles', () => {
    render(<Process />)
    expect(screen.getByText('Discovery')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Build')).toBeInTheDocument()
    expect(screen.getByText('Launch')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=Process
```

Expected: `FAIL` — `Cannot find module '@/components/sections/Process'`

- [ ] **Step 3: Create `src/components/sections/Process.tsx`**

```tsx
'use client'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Define scope, stack, and milestones. No surprises.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Architecture-first. Schema, API contracts, component tree.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Iterative delivery. You see progress every few days.',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'Deploy, monitor, handoff. Clean docs included.',
  },
]

export default function Process() {
  const containerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-step]', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-24 px-6 bg-surface border-y border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-12">
          How I work
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {steps.map(({ number, title, description }) => (
            <div key={number} data-step className="relative">
              <span className="text-7xl font-bold text-white/[0.04] absolute -top-4 -left-2 select-none leading-none">
                {number}
              </span>
              <div className="relative pt-8">
                <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=Process
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Process.tsx src/__tests__/components/Process.test.tsx
git commit -m "feat: add Process section with staggered scroll animation"
```

---

## Task 12: WhyMe section

**Files:**
- Create: `src/components/sections/WhyMe.tsx`
- Test: `src/__tests__/components/WhyMe.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/WhyMe.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import WhyMe from '@/components/sections/WhyMe'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('WhyMe', () => {
  it('renders all three differentiator titles', () => {
    render(<WhyMe />)
    expect(screen.getByText('Solo dev speed')).toBeInTheDocument()
    expect(screen.getByText('Shipped products, not prototypes')).toBeInTheDocument()
    expect(screen.getByText('Async-friendly timezone')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=WhyMe
```

Expected: `FAIL` — `Cannot find module '@/components/sections/WhyMe'`

- [ ] **Step 3: Create `src/components/sections/WhyMe.tsx`**

```tsx
'use client'
import type React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const reasons = [
  {
    title: 'Solo dev speed',
    description:
      'No agency overhead, no account managers, no handoff delays. You talk directly to the person writing the code.',
  },
  {
    title: 'Shipped products, not prototypes',
    description:
      'Every pattern I use has been stress-tested in production — auth, payments, queues, webhooks.',
  },
  {
    title: 'Async-friendly timezone',
    description:
      'Lithuania (EET/EEST) overlaps EU mornings and US afternoons. Updates land while you sleep.',
  },
]

export default function WhyMe() {
  const ref = useScrollAnimation('[data-reason]')

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-12">
          Why me
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ title, description }) => (
            <div
              key={title}
              data-reason
              className="p-6 rounded-card border border-border bg-surface"
            >
              <div className="w-8 h-0.5 bg-accent mb-4" aria-hidden="true" />
              <h3 className="text-base font-semibold text-text-primary mb-3">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=WhyMe
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/WhyMe.tsx src/__tests__/components/WhyMe.test.tsx
git commit -m "feat: add WhyMe section"
```

---

## Task 13: CtaSection

**Files:**
- Create: `src/components/sections/CtaSection.tsx`
- Test: `src/__tests__/components/CtaSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/CtaSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import CtaSection from '@/components/sections/CtaSection'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('CtaSection', () => {
  it('renders the headline', () => {
    render(<CtaSection />)
    expect(screen.getByText(/ready to build something/i)).toBeInTheDocument()
  })

  it('renders the Upwork CTA link', () => {
    render(<CtaSection />)
    expect(screen.getByRole('link', { name: /hire me on upwork/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=CtaSection
```

Expected: `FAIL` — `Cannot find module '@/components/sections/CtaSection'`

- [ ] **Step 3: Create `src/components/sections/CtaSection.tsx`**

```tsx
'use client'
import type React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { UPWORK_URL } from '@/lib/constants'

export default function CtaSection() {
  const ref = useScrollAnimation('[data-cta]')

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-32 px-6 bg-surface border-t border-border"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          data-cta
          className="text-4xl sm:text-5xl font-bold text-text-primary tracking-tight mb-6"
        >
          Ready to build something?
        </h2>
        <p data-cta className="text-text-secondary text-lg mb-10">
          Let's talk about your project.
        </p>
        <div data-cta>
          <a
            href={UPWORK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl text-lg transition-colors duration-200 shadow-xl shadow-accent/20"
          >
            Hire me on Upwork
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=CtaSection
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/CtaSection.tsx src/__tests__/components/CtaSection.test.tsx
git commit -m "feat: add CtaSection"
```

---

## Task 14: Footer

**Files:**
- Create: `src/components/footer/Footer.tsx`
- Test: `src/__tests__/components/Footer.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/components/Footer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Footer from '@/components/footer/Footer'

describe('Footer', () => {
  it('renders the developer name', () => {
    render(<Footer />)
    expect(screen.getByText('Edvinas Giniotis')).toBeInTheDocument()
  })

  it('renders Upwork, GitHub, and Email links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /upwork/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=Footer
```

Expected: `FAIL` — `Cannot find module '@/components/footer/Footer'`

- [ ] **Step 3: Create `src/components/footer/Footer.tsx`**

```tsx
import { UPWORK_URL, GITHUB_URL, EMAIL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="py-8 px-6 bg-bg border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-text-secondary text-sm">Edvinas Giniotis</span>
        <nav
          className="flex items-center gap-6 text-sm text-text-secondary"
          aria-label="Footer navigation"
        >
          <a
            href={UPWORK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            Upwork
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="hover:text-text-primary transition-colors"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- --testPathPattern=Footer
```

Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/components/footer/Footer.tsx src/__tests__/components/Footer.test.tsx
git commit -m "feat: add Footer"
```

---

## Task 15: Compose page.tsx and final verification

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/lib/constants.ts` (set real Upwork URL)

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import Navbar from '@/components/nav/Navbar'
import HeroSection from '@/components/hero/HeroSection'
import ValueProps from '@/components/sections/ValueProps'
import Services from '@/components/sections/Services'
import TechStack from '@/components/sections/TechStack'
import Portfolio from '@/components/sections/Portfolio'
import Process from '@/components/sections/Process'
import WhyMe from '@/components/sections/WhyMe'
import CtaSection from '@/components/sections/CtaSection'
import Footer from '@/components/footer/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ValueProps />
        <Services />
        <TechStack />
        <Portfolio />
        <Process />
        <WhyMe />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Run full test suite**

```bash
npm test
```

Expected: All tests `PASS` with 0 failures.

- [ ] **Step 3: Update `src/lib/constants.ts` with real Upwork URL**

Replace `'https://www.upwork.com/freelancers/~01placeholder'` with the actual Upwork profile URL. (If not ready, leave the placeholder and do this before deploying.)

- [ ] **Step 4: Start dev server and visual QA checklist**

```bash
npm run dev
```

Open `http://localhost:3000` and verify each item:

- [ ] Three.js particle field visible in hero background and animating
- [ ] GSAP entrance: hero text fades and slides up on load
- [ ] Scrolling reveals each section with fade-up animation
- [ ] TechStack marquee scrolls infinitely without jumping
- [ ] Navbar gains blur + border after scrolling past the hero
- [ ] All "Hire on Upwork" / "Hire me on Upwork" links are present
- [ ] Services cards have hover border highlight
- [ ] Portfolio Demo badges visible on all 3 cards
- [ ] Process steps have large faded numbers behind them
- [ ] WhyMe cards have accent bar above title
- [ ] Mobile layout (DevTools → 390×844): all grids stack to single column, no overflow

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/lib/constants.ts
git commit -m "feat: compose full landing page — production ready"
```
