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
