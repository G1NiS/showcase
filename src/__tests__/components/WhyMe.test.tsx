import { render, screen } from '@testing-library/react'
import WhyMe from '@/components/sections/WhyMe'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('WhyMe', () => {
  it('renders all three differentiator titles', () => {
    render(<WhyMe />)
    expect(screen.getByText('Solo dev speed')).toBeInTheDocument()
    expect(screen.getByText('Shipped products, not prototypes')).toBeInTheDocument()
    expect(screen.getByText('Async-friendly timezone')).toBeInTheDocument()
  })
})
