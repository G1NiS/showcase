import { render, screen } from '@testing-library/react'
import Navbar from '@/components/nav/Navbar'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {
    create: jest.fn(),
  },
}))

describe('Navbar', () => {
  it('renders the developer name', () => {
    render(<Navbar />)
    expect(screen.getByText('Edvinas Giniotis')).toBeInTheDocument()
  })

  it('renders the Upwork CTA link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /hire on upwork/i })).toBeInTheDocument()
  })
})
