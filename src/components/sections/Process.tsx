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
