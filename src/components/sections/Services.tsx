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
