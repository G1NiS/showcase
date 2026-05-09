import { render, screen } from '@testing-library/react'
import ValueProps from '@/components/sections/ValueProps'

jest.mock('@/hooks/useScrollAnimation', () => ({
  useScrollAnimation: jest.fn(() => ({ current: null })),
}))

describe('ValueProps', () => {
  it('renders all three value propositions', () => {
    render(<ValueProps />)
    expect(screen.getByText('3-week')).toBeInTheDocument()
    expect(screen.getByText('Full-stack')).toBeInTheDocument()
    expect(screen.getByText('Clean code')).toBeInTheDocument()
  })
})
