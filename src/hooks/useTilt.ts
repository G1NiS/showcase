'use client'
import { useRef, useCallback } from 'react'

export function useTilt(maxAngle = 10) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(700px) rotateX(${-y * maxAngle * 2}deg) rotateY(${x * maxAngle * 2}deg) scale3d(1.02,1.02,1.02)`
      el.style.transition = 'transform 0.1s ease-out'
    },
    [maxAngle],
  )

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    el.style.transition = 'transform 0.4s ease-out'
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
