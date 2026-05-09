'use client'
import { useState } from 'react'
import { useTilt } from '@/hooks/useTilt'

interface ProjectCardProps {
  name: string
  description: string
  tags: string[]
}

function MockDashboard({ name }: { name: string }) {
  const isAnalytics = name === 'Nexus'
  const isKanban = name === 'Flowboard'

  if (isKanban) {
    return (
      <div className="h-40 bg-surface-elevated overflow-hidden p-3 flex gap-2">
        {['To Do', 'In Progress', 'Done'].map((col, ci) => (
          <div key={col} className="flex-1 flex flex-col gap-1.5">
            <div className="text-[9px] text-white/30 font-medium mb-1 uppercase tracking-wide">{col}</div>
            {[...Array(ci === 1 ? 2 : 1)].map((_, i) => (
              <div key={i} className="bg-surface rounded p-1.5 border border-border">
                <div className={`h-1.5 rounded-full mb-1 ${ci === 0 ? 'bg-white/10 w-3/4' : ci === 1 ? 'bg-accent/40 w-full' : 'bg-white/5 w-1/2'}`} />
                <div className="h-1 rounded-full bg-white/5 w-1/2" />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (isAnalytics) {
    return (
      <div className="h-40 bg-surface-elevated overflow-hidden p-3">
        <div className="flex gap-2 mb-3">
          {['$12.4k', '1,842', '94%'].map((val, i) => (
            <div key={i} className="flex-1 bg-surface rounded p-2 border border-border">
              <div className="text-[10px] font-semibold text-white/60">{val}</div>
              <div className="h-1 rounded-full bg-white/5 w-2/3 mt-1" />
            </div>
          ))}
        </div>
        <div className="bg-surface rounded border border-border p-2 flex items-end gap-1 h-16">
          {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i === 7 ? 'rgba(124,58,237,0.7)' : 'rgba(255,255,255,0.08)',
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-40 bg-surface-elevated overflow-hidden flex">
      <div className="w-10 bg-surface border-r border-border flex flex-col items-center pt-3 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-5 h-5 rounded ${i === 0 ? 'bg-accent/30' : 'bg-white/5'}`} />
        ))}
      </div>
      <div className="flex-1 p-3">
        <div className="h-1.5 bg-white/10 rounded-full w-1/3 mb-3" />
        <div className="flex flex-col gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-border last:border-0">
              <div className="w-4 h-4 rounded-full bg-white/5 flex-shrink-0" />
              <div className="h-1.5 bg-white/10 rounded-full flex-1" />
              <div className="h-1.5 bg-accent/20 rounded-full w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProjectCard({ name, description, tags }: ProjectCardProps) {
  const { ref, onMouseMove, onMouseLeave: tiltLeave } = useTilt(8)
  const [hovered, setHovered] = useState(false)

  const handleMouseLeave = () => {
    setHovered(false)
    tiltLeave()
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="rounded-card border bg-surface overflow-hidden transition-colors duration-300 will-change-transform"
      style={{
        borderColor: hovered ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.15)',
        boxShadow: hovered
          ? '0 0 20px rgba(124,58,237,0.25), 0 0 40px rgba(124,58,237,0.1), inset 0 0 20px rgba(124,58,237,0.05)'
          : 'none',
      }}
    >
      <div className="bg-surface-elevated px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <span className="ml-2 text-xs text-white/20 flex-1 truncate">
          {name.toLowerCase()}.app
        </span>
      </div>
      <MockDashboard name={name} />
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
