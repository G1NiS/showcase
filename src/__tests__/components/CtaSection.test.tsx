import { render, screen } from '@testing-library/react'
import CtaSection from '@/components/sections/CtaSection'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('CtaSection', () => {
  it('renders the headline', () => {
    render(<CtaSection />)
    expect(screen.getByText(/ready to build something/i)).toBeInTheDocument()
  })

  it('renders the Upwork CTA link', () => {
    render(<CtaSection />)
    expect(screen.getByRole('link', { name: /hire me on upwork/i })).toBeInTheDocument()
  })
})
