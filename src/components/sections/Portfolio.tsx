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
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 px-6 relative bg-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] blur-[150px] opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
        />
      </div>
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
