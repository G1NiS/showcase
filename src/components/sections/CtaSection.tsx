'use client'
import type React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { UPWORK_URL } from '@/lib/constants'

export default function CtaSection() {
  const ref = useScrollAnimation('[data-cta]')

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-32 px-6 relative bg-surface border-t border-border overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[100px] opacity-[0.08]"
          style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent 70%)' }}
        />
      </div>
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
