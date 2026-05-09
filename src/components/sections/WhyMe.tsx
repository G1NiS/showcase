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
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 px-6 bg-gradient-to-b from-surface/20 to-bg">
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
