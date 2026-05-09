import { render, screen } from '@testing-library/react'
import Portfolio from '@/components/sections/Portfolio'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('Portfolio', () => {
  it('renders all three project names', () => {
    render(<Portfolio />)
    expect(screen.getByText('Nexus')).toBeInTheDocument()
    expect(screen.getByText('Flowboard')).toBeInTheDocument()
    expect(screen.getByText('Launchpad')).toBeInTheDocument()
  })

  it('labels all three cards as demos', () => {
    render(<Portfolio />)
    expect(screen.getAllByText('Demo')).toHaveLength(3)
  })
})
