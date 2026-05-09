import { render, screen } from '@testing-library/react'
import Services from '@/components/sections/Services'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('Services', () => {
  it('renders all three service titles', () => {
    render(<Services />)
    expect(screen.getByText('SaaS MVP Build')).toBeInTheDocument()
    expect(screen.getByText('Product Iteration')).toBeInTheDocument()
    expect(screen.getByText('Technical Consulting')).toBeInTheDocument()
  })
})
