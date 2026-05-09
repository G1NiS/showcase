'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { UPWORK_URL } from '@/lib/constants'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'body',
        start: '100px top',
        onEnter: () => navRef.current?.classList.add('nav-scrolled'),
        onLeaveBack: () => navRef.current?.classList.remove('nav-scrolled'),
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 [&.nav-scrolled]:backdrop-blur-md [&.nav-scrolled]:bg-black/30 [&.nav-scrolled]:border-b [&.nav-scrolled]:border-white/5"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary tracking-tight">
          Edvinas Giniotis
        </span>
        <a
          href={UPWORK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors duration-200"
        >
          Hire on Upwork
        </a>
      </div>
    </nav>
  )
}
