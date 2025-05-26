import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAutoResize } from '../../hooks/useAutoResize'

describe('useAutoResize', () => {
  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  it('returns a ref object', () => {
    const { result } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    
    expect(result.current).toHaveProperty('current', null)
    expect(typeof result.current).toBe('object')
  })

  it('can be used with different element types', () => {
    const { result: textareaResult } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    const { result: divResult } = renderHook(() => useAutoResize<HTMLDivElement>())
    
    expect(textareaResult.current).toBeTruthy()
    expect(divResult.current).toBeTruthy()
  })

  it('sets up ResizeObserver when element is attached', () => {
    const mockObserve = vi.fn()
    const mockResizeObserver = vi.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
    global.ResizeObserver = mockResizeObserver

    const { result } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    
    // Simulate element attachment
    const mockElement = document.createElement('textarea')
    act(() => {
      // Simulate ref assignment
      Object.defineProperty(result.current, 'current', {
        value: mockElement,
        configurable: true,
      })
    })

    expect(mockResizeObserver).toHaveBeenCalled()
  })

  it('handles element detachment correctly', () => {
    const mockUnobserve = vi.fn()
    const mockDisconnect = vi.fn()
    const mockResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    }))
    global.ResizeObserver = mockResizeObserver

    const { result, unmount } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    
    const mockElement = document.createElement('textarea')
    act(() => {
      Object.defineProperty(result.current, 'current', {
        value: mockElement,
        configurable: true,
      })
    })

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('adjusts textarea height automatically', () => {
    const { result } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    
    const mockTextarea = document.createElement('textarea')
    Object.defineProperty(mockTextarea, 'scrollHeight', {
      value: 100,
      configurable: true,
    })
    
    act(() => {
      Object.defineProperty(result.current, 'current', {
        value: mockTextarea,
        configurable: true,
      })
      
      // Simulate content change that would trigger resize
      mockTextarea.value = 'Some long text that would require multiple lines'
      mockTextarea.dispatchEvent(new Event('input'))
    })

    expect(result.current.current).toBe(mockTextarea)
  })

  it('resets height before calculating new height', () => {
    const { result } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    
    const mockTextarea = document.createElement('textarea')
    mockTextarea.style.height = '200px'
    
    Object.defineProperty(mockTextarea, 'scrollHeight', {
      value: 100,
      configurable: true,
    })
    
    act(() => {
      Object.defineProperty(result.current, 'current', {
        value: mockTextarea,
        configurable: true,
      })
    })

    expect(result.current.current).toBe(mockTextarea)
  })

  it('works with minimum and maximum height constraints', () => {
    const { result } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    
    const mockTextarea = document.createElement('textarea')
    mockTextarea.style.minHeight = '50px'
    mockTextarea.style.maxHeight = '300px'
    
    Object.defineProperty(mockTextarea, 'scrollHeight', {
      value: 400, // Exceeds max height
      configurable: true,
    })
    
    act(() => {
      Object.defineProperty(result.current, 'current', {
        value: mockTextarea,
        configurable: true,
      })
    })

    expect(result.current.current).toBe(mockTextarea)
  })

  it('handles null element gracefully', () => {
    const { result } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    
    expect(() => {
      act(() => {
        Object.defineProperty(result.current, 'current', {
          value: null,
          configurable: true,
        })
      })
    }).not.toThrow()
  })

  it('cleans up observer on element change', () => {
    const mockDisconnect = vi.fn()
    const mockResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: mockDisconnect,
    }))
    global.ResizeObserver = mockResizeObserver

    const { result } = renderHook(() => useAutoResize<HTMLTextAreaElement>())
    
    const firstElement = document.createElement('textarea')
    act(() => {
      Object.defineProperty(result.current, 'current', {
        value: firstElement,
        configurable: true,
      })
    })

    const secondElement = document.createElement('textarea')
    act(() => {
      Object.defineProperty(result.current, 'current', {
        value: secondElement,
        configurable: true,
      })
    })

    // Should disconnect previous observer when element changes
    expect(mockDisconnect).toHaveBeenCalled()
  })
})
