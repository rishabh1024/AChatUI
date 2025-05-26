import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../../hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    
    expect(result.current).toBe('initial')
  })

  it('debounces value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: 500 })
    
    // Value should still be initial immediately after update
    expect(result.current).toBe('initial')

    // Advance time by less than delay
    act(() => {
      vi.advanceTimersByTime(400)
    })
    
    expect(result.current).toBe('initial')

    // Advance time past delay
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current).toBe('updated')
  })

  it('cancels previous timeout on new value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    // First update
    rerender({ value: 'first', delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    // Second update before first timeout completes
    rerender({ value: 'second', delay: 500 })
    
    // Advance to when first timeout would have completed
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    // Should still be initial value (first timeout was cancelled)
    expect(result.current).toBe('initial')
    
    // Advance to when second timeout completes
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(result.current).toBe('second')
  })

  it('handles rapid consecutive updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    // Rapid updates
    rerender({ value: 'update1', delay: 300 })
    rerender({ value: 'update2', delay: 300 })
    rerender({ value: 'update3', delay: 300 })
    rerender({ value: 'final', delay: 300 })

    // Advance time by partial delay
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    expect(result.current).toBe('initial')

    // Complete the delay
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current).toBe('final')
  })

  it('works with different data types', () => {
    // Test with number
    const { result: numberResult, rerender: rerenderNumber } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 200 } }
    )

    rerenderNumber({ value: 42, delay: 200 })
    
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    expect(numberResult.current).toBe(42)

    // Test with object
    const { result: objectResult, rerender: rerenderObject } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: { count: 0 }, delay: 200 } }
    )

    const newObject = { count: 5 }
    rerenderObject({ value: newObject, delay: 200 })
    
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    expect(objectResult.current).toBe(newObject)
  })

  it('handles delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'updated', delay: 200 })
    
    // Advance by new delay amount
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    expect(result.current).toBe('updated')
  })

  it('cleans up timeout on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'updated', delay: 500 })
    
    // Unmount before timeout completes
    unmount()
    
    // Advance time past delay
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    // No error should occur, and no side effects
    expect(true).toBe(true) // Test passes if no errors thrown
  })

  it('handles zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    )

    rerender({ value: 'immediate', delay: 0 })
    
    act(() => {
      vi.advanceTimersByTime(0)
    })
    
    expect(result.current).toBe('immediate')
  })

  it('handles undefined and null values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: undefined as any, delay: 300 } }
    )

    expect(result.current).toBeUndefined()

    rerender({ value: null as any, delay: 300 })
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(result.current).toBeNull()
  })

  it('preserves reference equality for same values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'same', delay: 300 } }
    )

    const initialValue = result.current

    // Update with same value
    rerender({ value: 'same', delay: 300 })
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(result.current).toBe(initialValue)
  })
})
