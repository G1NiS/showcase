'use client'
import { useState } from 'react'
import { useTilt } from '@/hooks/useTilt'

interface ServiceCardProps {
  icon: string
  title: string
  description: string
}

export default function ServiceCard({ icon, title, description }: ServiceCardProps) {
  const { ref, onMouseMove, onMouseLeave: tiltLeave } = useTilt(8)
  const [hovered, setHovered] = useState(false)

  const handleMouseLeave = () => {
    setHovered(false)
    tiltLeave()
  }

  return (
    <div
      ref={ref}
      data-service-card
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="h-full p-6 rounded-card border bg-surface transition-colors duration-300 will-change-transform"
      style={{
        borderColor: hovered ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.15)',
        boxShadow: hovered
          ? '0 0 20px rgba(124,58,237,0.25), 0 0 40px rgba(124,58,237,0.1), inset 0 0 20px rgba(124,58,237,0.05)'
          : 'none',
      }}
    >
      <span className="text-3xl mb-4 block" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  )
}
