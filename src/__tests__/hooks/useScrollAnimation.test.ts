import { renderHook } from '@testing-library/react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    from: jest.fn(),
    context: jest.fn((_fn: () => void, _scope?: unknown) => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}))

describe('useScrollAnimation', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useScrollAnimation('[data-test]'))
    expect(result.current).toHaveProperty('current')
  })
})
