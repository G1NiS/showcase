import { render, screen } from '@testing-library/react'
import Footer from '@/components/footer/Footer'

describe('Footer', () => {
  it('renders the developer name', () => {
    render(<Footer />)
    expect(screen.getByText('Edvinas Giniotis')).toBeInTheDocument()
  })

  it('renders Upwork, GitHub, and Email links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /upwork/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument()
  })
})
