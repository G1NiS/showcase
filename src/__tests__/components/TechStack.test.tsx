import { render, screen } from '@testing-library/react'
import TechStack from '@/components/sections/TechStack'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    to: jest.fn(),
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}))

describe('TechStack', () => {
  it('renders the section label', () => {
    render(<TechStack />)
    expect(screen.getByText(/tech stack/i)).toBeInTheDocument()
  })

  it('renders Next.js in the marquee', () => {
    render(<TechStack />)
    const items = screen.getAllByText('Next.js')
    expect(items.length).toBeGreaterThanOrEqual(1)
  })
})
