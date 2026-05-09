import { render, screen } from '@testing-library/react'
import HeroSection from '@/components/hero/HeroSection'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    from: jest.fn(),
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}))

jest.mock('next/dynamic', () => () => {
  const Mock = () => null
  Mock.displayName = 'ThreeScene'
  return Mock
})

describe('HeroSection', () => {
  it('renders the headline', () => {
    render(<HeroSection />)
    expect(screen.getByText(/I build SaaS products/i)).toBeInTheDocument()
  })

  it('renders the Upwork CTA link', () => {
    render(<HeroSection />)
    expect(screen.getByRole('link', { name: /hire me on upwork/i })).toBeInTheDocument()
  })
})
