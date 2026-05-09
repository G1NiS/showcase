import { renderHook } from '@testing-library/react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    from: jest.fn(),
    context: jest.fn((fn: () => void, _scope?: unknown) => { fn(); return { revert: jest.fn() } }),
  },
  ScrollTrigger: {},
}))

describe('useScrollAnimation', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useScrollAnimation('[data-test]'))
    expect(result.current).toHaveProperty('current')
  })

  it('calls gsap.from with the selector', () => {
    const { gsap: mockGsap } = jest.requireMock('@/lib/gsap')
    renderHook(() => useScrollAnimation('[data-test]'))
    expect(mockGsap.from).toHaveBeenCalledWith('[data-test]', expect.objectContaining({
      opacity: 0,
      y: 40,
    }))
  })
})
