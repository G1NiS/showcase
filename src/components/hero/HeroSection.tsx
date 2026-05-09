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
