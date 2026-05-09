import { render, screen } from '@testing-library/react'
import Process from '@/components/sections/Process'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    from: jest.fn(),
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}))

describe('Process', () => {
  it('renders all four step titles', () => {
    render(<Process />)
    expect(screen.getByText('Discovery')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Build')).toBeInTheDocument()
    expect(screen.getByText('Launch')).toBeInTheDocument()
  })
})
